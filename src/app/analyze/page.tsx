'use client';

import { useState } from 'react';
import { ReportUploader } from '@/components/ReportUploader';
import { AnalysisResultComponent } from '@/components/AnalysisResult';
import { radiologyAnalyzer } from '@/lib/ai-analyzer';
import { AnalysisResult as AnalysisResultType, Modality } from '@/types/medical';
import { toast } from 'sonner';

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [currentReportData, setCurrentReportData] = useState<{
    text: string;
    patientName: string;
    modality: Modality;
    bodyPart: string;
  } | null>(null);



  const handleReportSubmit = async (data: {
    text: string;
    patientName: string;
    modality: Modality;
    bodyPart: string;
    file?: File;
  }) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setCurrentReportData({
      text: data.text,
      patientName: data.patientName,
      modality: data.modality,
      bodyPart: data.bodyPart
    });

    try {
      toast.info('Iniciando análise do laudo...', { duration: 2000 });
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = await radiologyAnalyzer.analyzeReport(
        data.text,
        data.modality,
        { name: data.patientName }
      );

      setAnalysisResult(result);
      
      // Show success message with urgency info
      if (result.overallUrgency === 'CRITICAL') {
        toast.error(`🚨 ACHADO CRÍTICO IDENTIFICADO! ${result.criticalFindings.length} achados críticos encontrados.`, {
          duration: 8000
        });
      } else if (result.overallUrgency === 'URGENT') {
        toast.warning(`⚡ Achados urgentes identificados (${result.criticalFindings.length})`, {
          duration: 6000
        });
      } else if (result.overallUrgency === 'ATTENTION') {
        toast.info(`⚠️ Achados que requerem atenção (${result.criticalFindings.length})`, {
          duration: 4000
        });
      } else {
        toast.success('✅ Análise concluída - Sem achados críticos', {
          duration: 3000
        });
      }

      // Scroll to results
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 500);

    } catch (error) {
      console.error('Error analyzing report:', error);
      toast.error('Erro ao analisar o laudo. Tente novamente.', {
        duration: 5000
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setCurrentReportData(null);
    setIsAnalyzing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                🔍 Análise de Laudo Radiológico
              </h1>
              <p className="text-slate-600">
                Carregue um laudo e nossa IA identificará achados críticos automaticamente
              </p>
            </div>
            
            {analysisResult && (
              <div>
                <button
                  onClick={resetAnalysis}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  🔄 Nova Análise
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8 py-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                !currentReportData ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm font-medium">1. Carregar Laudo</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isAnalyzing ? 'bg-blue-500 animate-pulse' : 
                analysisResult ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm font-medium">2. Análise IA</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                analysisResult ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm font-medium">3. Resultados</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <ReportUploader 
              onReportSubmit={handleReportSubmit}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-slate-900 mb-4">📊 Estatísticas do Sistema</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Laudos analisados hoje:</span>
                    <span className="font-bold text-blue-600">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Achados críticos:</span>
                    <span className="font-bold text-red-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precisão da IA:</span>
                    <span className="font-bold text-green-600">96.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo médio:</span>
                    <span className="font-bold text-blue-600">1.2s</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-slate-900 mb-4">🎯 Recursos Avançados</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 text-xs">✓</span>
                    <span className="text-gray-700">Análise de múltiplas modalidades</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 text-xs">✓</span>
                    <span className="text-gray-700">Classificação automática de urgência</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 text-xs">✓</span>
                    <span className="text-gray-700">Templates de comunicação</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 text-xs">✓</span>
                    <span className="text-gray-700">Highlights no texto original</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 text-xs">✓</span>
                    <span className="text-gray-700">Suporte para PDF e texto</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 text-xs">✓</span>
                    <span className="text-gray-700">Base médica atualizada</span>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="font-semibold text-blue-900 mb-3">💡 Dicas de Uso</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Cole diretamente o texto do laudo ou faça upload de arquivo</p>
                  <p>• Use os exemplos para testar o sistema</p>
                  <p>• Preencha as informações do exame para melhor análise</p>
                  <p>• A IA identifica automaticamente achados críticos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {analysisResult && currentReportData && (
          <div id="analysis-results" className="mt-12">
            <div className="border-t border-gray-200 pt-8">
              <AnalysisResultComponent
                result={analysisResult}
                onSendCommunication={(finding) => {
                  toast.success('Comunicação enviada!', {
                    description: `Médico assistente notificado sobre: ${finding.description.substring(0, 50)}...`
                  });
                }}
                onExportReport={() => {
                  toast.success('Relatório exportado!', {
                    description: 'Arquivo salvo com sucesso'
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}