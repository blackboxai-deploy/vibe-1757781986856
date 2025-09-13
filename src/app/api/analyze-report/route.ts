import { NextRequest, NextResponse } from 'next/server';
import { radiologyAnalyzer } from '@/lib/ai-analyzer';
import { Modality } from '@/types/medical';

export async function POST(request: NextRequest) {
  try {
    const { reportText, modality, patientInfo } = await request.json();

    // Validação de entrada
    if (!reportText || !reportText.trim()) {
      return NextResponse.json(
        { error: 'Texto do laudo é obrigatório' },
        { status: 400 }
      );
    }

    if (!modality || !Object.values(Modality).includes(modality)) {
      return NextResponse.json(
        { error: 'Modalidade do exame é obrigatória e deve ser válida' },
        { status: 400 }
      );
    }

    // Processar análise
    const analysisResult = await radiologyAnalyzer.analyzeReport(
      reportText,
      modality as Modality,
      patientInfo
    );

    // Log da análise para auditoria
    console.log(`Análise realizada: ${analysisResult.reportId} - Urgência: ${analysisResult.overallUrgency}`);
    console.log(`Achados críticos encontrados: ${analysisResult.criticalFindings.length}`);

    return NextResponse.json({
      success: true,
      data: analysisResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na análise do laudo:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor durante a análise',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'RadiologyAI Analysis API',
    version: '1.0.0',
    status: 'operational',
    supportedModalities: Object.values(Modality),
    endpoints: {
      analyze: 'POST /api/analyze-report',
      criticalFindings: 'GET /api/critical-findings'
    }
  });
}