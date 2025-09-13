import { 
  MedicalKnowledge, 
  CriticalTermDefinition, 
  UrgencyLevel, 
  FindingCategory, 
  Modality, 
  UrgencyRule
} from '@/types/medical';

export const CRITICAL_TERMS: Record<string, CriticalTermDefinition> = {
  // Hemorragias Críticas
  'hematoma_subdural': {
    term: 'hematoma subdural',
    category: FindingCategory.HEMORRHAGE,
    baseUrgency: UrgencyLevel.CRITICAL,
    synonyms: ['hematoma subdural agudo', 'coleção subdural', 'sangramento subdural'],
    contextModifiers: [
      { modifier: 'agudo', urgencyChange: 1, description: 'Aumenta criticidade' },
      { modifier: 'desvio da linha média', urgencyChange: 2, description: 'Extremamente crítico' }
    ],
    description: 'Coleção de sangue entre a dura-máter e aracnoide'
  },
  
  'hemorragia_subaracnoidea': {
    term: 'hemorragia subaracnóidea',
    category: FindingCategory.HEMORRHAGE,
    baseUrgency: UrgencyLevel.CRITICAL,
    synonyms: ['HSA', 'sangramento subaracnoideo', 'hemorragia subaracnoidea'],
    contextModifiers: [
      { modifier: 'extensa', urgencyChange: 1, description: 'Mais grave' },
      { modifier: 'aneurismática', urgencyChange: 2, description: 'Requer intervenção imediata' }
    ],
    description: 'Sangramento no espaço subaracnóideo'
  },

  // Massas com Efeito
  'efeito_massa': {
    term: 'efeito de massa',
    category: FindingCategory.MASS_EFFECT,
    baseUrgency: UrgencyLevel.CRITICAL,
    synonyms: ['compressão', 'deslocamento de estruturas', 'herniação'],
    contextModifiers: [
      { modifier: 'herniação transtentorial', urgencyChange: 3, description: 'Emergência neurocirúrgica' },
      { modifier: 'deslocamento da linha média', urgencyChange: 2, description: 'Muito grave' }
    ],
    description: 'Compressão ou deslocamento de estruturas adjacentes'
  },

  // Obstruções
  'obstrucao_intestinal': {
    term: 'obstrução intestinal',
    category: FindingCategory.OBSTRUCTION,
    baseUrgency: UrgencyLevel.URGENT,
    synonyms: ['íleo', 'obstrução do intestino', 'bloqueio intestinal'],
    contextModifiers: [
      { modifier: 'completa', urgencyChange: 1, description: 'Mais grave que parcial' },
      { modifier: 'estrangulada', urgencyChange: 2, description: 'Requer cirurgia imediata' }
    ],
    description: 'Bloqueio do trânsito intestinal'
  },

  'hidrocefalia': {
    term: 'hidrocefalia',
    category: FindingCategory.OBSTRUCTION,
    baseUrgency: UrgencyLevel.URGENT,
    synonyms: ['dilatação ventricular', 'ventriculomegalia'],
    contextModifiers: [
      { modifier: 'aguda', urgencyChange: 2, description: 'Emergência neurocirúrgica' },
      { modifier: 'obstrutiva', urgencyChange: 1, description: 'Requer avaliação urgente' }
    ],
    description: 'Acúmulo anormal de líquido cefalorraquidiano'
  },

  // Fraturas Críticas
  'fratura_cervical': {
    term: 'fratura cervical',
    category: FindingCategory.FRACTURE,
    baseUrgency: UrgencyLevel.CRITICAL,
    synonyms: ['fratura da coluna cervical', 'fratura de vértebra cervical'],
    contextModifiers: [
      { modifier: 'instável', urgencyChange: 2, description: 'Risco de lesão medular' },
      { modifier: 'com deslocamento', urgencyChange: 1, description: 'Requer imobilização' }
    ],
    description: 'Fratura das vértebras cervicais'
  },

  // Condições Vasculares
  'embolia_pulmonar': {
    term: 'embolia pulmonar',
    category: FindingCategory.VASCULAR,
    baseUrgency: UrgencyLevel.CRITICAL,
    synonyms: ['TEP', 'tromboembolismo pulmonar', 'êmbolo pulmonar'],
    contextModifiers: [
      { modifier: 'maciça', urgencyChange: 2, description: 'Risco de morte súbita' },
      { modifier: 'bilateral', urgencyChange: 1, description: 'Mais grave' }
    ],
    description: 'Obstrução de artéria pulmonar por êmbolo'
  },

  'avc_agudo': {
    term: 'AVC agudo',
    category: FindingCategory.VASCULAR,
    baseUrgency: UrgencyLevel.CRITICAL,
    synonyms: ['acidente vascular cerebral', 'derrame cerebral', 'isquemia cerebral aguda'],
    contextModifiers: [
      { modifier: 'janela terapêutica', urgencyChange: 2, description: 'Urgência para trombólise' },
      { modifier: 'território extenso', urgencyChange: 1, description: 'Maior gravidade' }
    ],
    description: 'Interrupção aguda do fluxo sanguíneo cerebral'
  },

  // Condições Respiratórias
  'pneumotorax_tensao': {
    term: 'pneumotórax hipertensivo',
    category: FindingCategory.RESPIRATORY,
    baseUrgency: UrgencyLevel.CRITICAL,
    synonyms: ['pneumotórax tensão', 'pneumotórax sob tensão'],
    contextModifiers: [
      { modifier: 'desvio mediastinal', urgencyChange: 2, description: 'Emergência torácica' }
    ],
    description: 'Pneumotórax com aumento progressivo da pressão'
  },

  // Infecções Graves
  'abscesso_cerebral': {
    term: 'abscesso cerebral',
    category: FindingCategory.INFECTION,
    baseUrgency: UrgencyLevel.URGENT,
    synonyms: ['abscesso intracraniano', 'coleção infectada cerebral'],
    contextModifiers: [
      { modifier: 'efeito de massa', urgencyChange: 1, description: 'Requer drenagem urgente' },
      { modifier: 'múltiplos', urgencyChange: 1, description: 'Mais complexo' }
    ],
    description: 'Coleção purulenta no parênquima cerebral'
  }
};

export const URGENCY_RULES: UrgencyRule[] = [
  {
    id: 'hemorrhage_acute',
    condition: 'hemorragia + agudo',
    urgencyLevel: UrgencyLevel.CRITICAL,
    weight: 3,
    description: 'Hemorragias agudas requerem avaliação imediata'
  },
  {
    id: 'mass_effect_midline',
    condition: 'efeito de massa + desvio linha média',
    urgencyLevel: UrgencyLevel.CRITICAL,
    weight: 3,
    description: 'Efeito de massa com desvio é emergência neurocirúrgica'
  },
  {
    id: 'fracture_unstable',
    condition: 'fratura + instável',
    urgencyLevel: UrgencyLevel.CRITICAL,
    weight: 2,
    description: 'Fraturas instáveis requerem estabilização urgente'
  },
  {
    id: 'vascular_acute',
    condition: 'vascular + agudo',
    urgencyLevel: UrgencyLevel.CRITICAL,
    weight: 2,
    description: 'Emergências vasculares agudas'
  },
  {
    id: 'obstruction_complete',
    condition: 'obstrução + completa',
    urgencyLevel: UrgencyLevel.URGENT,
    weight: 2,
    description: 'Obstruções completas requerem intervenção rápida'
  }
];

export const MODALITY_SPECIFIC_KNOWLEDGE = {
  [Modality.CT]: {
    modality: Modality.CT,
    specificTerms: [
      'hipodensidade aguda', 'hiperdensidade', 'realce patológico',
      'coleções', 'pneumoencéfalo', 'edema cerebral'
    ],
    urgencyModifiers: {
      'hiperdensidade aguda': 1,
      'edema cerebral extenso': 2,
      'pneumoencéfalo': 1
    },
    typicalFindings: [
      'hemorragia aguda', 'infartos cerebrais', 'fraturas ósseas',
      'coleções líquidas', 'massas com efeito'
    ]
  },
  [Modality.MRI]: {
    modality: Modality.MRI,
    specificTerms: [
      'hipersinal', 'hiposinal', 'difusão restrita',
      'realce pelo contraste', 'edema vasogênico'
    ],
    urgencyModifiers: {
      'difusão restrita aguda': 2,
      'edema vasogênico extenso': 1,
      'realce anelar': 1
    },
    typicalFindings: [
      'isquemia aguda', 'processos inflamatórios', 'tumores',
      'malformações vasculares', 'lesões desmielinizantes'
    ]
  },
  [Modality.XRAY]: {
    modality: Modality.XRAY,
    specificTerms: [
      'fraturas', 'pneumotórax', 'derrame pleural',
      'consolidações', 'atelectasias'
    ],
    urgencyModifiers: {
      'pneumotórax hipertensivo': 3,
      'fratura exposta': 2,
      'derrame pleural maciço': 1
    },
    typicalFindings: [
      'fraturas ósseas', 'pneumonias', 'pneumotórax',
      'derrames pleurais', 'obstruções intestinais'
    ]
  },
  [Modality.ULTRASOUND]: {
    modality: Modality.ULTRASOUND,
    specificTerms: [
      'coleções líquidas', 'dilatação', 'espessamento',
      'calcificações', 'massas sólidas'
    ],
    urgencyModifiers: {
      'coleção infectada': 2,
      'obstrução aguda': 2,
      'massa complexa': 1
    },
    typicalFindings: [
      'cálculos', 'cistos', 'massas', 'dilatações',
      'coleções líquidas', 'alterações vasculares'
    ]
  },
  [Modality.MAMMOGRAPHY]: {
    modality: Modality.MAMMOGRAPHY,
    specificTerms: [
      'nódulo', 'microcalcificações', 'distorção arquitetural',
      'densidades assimétricas', 'espessamento'
    ],
    urgencyModifiers: {
      'nódulo suspeito': 2,
      'microcalcificações agrupadas': 1,
      'distorção arquitetural': 1
    },
    typicalFindings: [
      'nódulos benignos', 'cistos', 'fibroadenomas',
      'alterações fibrocísticas', 'calcificações'
    ]
  },
  [Modality.NUCLEAR]: {
    modality: Modality.NUCLEAR,
    specificTerms: [
      'hipocaptação', 'hipercaptação', 'defeito perfusional',
      'uptake anômalo', 'distribuição heterogênea'
    ],
    urgencyModifiers: {
      'defeito perfusional extenso': 2,
      'hipocaptação severa': 1,
      'uptake patológico': 1
    },
    typicalFindings: [
      'perfusão miocárdica', 'função renal', 'uptake ósseo',
      'distribuição radiofármaco', 'cintigrafia'
    ]
  },
  [Modality.FLUOROSCOPY]: {
    modality: Modality.FLUOROSCOPY,
    specificTerms: [
      'extravasamento', 'obstrução', 'refluxo',
      'estenose', 'dilatação'
    ],
    urgencyModifiers: {
      'extravasamento ativo': 3,
      'obstrução completa': 2,
      'perfuração': 3
    },
    typicalFindings: [
      'trânsito normal', 'refluxo gastroesofágico',
      'obstruções parciais', 'estenoses'
    ]
  }
};

export const MEDICAL_KNOWLEDGE: MedicalKnowledge = {
  criticalTerms: CRITICAL_TERMS,
  urgencyRules: URGENCY_RULES,
  modalitySpecific: MODALITY_SPECIFIC_KNOWLEDGE
};

// Funções auxiliares para análise
export function getCriticalTerm(term: string): CriticalTermDefinition | null {
  const normalizedTerm = term.toLowerCase().trim();
  
  // Busca exata
  const exactMatch = Object.values(CRITICAL_TERMS).find(
    t => t.term.toLowerCase() === normalizedTerm
  );
  if (exactMatch) return exactMatch;
  
  // Busca por sinônimos
  const synonymMatch = Object.values(CRITICAL_TERMS).find(
    t => t.synonyms.some(s => s.toLowerCase().includes(normalizedTerm))
  );
  if (synonymMatch) return synonymMatch;
  
  // Busca parcial
  const partialMatch = Object.values(CRITICAL_TERMS).find(
    t => t.term.toLowerCase().includes(normalizedTerm) || 
         normalizedTerm.includes(t.term.toLowerCase())
  );
  
  return partialMatch || null;
}

export function calculateUrgencyScore(findings: string[], modality: Modality): number {
  let score = 0;
  const modalityRules = MODALITY_SPECIFIC_KNOWLEDGE[modality] || null;
  
  findings.forEach(finding => {
    const term = getCriticalTerm(finding);
    if (term) {
      // Pontuação base pela urgência
      switch (term.baseUrgency) {
        case UrgencyLevel.CRITICAL: score += 10; break;
        case UrgencyLevel.URGENT: score += 7; break;
        case UrgencyLevel.ATTENTION: score += 4; break;
        default: score += 1;
      }
      
      // Modificadores de contexto
      term.contextModifiers.forEach(modifier => {
        if (finding.toLowerCase().includes(modifier.modifier.toLowerCase())) {
          score += modifier.urgencyChange;
        }
      });
      
      // Modificadores específicos da modalidade
      if (modalityRules) {
        Object.entries(modalityRules.urgencyModifiers).forEach(([key, value]) => {
          if (finding.toLowerCase().includes(key.toLowerCase())) {
            score += value;
          }
        });
      }
    }
  });
  
  return score;
}

export function determineOverallUrgency(score: number): UrgencyLevel {
  if (score >= 15) return UrgencyLevel.CRITICAL;
  if (score >= 10) return UrgencyLevel.URGENT;
  if (score >= 5) return UrgencyLevel.ATTENTION;
  return UrgencyLevel.NORMAL;
}