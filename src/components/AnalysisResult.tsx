'use client';

import { AnalysisResult, CriticalFinding, UrgencyLevel } from '@/types/medical';
import { UrgencyBadge, UrgencyIndicator } from './UrgencyBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';


interface AnalysisResultProps {
  result: AnalysisResult;
  onSendCommunication?: (finding: CriticalFinding) => void;
  onExportReport?: () => void;
}

export function AnalysisResultComponent({ result, onSendCommunication, onExportReport }: AnalysisResultProps) {
  const criticalCount = result.criticalFindings.filter(f => f.severity === UrgencyLevel.CRITICAL).length;
  const urgentCount = result.criticalFindings.filter(f => f.severity === UrgencyLevel.URGENT).length;
  const attentionCount = result.criticalFindings.filter(f => f.severity === UrgencyLevel.ATTENTION).length;

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card className={`border-l-4 ${
        result.overallUrgency === UrgencyLevel.CRITICAL ? 'border-l-red-500 bg-red-50' :
        result.overallUrgency === UrgencyLevel.URGENT ? 'border-l-orange-500 bg-orange-50' :
        result.overallUrgency === UrgencyLevel.ATTENTION ? 'border-l-yellow-500 bg-yellow-50' :
        'border-l-green-500 bg-green-50'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              {result.overallUrgency === UrgencyLevel.CRITICAL && <span className="text-2xl">🚨</span>}
              {result.overallUrgency === UrgencyLevel.URGENT && <span className="text-2xl">⏰</span>}
              {result.overallUrgency === UrgencyLevel.ATTENTION && <span className="text-2xl">📋</span>}
              {result.overallUrgency === UrgencyLevel.NORMAL && <span className="text-2xl">✅</span>}
              <span>Resultado da Análise</span>
            </CardTitle>
            <UrgencyBadge urgency={result.overallUrgency} size="lg" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
              <div className="text-sm text-slate-600">Achados Críticos</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{urgentCount}</div>
              <div className="text-sm text-slate-600">Achados Urgentes</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-yellow-600">{attentionCount}</div>
              <div className="text-sm text-slate-600">Requer Atenção</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{Math.round(result.confidence * 100)}%</div>
              <div className="text-sm text-slate-600">Confiança</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-slate-600">
              Processado em {result.processingTime}ms
            </Badge>
            <Badge variant="outline" className="text-slate-600">
              {result.criticalFindings.length} achados identificados
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Comunicação Urgente */}
      {(result.overallUrgency === UrgencyLevel.CRITICAL || result.overallUrgency === UrgencyLevel.URGENT) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800">
              <span className="text-xl">📞</span>
              <span>Comunicação Necessária</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-slate-900 mb-2">Template de Comunicação:</h4>
                <p className="text-sm font-medium mb-1">{result.communicationSuggestion.subject}</p>
                <p className="text-sm text-slate-700 whitespace-pre-line">
                  {result.communicationSuggestion.message}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Prazo: {result.communicationSuggestion.timeframe}</p>
                  <p className="text-xs text-slate-600">
                    Canais: {result.communicationSuggestion.channels.join(', ')}
                  </p>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <span className="mr-2">📞</span>
                  Enviar Comunicação
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Achados Críticos */}
      {result.criticalFindings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-lg">🔍</span>
              <span>Achados Identificados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.criticalFindings.map((finding, index) => (
                <CriticalFindingCard 
                  key={finding.id}
                  finding={finding}
                  index={index}
                  onSendCommunication={onSendCommunication}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-lg">💡</span>
            <span>Recomendações Clínicas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.recommendedActions.map((action, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-slate-700">{action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onExportReport}>
          <span className="mr-2">📄</span>
          Exportar Relatório
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <span className="mr-2">💾</span>
          Salvar no Histórico
        </Button>
      </div>
    </div>
  );
}

function CriticalFindingCard({ 
  finding, 
  index, 
  onSendCommunication 
}: { 
  finding: CriticalFinding;
  index: number;
  onSendCommunication?: (finding: CriticalFinding) => void;
}) {
  return (
    <div className={`p-4 rounded-lg border-l-4 ${
      finding.severity === UrgencyLevel.CRITICAL ? 'border-l-red-500 bg-red-50' :
      finding.severity === UrgencyLevel.URGENT ? 'border-l-orange-500 bg-orange-50' :
      finding.severity === UrgencyLevel.ATTENTION ? 'border-l-yellow-500 bg-yellow-50' :
      'border-l-green-500 bg-green-50'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
          <UrgencyBadge urgency={finding.severity} size="sm" />
          <UrgencyIndicator urgency={finding.severity} />
        </div>
        <Badge variant="outline" className="text-xs">
          {Math.round(finding.confidence * 100)}% confiança
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-slate-900 mb-1">Achado:</h4>
          <p className="text-sm text-slate-700 leading-relaxed">{finding.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-600">Categoria:</span>
            <span className="ml-2 text-slate-800">{finding.category}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">Localização:</span>
            <span className="ml-2 text-slate-800">{finding.location}</span>
          </div>
        </div>

        <div>
          <h5 className="font-medium text-slate-700 mb-1">Recomendação:</h5>
          <p className="text-sm text-slate-600">{finding.recommendation}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          <span className="text-xs font-medium text-slate-500">Termos-chave:</span>
          {finding.keyTerms.map((term, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {term}
            </Badge>
          ))}
        </div>

        {finding.requiresImmediateAttention && onSendCommunication && (
          <>
            <Separator />
            <div className="flex justify-end">
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => onSendCommunication(finding)}
              >
                <span className="mr-1">📞</span>
                Comunicar Médico
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}