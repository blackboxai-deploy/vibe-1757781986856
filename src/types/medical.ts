export interface RadiologyReport {
  id: string;
  patientId: string;
  patientName: string;
  studyDate: Date;
  modality: Modality;
  bodyPart: string;
  reportText: string;
  findings: CriticalFinding[];
  urgencyLevel: UrgencyLevel;
  status: ReportStatus;
  analyzedAt?: Date;
  communicatedAt?: Date;
  physicianNotified?: boolean;
}

export interface CriticalFinding {
  id: string;
  description: string;
  severity: UrgencyLevel;
  category: FindingCategory;
  location: string;
  recommendation: string;
  keyTerms: string[];
  confidence: number;
  requiresImmediateAttention: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  medicalRecordNumber: string;
  attendingPhysician?: string;
  ward?: string;
}

export interface CommunicationTemplate {
  urgencyLevel: UrgencyLevel;
  subject: string;
  message: string;
  timeframe: string;
  channels: CommunicationChannel[];
}

export interface AnalysisResult {
  reportId: string;
  criticalFindings: CriticalFinding[];
  overallUrgency: UrgencyLevel;
  processingTime: number;
  confidence: number;
  recommendedActions: string[];
  communicationSuggestion: CommunicationTemplate;
}

export interface MedicalKnowledge {
  criticalTerms: Record<string, CriticalTermDefinition>;
  urgencyRules: UrgencyRule[];
  modalitySpecific: Record<Modality, ModalityRules>;
}

export interface CriticalTermDefinition {
  term: string;
  category: FindingCategory;
  baseUrgency: UrgencyLevel;
  synonyms: string[];
  contextModifiers: ContextModifier[];
  description: string;
}

export interface UrgencyRule {
  id: string;
  condition: string;
  urgencyLevel: UrgencyLevel;
  weight: number;
  description: string;
}

export interface ContextModifier {
  modifier: string;
  urgencyChange: number;
  description: string;
}

export interface ModalityRules {
  modality: Modality;
  specificTerms: string[];
  urgencyModifiers: Record<string, number>;
  typicalFindings: string[];
}

// Enums
export enum UrgencyLevel {
  CRITICAL = 'CRITICAL',
  URGENT = 'URGENT', 
  ATTENTION = 'ATTENTION',
  NORMAL = 'NORMAL'
}

export enum FindingCategory {
  HEMORRHAGE = 'HEMORRHAGE',
  MASS_EFFECT = 'MASS_EFFECT',
  OBSTRUCTION = 'OBSTRUCTION',
  FRACTURE = 'FRACTURE',
  INFECTION = 'INFECTION',
  VASCULAR = 'VASCULAR',
  RESPIRATORY = 'RESPIRATORY',
  GASTROINTESTINAL = 'GASTROINTESTINAL',
  GENITOURINARY = 'GENITOURINARY',
  OTHER = 'OTHER'
}

export enum Modality {
  CT = 'CT',
  MRI = 'MRI',
  XRAY = 'XRAY',
  ULTRASOUND = 'ULTRASOUND',
  MAMMOGRAPHY = 'MAMMOGRAPHY',
  NUCLEAR = 'NUCLEAR',
  FLUOROSCOPY = 'FLUOROSCOPY'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  ANALYZED = 'ANALYZED',
  COMMUNICATED = 'COMMUNICATED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  ERROR = 'ERROR'
}

export enum CommunicationChannel {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  PAGER = 'PAGER',
  IN_PERSON = 'IN_PERSON'
}

// Utility Types
export interface FileUpload {
  file: File;
  content: string;
  extractedText: string;
  patientInfo?: Partial<Patient>;
}

export interface AnalysisHistory {
  reports: RadiologyReport[];
  totalAnalyzed: number;
  criticalCount: number;
  urgentCount: number;
  lastAnalysis: Date;
}

export interface DashboardStats {
  todayAnalyzed: number;
  criticalFindings: number;
  pendingCommunications: number;
  avgProcessingTime: number;
  urgencyDistribution: Record<UrgencyLevel, number>;
}

export interface NotificationSettings {
  enableEmailAlerts: boolean;
  enableSMSAlerts: boolean;
  criticalThreshold: number;
  urgentThreshold: number;
  autoNotifyPhysicians: boolean;
}