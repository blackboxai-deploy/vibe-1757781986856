'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UrgencyLevel, DashboardStats, RadiologyReport } from '@/types/medical';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayAnalyzed: 24,
    criticalFindings: 3,
    pendingCommunications: 1,
    avgProcessingTime: 1.2,
    urgencyDistribution: {
      [UrgencyLevel.CRITICAL]: 3,
      [UrgencyLevel.URGENT]: 8,
      [UrgencyLevel.ATTENTION]: 13,
      [UrgencyLevel.NORMAL]: 76
    }
  });

  const [recentReports, setRecentReports] = useState<Partial<RadiologyReport>[]>([
    {
      id: 'RPT_001',
      patientName: 'João Silva Santos',
      studyDate: new Date('2024-01-15T14:30:00'),
      urgencyLevel: UrgencyLevel.CRITICAL,
      findings: [{ description: 'Hematoma subdural agudo à direita' } as never],
      status: 'ANALYZED' as never,
      communicatedAt: new Date('2024-01-15T14:45:00')
    },
    {
      id: 'RPT_002', 
      patientName: 'Maria Oliveira Costa',
      studyDate: new Date('2024-01-15T13:15:00'),
      urgencyLevel: UrgencyLevel.URGENT,
      findings: [{ description: 'Pneumotórax à esquerda' } as never],
      status: 'ANALYZED' as never
    },
    {
      id: 'RPT_003',
      patientName: 'Carlos Eduardo Lima',
      studyDate: new Date('2024-01-15T12:00:00'),
      urgencyLevel: UrgencyLevel.ATTENTION,
      findings: [{ description: 'Derrame pleural bilateral' } as never],
      status: 'ANALYZED' as never
    },
    {
      id: 'RPT_004',
      patientName: 'Ana Paula Ferreira',
      studyDate: new Date('2024-01-15T11:30:00'),
      urgencyLevel: UrgencyLevel.NORMAL,
      findings: [],
      status: 'ANALYZED' as never
    }
  ]);

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case UrgencyLevel.CRITICAL:
        return 'bg-red-500 text-white';
      case UrgencyLevel.URGENT:
        return 'bg-orange-500 text-white';
      case UrgencyLevel.ATTENTION:
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const getUrgencyLabel = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case UrgencyLevel.CRITICAL:
        return '🚨 Crítico';
      case UrgencyLevel.URGENT:
        return '⚡ Urgente';
      case UrgencyLevel.ATTENTION:
        return '⚠️ Atenção';
      default:
        return '✅ Normal';
    }
  };

  const getStatusColor = (status: string, communicatedAt?: Date) => {
    if (communicatedAt) return 'bg-green-100 text-green-800';
    if (status === 'ANALYZED') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string, communicatedAt?: Date) => {
    if (communicatedAt) return 'Comunicado';
    if (status === 'ANALYZED') return 'Analisado';
    return 'Pendente';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Dashboard - Análise de Laudos
        </h1>
        <p className="text-slate-600">
          Visão geral das análises radiológicas e achados críticos do dia
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Laudos Analisados Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.todayAnalyzed}</div>
            <p className="text-blue-100 text-sm">
              +{Math.round((stats.todayAnalyzed / 20) * 100 - 100)}% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Achados Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.criticalFindings}</div>
            <p className="text-red-100 text-sm">Requerem atenção imediata</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Comunicações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.pendingCommunications}</div>
            <p className="text-orange-100 text-sm">Aguardando notificação</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tempo Médio de Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.avgProcessingTime}s</div>
            <p className="text-green-100 text-sm">IA ultrarrápida</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribuição de Urgência */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Urgência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600 font-medium">🚨 Crítico</span>
                <span className="font-bold">{stats.urgencyDistribution[UrgencyLevel.CRITICAL]}</span>
              </div>
              <Progress value={(stats.urgencyDistribution[UrgencyLevel.CRITICAL] / stats.todayAnalyzed) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-orange-600 font-medium">⚡ Urgente</span>
                <span className="font-bold">{stats.urgencyDistribution[UrgencyLevel.URGENT]}</span>
              </div>
              <Progress value={(stats.urgencyDistribution[UrgencyLevel.URGENT] / stats.todayAnalyzed) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-600 font-medium">⚠️ Atenção</span>
                <span className="font-bold">{stats.urgencyDistribution[UrgencyLevel.ATTENTION]}</span>
              </div>
              <Progress value={(stats.urgencyDistribution[UrgencyLevel.ATTENTION] / stats.todayAnalyzed) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600 font-medium">✅ Normal</span>
                <span className="font-bold">{stats.urgencyDistribution[UrgencyLevel.NORMAL]}</span>
              </div>
              <Progress value={(stats.urgencyDistribution[UrgencyLevel.NORMAL] / stats.todayAnalyzed) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Laudos Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Laudos Recentes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/history'}>
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge className={getUrgencyColor(report.urgencyLevel!)}>
                        {getUrgencyLabel(report.urgencyLevel!)}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(report.status!, report.communicatedAt)}>
                        {getStatusLabel(report.status!, report.communicatedAt)}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-slate-900 mt-2">{report.patientName}</h4>
                    <p className="text-sm text-slate-600">
                      {report.findings && report.findings.length > 0 
                        ? report.findings[0].description 
                        : 'Exame sem achados críticos'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {report.studyDate?.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {report.urgencyLevel === UrgencyLevel.CRITICAL && !report.communicatedAt && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        Comunicar Urgente
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => window.location.href = `/analyze?id=${report.id}`}>
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ação Rápida */}
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Pronto para analisar um novo laudo?</h3>
              <p className="text-blue-100">
                Nossa IA analisa laudos radiológicos em segundos, identificando achados críticos automaticamente.
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              onClick={() => window.location.href = '/analyze'}
            >
              🔍 Analisar Laudo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}