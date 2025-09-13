import {
  RadiologyReport,
  CriticalFinding,
  AnalysisResult,
  UrgencyLevel,
  FindingCategory,
  Modality,
  CommunicationTemplate,
  CommunicationChannel
} from '@/types/medical';

export class RadiologyAIAnalyzer {
  private criticalTerms = {
    'hematoma subdural': { category: FindingCategory.HEMORRHAGE, urgency: UrgencyLevel.CRITICAL },
    'hemorragia subaracnóidea': { category: FindingCategory.HEMORRHAGE, urgency: UrgencyLevel.CRITICAL },
    'avc agudo': { category: FindingCategory.VASCULAR, urgency: UrgencyLevel.CRITICAL },
    'embolia pulmonar': { category: FindingCategory.VASCULAR, urgency: UrgencyLevel.CRITICAL },
    'pneumotórax': { category: FindingCategory.RESPIRATORY, urgency: UrgencyLevel.URGENT },
    'obstrução intestinal': { category: FindingCategory.OBSTRUCTION, urgency: UrgencyLevel.URGENT },
    'fratura cervical': { category: FindingCategory.FRACTURE, urgency: UrgencyLevel.CRITICAL },
    'derrame pleural': { category: FindingCategory.RESPIRATORY, urgency: UrgencyLevel.ATTENTION }
  };

  public async analyzeReport(reportText: string, modality: Modality, patientInfo?: any): Promise<AnalysisResult> {
    const startTime = Date.now();
    
    try {
      const normalizedText = this.normalizeText(reportText);
      const criticalFindings = this.extractCriticalFindings(normalizedText, modality);
      const overallUrgency = this.determineOverallUrgency(criticalFindings);
      const recommendedActions = this.generateRecommendedActions(criticalFindings, overallUrgency);
      const communicationSuggestion = this.generateCommunicationTemplate(overallUrgency, criticalFindings, patientInfo);
      
      const processingTime = Date.now() - startTime;
      const confidence = this.calculateConfidence(criticalFindings);
      
      return {
        reportId: this.generateReportId(),
        criticalFindings,
        overallUrgency,
        processingTime,
        confidence,
        recommendedActions,
        communicationSuggestion
      };
      
    } catch (error) {
      console.error('Error analyzing report:', error);
      throw new Error('Failed to analyze radiology report');
    }
  }

  private normalizeText(text: string): string {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  private extractCriticalFindings(text: string, modality: Modality): CriticalFinding[] {
    const findings: CriticalFinding[] = [];
    
    Object.entries(this.criticalTerms).forEach(([term, config]) => {
      if (text.includes(term.toLowerCase())) {
        const finding: CriticalFinding = {
          id: this.generateFindingId(),
          description: `${term} identificado no exame`,
          severity: config.urgency,
          category: config.category,
          location: this.extractLocation(text, term),
          recommendation: this.generateRecommendation(config.category, config.urgency),
          keyTerms: [term],
          confidence: 0.85,
          requiresImmediateAttention: config.urgency === UrgencyLevel.CRITICAL
        };
        findings.push(finding);
      }
    });

    return findings.sort((a, b) => this.getUrgencyScore(b.severity) - this.getUrgencyScore(a.severity));
  }

  private extractLocation(text: string, term: string): string {
    const anatomicalTerms = ['direita', 'esquerda', 'bilateral', 'crânio', 'tórax', 'abdome', 'cervical', 'lombar'];
    
    for (const location of anatomicalTerms) {
      if (text.includes(location)) {
        return location;
      }
    }
    
    return 'Localização não especificada';
  }

  private determineOverallUrgency(findings: CriticalFinding[]): UrgencyLevel {
    if (findings.length === 0) return UrgencyLevel.NORMAL;
    
    const criticalFindings = findings.filter(f => f.severity === UrgencyLevel.CRITICAL);
    if (criticalFindings.length > 0) return UrgencyLevel.CRITICAL;
    
    const urgentFindings = findings.filter(f => f.severity === UrgencyLevel.URGENT);
    if (urgentFindings.length > 0) return UrgencyLevel.URGENT;
    
    const attentionFindings = findings.filter(f => f.severity === UrgencyLevel.ATTENTION);
    if (attentionFindings.length > 0) return UrgencyLevel.ATTENTION;
    
    return UrgencyLevel.NORMAL;
  }

  private generateRecommendedActions(findings: CriticalFinding[], overallUrgency: UrgencyLevel): string[] {
    const actions: string[] = [];
    
    switch (overallUrgency) {
      case UrgencyLevel.CRITICAL:
        actions.push('🚨 COMUNICAÇÃO IMEDIATA com médico assistente (< 15 minutos)');
        actions.push('📞 Contato telefônico direto preferencial');
        actions.push('🏥 Avaliar necessidade de transferência para UTI/emergência');
        break;
        
      case UrgencyLevel.URGENT:
        actions.push('⚡ Comunicação prioritária com médico assistente (< 2 horas)');
        actions.push('📋 Documentar no prontuário eletrônico');
        actions.push('👨‍⚕️ Avaliar necessidade de reavaliação médica');
        break;
        
      case UrgencyLevel.ATTENTION:
        actions.push('⚠️ Comunicação com médico assistente (< 24 horas)');
        actions.push('📝 Registrar achados no sistema');
        actions.push('📅 Agendar follow-up se necessário');
        break;
        
      default:
        actions.push('✅ Relatório dentro da normalidade');
        actions.push('📂 Arquivar no sistema padrão');
        break;
    }
    
    return actions;
  }

  private generateCommunicationTemplate(
    urgency: UrgencyLevel, 
    findings: CriticalFinding[], 
    patientInfo?: any
  ): CommunicationTemplate {
    const templates: Record<UrgencyLevel, CommunicationTemplate> = {
      [UrgencyLevel.CRITICAL]: {
        urgencyLevel: UrgencyLevel.CRITICAL,
        subject: '🚨 ACHADO CRÍTICO - Comunicação Imediata Necessária',
        message: this.buildCriticalMessage(findings, patientInfo),
        timeframe: 'Comunicação imediata (< 15 minutos)',
        channels: [CommunicationChannel.PHONE, CommunicationChannel.WHATSAPP]
      },
      [UrgencyLevel.URGENT]: {
        urgencyLevel: UrgencyLevel.URGENT,
        subject: '⚡ Achado Urgente - Atenção Prioritária',
        message: this.buildUrgentMessage(findings, patientInfo),
        timeframe: 'Comunicação prioritária (< 2 horas)',
        channels: [CommunicationChannel.PHONE, CommunicationChannel.EMAIL]
      },
      [UrgencyLevel.ATTENTION]: {
        urgencyLevel: UrgencyLevel.ATTENTION,
        subject: '⚠️ Achado Relevante - Atenção Médica',
        message: this.buildAttentionMessage(findings, patientInfo),
        timeframe: 'Comunicação em 24 horas',
        channels: [CommunicationChannel.EMAIL]
      },
      [UrgencyLevel.NORMAL]: {
        urgencyLevel: UrgencyLevel.NORMAL,
        subject: '✅ Relatório Normal',
        message: 'Exame sem achados críticos que necessitem comunicação imediata.',
        timeframe: 'Comunicação de rotina',
        channels: [CommunicationChannel.EMAIL]
      }
    };

    return templates[urgency];
  }

  private buildCriticalMessage(findings: CriticalFinding[], patientInfo?: any): string {
    const patientName = patientInfo?.name || '[Nome do Paciente]';
    const criticalFindings = findings.filter(f => f.severity === UrgencyLevel.CRITICAL);
    
    let message = `🚨 COMUNICAÇÃO CRÍTICA 🚨\n\n`;
    message += `Paciente: ${patientName}\n`;
    message += `Data/Hora: ${new Date().toLocaleString('pt-BR')}\n\n`;
    message += `ACHADOS CRÍTICOS IDENTIFICADOS:\n\n`;
    
    criticalFindings.forEach((finding, index) => {
      message += `${index + 1}. ${finding.description}\n`;
      message += `   📍 Localização: ${finding.location}\n`;
      message += `   💡 Recomendação: ${finding.recommendation}\n\n`;
    });
    
    message += `⚠️ AÇÃO IMEDIATA NECESSÁRIA\n`;
    message += `Por favor, avaliar paciente com urgência e considerar medidas terapêuticas apropriadas.\n\n`;
    message += `Radiologista: [Nome do Radiologista]\n`;
    
    return message;
  }

  private buildUrgentMessage(findings: CriticalFinding[], patientInfo?: any): string {
    const patientName = patientInfo?.name || '[Nome do Paciente]';
    
    let message = `⚡ COMUNICAÇÃO URGENTE\n\n`;
    message += `Paciente: ${patientName}\n`;
    message += `Data/Hora: ${new Date().toLocaleString('pt-BR')}\n\n`;
    message += `ACHADOS RELEVANTES:\n\n`;
    
    findings.forEach((finding, index) => {
      message += `${index + 1}. ${finding.description}\n`;
      message += `   📍 ${finding.location}\n\n`;
    });
    
    message += `Favor avaliar paciente em caráter prioritário.\n\n`;
    
    return message;
  }

  private buildAttentionMessage(findings: CriticalFinding[], patientInfo?: any): string {
    const patientName = patientInfo?.name || '[Nome do Paciente]';
    
    let message = `⚠️ COMUNICAÇÃO DE ATENÇÃO\n\n`;
    message += `Paciente: ${patientName}\n`;
    message += `Data/Hora: ${new Date().toLocaleString('pt-BR')}\n\n`;
    message += `ACHADOS QUE REQUEREM ATENÇÃO:\n\n`;
    
    findings.forEach((finding) => {
      message += `• ${finding.description} (${finding.location})\n`;
    });
    
    message += `\nFavor avaliar e considerar acompanhamento adequado.\n\n`;
    
    return message;
  }

  private generateRecommendation(category: FindingCategory, urgency: UrgencyLevel): string {
    const recommendations: Record<FindingCategory, Record<UrgencyLevel, string>> = {
      [FindingCategory.HEMORRHAGE]: {
        [UrgencyLevel.CRITICAL]: 'Avaliação neurocirúrgica imediata',
        [UrgencyLevel.URGENT]: 'Controle de pressão arterial e reavaliação',
        [UrgencyLevel.ATTENTION]: 'Monitorização clínica',
        [UrgencyLevel.NORMAL]: 'Acompanhamento de rotina'
      },
      [FindingCategory.FRACTURE]: {
        [UrgencyLevel.CRITICAL]: 'Imobilização e avaliação ortopédica urgente',
        [UrgencyLevel.URGENT]: 'Imobilização e avaliação ortopédica',
        [UrgencyLevel.ATTENTION]: 'Avaliação ortopédica eletiva',
        [UrgencyLevel.NORMAL]: 'Acompanhamento conservador'
      },
      [FindingCategory.VASCULAR]: {
        [UrgencyLevel.CRITICAL]: 'Anticoagulação e terapia trombolítica',
        [UrgencyLevel.URGENT]: 'Avaliação vascular urgente',
        [UrgencyLevel.ATTENTION]: 'Investigação vascular complementar',
        [UrgencyLevel.NORMAL]: 'Controle fatores de risco'
      },
      [FindingCategory.RESPIRATORY]: {
        [UrgencyLevel.CRITICAL]: 'Suporte ventilatório e drenagem se necessário',
        [UrgencyLevel.URGENT]: 'Oxigenoterapia e tratamento específico',
        [UrgencyLevel.ATTENTION]: 'Tratamento ambulatorial',
        [UrgencyLevel.NORMAL]: 'Acompanhamento clínico'
      },
      [FindingCategory.OBSTRUCTION]: {
        [UrgencyLevel.CRITICAL]: 'Descompressão cirúrgica urgente',
        [UrgencyLevel.URGENT]: 'Avaliação cirúrgica prioritária',
        [UrgencyLevel.ATTENTION]: 'Monitorização e tratamento conservador',
        [UrgencyLevel.NORMAL]: 'Acompanhamento clínico'
      },
      [FindingCategory.MASS_EFFECT]: {
        [UrgencyLevel.CRITICAL]: 'Avaliação neurocirúrgica emergencial',
        [UrgencyLevel.URGENT]: 'Investigação adicional urgente',
        [UrgencyLevel.ATTENTION]: 'Seguimento com neurologia',
        [UrgencyLevel.NORMAL]: 'Controle de rotina'
      },
      [FindingCategory.INFECTION]: {
        [UrgencyLevel.CRITICAL]: 'Antibioticoterapia empírica imediata',
        [UrgencyLevel.URGENT]: 'Início de antibioticoterapia',
        [UrgencyLevel.ATTENTION]: 'Cultura e antibiograma',
        [UrgencyLevel.NORMAL]: 'Acompanhamento clínico'
      },
      [FindingCategory.GASTROINTESTINAL]: {
        [UrgencyLevel.CRITICAL]: 'Avaliação cirúrgica emergencial',
        [UrgencyLevel.URGENT]: 'Investigação gastroenterológica',
        [UrgencyLevel.ATTENTION]: 'Seguimento ambulatorial',
        [UrgencyLevel.NORMAL]: 'Acompanhamento de rotina'
      },
      [FindingCategory.GENITOURINARY]: {
        [UrgencyLevel.CRITICAL]: 'Derivação urinária urgente se obstrução',
        [UrgencyLevel.URGENT]: 'Avaliação urológica prioritária',
        [UrgencyLevel.ATTENTION]: 'Seguimento urológico',
        [UrgencyLevel.NORMAL]: 'Controle de rotina'
      },
      [FindingCategory.OTHER]: {
        [UrgencyLevel.CRITICAL]: 'Avaliação médica imediata',
        [UrgencyLevel.URGENT]: 'Investigação complementar urgente',
        [UrgencyLevel.ATTENTION]: 'Acompanhamento médico',
        [UrgencyLevel.NORMAL]: 'Seguimento de rotina'
      }
    };

    return recommendations[category]?.[urgency] || 'Avaliação médica adequada';
  }

  private calculateConfidence(findings: CriticalFinding[]): number {
    if (findings.length === 0) return 0.95;
    const avgConfidence = findings.reduce((sum, finding) => sum + finding.confidence, 0) / findings.length;
    return Math.round(avgConfidence * 100) / 100;
  }

  private generateReportId(): string {
    return `RPT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFindingId(): string {
    return `FND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUrgencyScore(urgency: UrgencyLevel): number {
    switch (urgency) {
      case UrgencyLevel.NORMAL: return 0;
      case UrgencyLevel.ATTENTION: return 1;
      case UrgencyLevel.URGENT: return 2;
      case UrgencyLevel.CRITICAL: return 3;
      default: return 0;
    }
  }
}

// Instância singleton para uso global
export const radiologyAnalyzer = new RadiologyAIAnalyzer();