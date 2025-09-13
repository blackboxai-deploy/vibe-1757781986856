import { NextRequest, NextResponse } from 'next/server';
import { MEDICAL_KNOWLEDGE } from '@/lib/medical-knowledge';
import { UrgencyLevel, FindingCategory, Modality } from '@/types/medical';

// Dados mock de estatísticas
const mockStatistics = {
  totalAnalyses: 1247,
  criticalFindings: 89,
  urgentFindings: 156,
  averageProcessingTime: 1245,
  modalityDistribution: {
    [Modality.CT]: 425,
    [Modality.MRI]: 312,
    [Modality.XRAY]: 289,
    [Modality.ULTRASOUND]: 145,
    [Modality.MAMMOGRAPHY]: 54,
    [Modality.NUCLEAR]: 18,
    [Modality.FLUOROSCOPY]: 4
  },
  categoryDistribution: {
    [FindingCategory.HEMORRHAGE]: 34,
    [FindingCategory.MASS_EFFECT]: 28,
    [FindingCategory.VASCULAR]: 42,
    [FindingCategory.FRACTURE]: 23,
    [FindingCategory.OBSTRUCTION]: 19,
    [FindingCategory.INFECTION]: 15,
    [FindingCategory.RESPIRATORY]: 37,
    [FindingCategory.GASTROINTESTINAL]: 12,
    [FindingCategory.GENITOURINARY]: 8,
    [FindingCategory.OTHER]: 27
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  try {
    switch (action) {
      case 'knowledge-base':
        return NextResponse.json({
          success: true,
          data: {
            criticalTerms: Object.keys(MEDICAL_KNOWLEDGE.criticalTerms).length,
            urgencyRules: MEDICAL_KNOWLEDGE.urgencyRules.length,
            supportedModalities: Object.keys(MEDICAL_KNOWLEDGE.modalitySpecific),
            categories: Object.values(FindingCategory),
            urgencyLevels: Object.values(UrgencyLevel)
          }
        });

      case 'statistics':
        return NextResponse.json({
          success: true,
          data: mockStatistics,
          generatedAt: new Date().toISOString()
        });

      case 'critical-terms':
        const terms = Object.values(MEDICAL_KNOWLEDGE.criticalTerms).map((term: any) => ({
          term: term.term,
          category: term.category,
          baseUrgency: term.baseUrgency,
          synonyms: term.synonyms.slice(0, 3), // Limitar sinônimos
          description: term.description
        }));
        
        return NextResponse.json({
          success: true,
          data: terms,
          total: terms.length
        });

      case 'urgency-rules':
        return NextResponse.json({
          success: true,
          data: MEDICAL_KNOWLEDGE.urgencyRules
        });

      default:
        // Lista todos os achados críticos conhecidos
        const allFindings = Object.values(MEDICAL_KNOWLEDGE.criticalTerms).map((term: any) => ({
          id: term.term.replace(/\s+/g, '_').toLowerCase(),
          term: term.term,
          category: term.category,
          urgency: term.baseUrgency,
          synonyms: term.synonyms.length,
          modifiers: term.contextModifiers.length,
          description: term.description
        }));

        return NextResponse.json({
          success: true,
          data: allFindings,
          total: allFindings.length,
          categories: Object.values(FindingCategory),
          urgencyLevels: Object.values(UrgencyLevel)
        });
    }
  } catch (error) {
    console.error('Erro na API de achados críticos:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { terms } = await request.json();
    
    if (!terms || !Array.isArray(terms)) {
      return NextResponse.json(
        { error: 'Lista de termos é obrigatória' },
        { status: 400 }
      );
    }

    // Buscar termos críticos nos termos fornecidos
    const foundFindings: any[] = [];
    
    for (const term of terms) {
      const normalizedTerm = (term as string).toLowerCase().trim();
      
      // Buscar correspondências na base de conhecimento
      const matches = Object.values(MEDICAL_KNOWLEDGE.criticalTerms).filter((criticalTerm: any) => {
        return criticalTerm.term.toLowerCase().includes(normalizedTerm) ||
               criticalTerm.synonyms.some((synonym: string) => 
                 synonym.toLowerCase().includes(normalizedTerm)
               ) ||
               normalizedTerm.includes(criticalTerm.term.toLowerCase());
      });

      foundFindings.push(...matches.map((match: any) => ({
        inputTerm: term,
        matchedTerm: match.term,
        category: match.category,
        urgency: match.baseUrgency,
        confidence: normalizedTerm === match.term.toLowerCase() ? 1.0 : 0.7,
        description: match.description
      })));
    }

    // Remover duplicatas
    const uniqueFindings = foundFindings.filter((finding, index, self) => 
      index === self.findIndex(f => f.matchedTerm === finding.matchedTerm)
    );

    return NextResponse.json({
      success: true,
      data: {
        searchTerms: terms.length,
        foundFindings: uniqueFindings.length,
        findings: uniqueFindings
      }
    });

  } catch (error) {
    console.error('Erro na busca de termos críticos:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor na busca',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}