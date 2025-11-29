export interface PersonData {
  id: string;
  name: string;
  relation: string;
  age?: number;
  lastVisit: string;
  conversationSummary: string;
  currentUpdate: string;
  avatar: string;
}

export const mockPeople: Record<string, PersonData> = {
  alone: {
    id: "alone",
    name: "",
    relation: "",
    lastVisit: "",
    conversationSummary: "",
    currentUpdate: "",
    avatar: "",
  },
  daughter: {
    id: "daughter",
    name: "Sarah Banerjee",
    relation: "Daughter",
    age: 24,
    lastVisit: "5 days ago",
    conversationSummary: "You talked about her new job at the design studio and her upcoming trip to visit her college friend in Portland.",
    currentUpdate: "Sarah just got promoted to Senior Designer! She's very excited to share the news with you.",
    avatar: "👩‍🦰",
  },
  nurse: {
    id: "nurse",
    name: "Daniel Chen",
    relation: "Home Nurse",
    age: 35,
    lastVisit: "Yesterday",
    conversationSummary: "Daniel helped with your morning routine and you both watched a gardening show together.",
    currentUpdate: "Daniel is here for your regular check-up. He mentioned he tried your recipe for banana bread!",
    avatar: "👨‍⚕️",
  },
  neighbor: {
    id: "neighbor",
    name: "Margaret Wilson",
    relation: "Neighbor",
    age: 68,
    lastVisit: "2 weeks ago",
    conversationSummary: "Margaret brought over cookies and you discussed the community garden project.",
    currentUpdate: "Margaret wants to invite you to the neighborhood book club meeting this Saturday.",
    avatar: "👵",
  },
};

export const demoSequence = [
  { personId: "alone", duration: 3000, label: "Alone" },
  { personId: "daughter", duration: 6000, label: "Daughter" },
  { personId: "nurse", duration: 6000, label: "Nurse" },
  { personId: "neighbor", duration: 6000, label: "Neighbor" },
];

export const problemCards = [
  {
    icon: "😰",
    title: "Confusion During Conversations",
    description: "Difficulty recognizing familiar faces mid-conversation can cause significant distress and communication breakdowns.",
  },
  {
    icon: "💔",
    title: "Emotional Distress",
    description: "When loved ones feel unfamiliar, it creates emotional pain for both patients and their families.",
  },
  {
    icon: "🚪",
    title: "Social Withdrawal",
    description: "Fear of confusion often leads to avoiding social interactions, increasing isolation and loneliness.",
  },
];

export const howItWorksSteps = [
  {
    step: 1,
    icon: "👤",
    title: "Recognizes Visitors",
    description: "The system identifies who has entered the room (simulated in this prototype using mock data).",
  },
  {
    step: 2,
    icon: "📋",
    title: "Retrieves Context",
    description: "Pulls up caregiver-provided information about the visitor, their relationship, and past interactions.",
  },
  {
    step: 3,
    icon: "📱",
    title: "Displays Reminder",
    description: "Shows a calm, easy-to-read screen with helpful context to support the conversation.",
  },
];

export const whatWeProvide = [
  "Gentle reminders about visitors",
  "Support during conversations",
  "Reduced confusion and anxiety",
  "Help for families and caregivers",
];

export const whatWeDont = [
  "No medical diagnosing",
  "No medical decisions",
  "Not a replacement for therapy",
  "Not a medical device",
];
