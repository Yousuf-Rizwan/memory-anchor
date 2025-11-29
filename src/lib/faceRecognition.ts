import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use local models
env.allowLocalModels = false;
env.allowRemoteModels = true;

let faceDetector: any = null;
let featureExtractor: any = null;

export const initializeFaceDetection = async () => {
  console.log('Initializing face detection models...');
  
  try {
    // Load face detection model
    if (!faceDetector) {
      faceDetector = await pipeline(
        'object-detection',
        'Xenova/detr-resnet-50',
        { device: 'webgpu' }
      );
      console.log('Face detection model loaded');
    }

    // Load feature extraction for face embeddings
    if (!featureExtractor) {
      featureExtractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
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
  if (!faceDetector) {
    await initializeFaceDetection();
  }

  try {
    console.log('Detecting faces...');

    // Always convert input to a canvas + base64 image so transformers.js
    // receives a supported input type (string data URL)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    if (imageElement instanceof HTMLVideoElement) {
      if (!imageElement.videoWidth || !imageElement.videoHeight) {
        console.warn('Video dimensions not ready for face detection');
        return [];
      }
      canvas.width = imageElement.videoWidth;
      canvas.height = imageElement.videoHeight;
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    } else if (imageElement instanceof HTMLImageElement) {
      if (!imageElement.naturalWidth || !imageElement.naturalHeight) {
        console.warn('Image dimensions not ready for face detection');
        return [];
      }
      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    } else {
      // HTMLCanvasElement
      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      ctx.drawImage(imageElement, 0, 0);
    }

    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    const results = await faceDetector(imageData, {
      threshold: 0.5,
      percentage: true,
    });

    console.log('Face detection results:', results);
    return results;
  } catch (error) {
    console.error('Face detection error:', error);
    return [];
  }
};

export const extractFaceEmbedding = async (canvas: HTMLCanvasElement): Promise<number[]> => {
  if (!featureExtractor) {
    await initializeFaceDetection();
  }

  try {
    console.log('Extracting face embedding...');
    
    // Convert canvas to image data
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Extract features
    const result = await featureExtractor(canvas, {
      pooling: 'mean',
      normalize: true,
    });

    // Convert to array
    const embedding: number[] = Array.from(result.data as ArrayLike<number>);
    console.log('Face embedding extracted, length:', embedding.length);
    
    return embedding;
  } catch (error) {
    console.error('Feature extraction error:', error);
    throw error;
  }
};

export const compareFaceEmbeddings = (embedding1: number[], embedding2: number[]): number => {
  if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
    return 0;
  }

  // Calculate cosine similarity
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  return similarity;
};

export const cropFaceFromVideo = (
  videoElement: HTMLVideoElement,
  boundingBox: { xmin: number; ymin: number; xmax: number; ymax: number }
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // Convert percentage to pixels
  const x = boundingBox.xmin * videoElement.videoWidth;
  const y = boundingBox.ymin * videoElement.videoHeight;
  const width = (boundingBox.xmax - boundingBox.xmin) * videoElement.videoWidth;
  const height = (boundingBox.ymax - boundingBox.ymin) * videoElement.videoHeight;

  // Set canvas size to face dimensions
  canvas.width = width;
  canvas.height = height;

  // Draw cropped face
  ctx.drawImage(
    videoElement,
    x, y, width, height,
    0, 0, width, height
  );

  return canvas;
};
