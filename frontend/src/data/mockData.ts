// Mock data for Tandarust AI

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  symptoms: string;
  urgencyScore: number;
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  waitTime: string;
  avatar: string;
  history: string[];
  riskScores: { condition: string; score: number; level: string }[];
  aiSummary: string;
}

export interface Prescription {
  id: string;
  patientName: string;
  date: string;
  medications: {
    drug: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  status: "Pending" | "Digitized" | "Verified";
  imageUrl?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export const patients: Patient[] = [
  {
    id: "P001",
    name: "Ahmed Khan",
    age: 45,
    gender: "Male",
    symptoms: "Severe chest pain, shortness of breath, dizziness for 2 hours",
    urgencyScore: 95,
    urgencyLevel: "Critical",
    waitTime: "Immediate",
    avatar: "AK",
    history: ["Hypertension", "Type 2 Diabetes", "Previous MI (2023)"],
    riskScores: [
      { condition: "Cardiac Event", score: 92, level: "Critical" },
      { condition: "Stroke", score: 68, level: "High" },
      { condition: "Diabetic Complication", score: 45, level: "Medium" },
    ],
    aiSummary:
      "Patient presents with acute chest pain and dyspnea. Given history of MI and current symptoms, immediate cardiac evaluation recommended. ECG and troponin levels should be prioritized. High risk for acute coronary syndrome.",
  },
  {
    id: "P002",
    name: "Fatima Bibi",
    age: 32,
    gender: "Female",
    symptoms: "Persistent headache for 3 days, mild fever, nausea",
    urgencyScore: 55,
    urgencyLevel: "Medium",
    waitTime: "20 min",
    avatar: "FB",
    history: ["Migraine history", "Allergies"],
    riskScores: [
      { condition: "Neurological", score: 35, level: "Low" },
      { condition: "Infection", score: 42, level: "Medium" },
    ],
    aiSummary:
      "Patient reports 3-day headache with mild fever. Given migraine history, likely an exacerbation. Monitor for signs of meningitis if fever persists or worsens. Recommend analgesics and hydration.",
  },
  {
    id: "P003",
    name: "Zain Ul Abideen",
    age: 67,
    gender: "Male",
    symptoms: "Difficulty breathing, chronic cough, weight loss over 2 months",
    urgencyScore: 78,
    urgencyLevel: "High",
    waitTime: "5 min",
    avatar: "ZA",
    history: ["COPD", "30-year smoking history", "Hypertension"],
    riskScores: [
      { condition: "COPD Exacerbation", score: 82, level: "High" },
      { condition: "Lung Cancer", score: 58, level: "Medium" },
      { condition: "Cardiac", score: 40, level: "Medium" },
    ],
    aiSummary:
      "Elderly male with progressive dyspnea and weight loss. Given COPD and extensive smoking history, chest X-ray and pulmonary function tests recommended urgently. Consider malignancy workup given weight loss.",
  },
  {
    id: "P004",
    name: "Ayesha Siddiqui",
    age: 28,
    gender: "Female",
    symptoms: "Sore throat, runny nose, mild body aches for 1 day",
    urgencyScore: 20,
    urgencyLevel: "Low",
    waitTime: "45 min",
    avatar: "AS",
    history: ["No significant history"],
    riskScores: [
      { condition: "Upper Respiratory Infection", score: 15, level: "Low" },
    ],
    aiSummary:
      "Young female with classic URI symptoms. Low risk for complications. Symptomatic treatment with rest, fluids, and OTC analgesics recommended. Follow up if symptoms worsen or persist beyond 7 days.",
  },
  {
    id: "P005",
    name: "Muhammad Usman",
    age: 53,
    gender: "Male",
    symptoms: "Sudden vision blurring in right eye, numbness in left hand",
    urgencyScore: 90,
    urgencyLevel: "Critical",
    waitTime: "Immediate",
    avatar: "MU",
    history: ["Hypertension", "Atrial Fibrillation", "High Cholesterol"],
    riskScores: [
      { condition: "Stroke (TIA)", score: 88, level: "Critical" },
      { condition: "Cardiac", score: 55, level: "Medium" },
    ],
    aiSummary:
      "Patient presents with acute unilateral vision loss and contralateral numbness — highly suggestive of TIA/stroke. Immediate CT/MRI brain recommended. Time-sensitive: assess for thrombolysis eligibility.",
  },
  {
    id: "P006",
    name: "Nadia Pervaiz",
    age: 40,
    gender: "Female",
    symptoms: "Joint pain in knees and hands, morning stiffness, fatigue",
    urgencyScore: 40,
    urgencyLevel: "Medium",
    waitTime: "30 min",
    avatar: "NP",
    history: ["Family history of rheumatoid arthritis"],
    riskScores: [
      { condition: "Rheumatoid Arthritis", score: 52, level: "Medium" },
      { condition: "Autoimmune", score: 38, level: "Low" },
    ],
    aiSummary:
      "Patient reports bilateral joint pain with morning stiffness suggestive of inflammatory arthritis. Given family history, recommend RF factor, anti-CCP antibodies, and ESR testing. NSAID trial for symptom management.",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "RX001",
    patientName: "Ahmed Khan",
    date: "2026-02-12",
    medications: [
      {
        drug: "Aspirin",
        dosage: "75mg",
        frequency: "Once daily",
        duration: "Ongoing",
      },
      {
        drug: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "Ongoing",
      },
      {
        drug: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "Ongoing",
      },
      {
        drug: "Nitroglycerin SL",
        dosage: "0.4mg",
        frequency: "PRN chest pain",
        duration: "As needed",
      },
    ],
    status: "Verified",
  },
  {
    id: "RX002",
    patientName: "Fatima Bibi",
    date: "2026-02-12",
    medications: [
      {
        drug: "Paracetamol",
        dosage: "500mg",
        frequency: "Every 6 hours",
        duration: "5 days",
      },
      {
        drug: "Sumatriptan",
        dosage: "50mg",
        frequency: "PRN migraine",
        duration: "As needed",
      },
    ],
    status: "Digitized",
  },
  {
    id: "RX003",
    patientName: "Zain Ul Abideen",
    date: "2026-02-11",
    medications: [
      {
        drug: "Salbutamol Inhaler",
        dosage: "100mcg",
        frequency: "4 puffs PRN",
        duration: "Ongoing",
      },
      {
        drug: "Prednisolone",
        dosage: "30mg",
        frequency: "Once daily",
        duration: "5 days",
      },
      {
        drug: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "7 days",
      },
    ],
    status: "Pending",
  },
];

export const features: Feature[] = [
  {
    title: "Patient Prioritization",
    description:
      "AI-driven urgency scoring automatically ranks patients by severity, ensuring critical cases receive immediate attention.",
    icon: "IconHeartbeat",
  },
  {
    title: "Prescription Digitizer",
    description:
      "Upload handwritten prescriptions and get structured, machine-readable medication data in seconds using advanced OCR.",
    icon: "IconFileText",
  },
  {
    title: "Health Risk Prediction",
    description:
      "Predictive analytics analyze symptoms and patient history to flag potential health risks before they become emergencies.",
    icon: "IconShieldCheck",
  },
  {
    title: "Doctor Dashboard",
    description:
      "A comprehensive real-time view of patient queue, risk alerts, prescription history, and AI-generated summaries.",
    icon: "IconLayoutDashboard",
  },
  {
    title: "Bilingual Support",
    description:
      "Full English and Urdu language support with RTL layouts, making healthcare accessible to all patients.",
    icon: "IconLanguage",
  },
  {
    title: "Explainable AI",
    description:
      "Every AI decision comes with clear reasoning, helping doctors understand and trust the system's recommendations.",
    icon: "IconBrain",
  },
];

export const dashboardStats = {
  totalPatients: 24,
  criticalPatients: 3,
  pendingReviews: 8,
  avgWaitTime: "18 min",
  prescriptionsToday: 12,
  riskAlerts: 5,
};

export const howItWorks = [
  {
    step: 1,
    title: "Patient Input",
    description:
      "Patients enter symptoms via text, voice input, or upload a prescription photo through our intuitive interface.",
  },
  {
    step: 2,
    title: "AI Analysis",
    description:
      "Our multi-agent AI system processes the data — prioritizing urgency, digitizing prescriptions, and predicting health risks.",
  },
  {
    step: 3,
    title: "Doctor Dashboard",
    description:
      "Doctors see a prioritized queue with AI summaries, risk alerts, and structured prescriptions — all in one place.",
  },
];
