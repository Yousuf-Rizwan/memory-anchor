import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to download models locally in the browser
env.allowLocalModels = false;
env.allowRemoteModels = true;

let faceDetector: any = null;
let featureExtractor: any = null;

export const initializeFaceDetection = async () => {
  console.log('Initializing AI models...');
  
  try {
    // 1. Load Object Detection Model (Finds people in the frame)
    if (!faceDetector) {
      faceDetector = await pipeline(
        'object-detection',
        'Xenova/detr-resnet-50',
        { device: 'webgpu' }
      );
      console.log('Detection model loaded');
    }

    // 2. Load Feature Extraction Model (Creates unique ID for the face/person)
    // We switched to CLIP because it is designed for Images, whereas MiniLM is for Text.
    if (!featureExtractor) {
      featureExtractor = await pipeline(
        'feature-extraction',
        'Xenova/clip-vit-base-patch32',
        { device: 'webgpu' }
      );
      console.log('Feature extraction model loaded');
    }

    return { faceDetector, featureExtractor };
  } catch (error) {
    console.error('Error initializing models:', error);
    throw error;
  }
};

export const detectFaces = async (imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
  if (!faceDetector) await initializeFaceDetection();

  try {
    // Detect objects
    const results = await faceDetector(imageElement, { threshold: 0.5 });
    
    // Filter specifically for "person" class to ignore other objects
    // Note: This model detects "people", not just "faces".
    const people = results.filter((result: any) => result.label === 'person');
    
    return people;
  } catch (error) {
    console.error('Detection error:', error);
    return [];
  }
};

export const extractFaceEmbedding = async (canvas: HTMLCanvasElement): Promise<number[]> => {
  if (!featureExtractor) await initializeFaceDetection();

  try {
    // CLIP expects the image directly
    const result = await featureExtractor(canvas);
    
    // Flatten tensor to simple array
    const embedding = Array.from(result.data as Float32Array);
    return embedding;
  } catch (error) {
    console.error('Feature extraction error:', error);
    throw error;
  }
};

export const compareFaceEmbeddings = (embedding1: number[], embedding2: number[]): number => {
  if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) return 0;

  // Cosine Similarity Calculation
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

export const cropFaceFromVideo = (
  videoElement: HTMLVideoElement,
  boundingBox: { xmin: number; ymin: number; xmax: number; ymax: number }
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // The model returns absolute pixels, so we use them directly
  const x = boundingBox.xmin;
  const y = boundingBox.ymin;
  const width = boundingBox.xmax - boundingBox.xmin;
  const height = boundingBox.ymax - boundingBox.ymin;

  // Set canvas to the size of the detected person
  canvas.width = width;
  canvas.height = height;

  // Draw only the detected person onto the canvas
  ctx.drawImage(
    videoElement,
    x, y, width, height, // Source rect
    0, 0, width, height  // Destination rect
  );

  return canvas;
};
