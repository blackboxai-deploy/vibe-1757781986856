'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UrgencyLevel, RadiologyReport, Modality, ReportStatus } from '@/types/medical';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterModality, setFilterModality] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<RadiologyReport | null>(null);

  // Mock data for demonstration
  const [reports] = useState<RadiologyReport[]>([
    {
      id: 'RPT_20240115_001',
      patientId: 'PAT_001',
      patientName: 'João Silva Santos',
      studyDate: new Date('2024-01-15T14:30:00'),
      modality: Modality.CT,
      bodyPart: 'Crânio',
      reportText: 'TC de crânio sem contraste: Identifica-se coleção hiperdensa extra-axial localizada no compartimento subdural à direita...',
      findings: [
        {
          id: 'FND_001',
          description: 'Hematoma subdural agudo à direita com efeito compressivo',
          severity: UrgencyLevel.CRITICAL,
          category: 'HEMORRHAGE' as any,
          location: 'Subdural direito',
          recommendation: 'Avaliação neurocirúrgica imediata',
          keyTerms: ['hematoma subdural', 'agudo'],
          confidence: 0.95,
          requiresImmediateAttention: true
        }
      ],
      urgencyLevel: UrgencyLevel.CRITICAL,
      status: ReportStatus.COMMUNICATED,
      analyzedAt: new Date('2024-01-15T14:32:00'),
      communicatedAt: new Date('2024-01-15T14:45:00'),
      physicianNotified: true
    },
    {
      id: 'RPT_20240115_002',
      patientId: 'PAT_002',
      patientName: 'Maria Oliveira Costa',
      studyDate: new Date('2024-01-15T13:15:00'),
      modality: Modality.XRAY,
      bodyPart: 'Tórax',
      reportText: 'Radiografia simples do tórax em incidência PA: Observa-se área de hipotransparência pulmonar à esquerda...',
      findings: [
        {
          id: 'FND_002',
          description: 'Pneumotórax à esquerda aproximadamente 30%',
          severity: UrgencyLevel.URGENT,
          category: 'RESPIRATORY' as any,
          location: 'Pulmão esquerdo',
          recommendation: 'Drenagem torácica se necessário',
          keyTerms: ['pneumotórax'],
          confidence: 0.88,
          requiresImmediateAttention: false
        }
      ],
      urgencyLevel: UrgencyLevel.URGENT,
      status: ReportStatus.ANALYZED,
      analyzedAt: new Date('2024-01-15T13:18:00')
    },
    {
      id: 'RPT_20240115_003',
      patientId: 'PAT_003',
      patientName: 'Carlos Eduardo Lima',
      studyDate: new Date('2024-01-15T12:00:00'),
      modality: Modality.CT,
      bodyPart: 'Abdome',
      reportText: 'TC de abdome com contraste: Observa-se dilatação de alças de intestino delgado...',
      findings: [
        {
          id: 'FND_003',
          description: 'Obstrução intestinal em íleo terminal',
          severity: UrgencyLevel.URGENT,
          category: 'OBSTRUCTION' as any,
          location: 'Íleo terminal',
          recommendation: 'Avaliação cirúrgica prioritária',
          keyTerms: ['obstrução intestinal'],
          confidence: 0.82,
          requiresImmediateAttention: false
        }
      ],
      urgencyLevel: UrgencyLevel.URGENT,
      status: ReportStatus.COMMUNICATED,
      analyzedAt: new Date('2024-01-15T12:03:00'),
      communicatedAt: new Date('2024-01-15T12:15:00'),
      physicianNotified: true
    },
    {
      id: 'RPT_20240115_004',
      patientId: 'PAT_004',
      patientName: 'Ana Paula Ferreira',
      studyDate: new Date('2024-01-15T11:30:00'),
      modality: Modality.MRI,
      bodyPart: 'Coluna Lombar',
      reportText: 'RM de coluna lombar: Exame dentro dos parâmetros da normalidade...',
      findings: [],
      urgencyLevel: UrgencyLevel.NORMAL,
      status: ReportStatus.ANALYZED,
      analyzedAt: new Date('2024-01-15T11:35:00')
    },
    {
      id: 'RPT_20240115_005',
      patientId: 'PAT_005',
      patientName: 'Roberto Silva Mendes',
      studyDate: new Date('2024-01-15T10:45:00'),
      modality: Modality.ULTRASOUND,
      bodyPart: 'Abdome',
      reportText: 'Ultrassom abdominal: Derrame pleural bilateral de pequena monta...',
      findings: [
        {
          id: 'FND_005',
          description: 'Derrame pleural bilateral pequena monta',
          severity: UrgencyLevel.ATTENTION,
          category: 'RESPIRATORY' as any,
          location: 'Bilateral',
          recommendation: 'Acompanhamento clínico',
          keyTerms: ['derrame pleural'],
          confidence: 0.76,
          requiresImmediateAttention: false
        }
      ],
      urgencyLevel: UrgencyLevel.ATTENTION,
      status: ReportStatus.ANALYZED,
      analyzedAt: new Date('2024-01-15T10:48:00')
    }
  ]);

  const getUrgencyColor = (urgency: UrgencyLevel): string => {
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

  const getUrgencyLabel = (urgency: UrgencyLevel): string => {
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

  const getStatusColor = (status: ReportStatus): string => {
    switch (status) {
      case ReportStatus.COMMUNICATED:
        return 'bg-green-100 text-green-800';
      case ReportStatus.ANALYZED:
        return 'bg-blue-100 text-blue-800';
      case ReportStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ReportStatus): string => {
    switch (status) {
      case ReportStatus.COMMUNICATED:
        return 'Comunicado';
      case ReportStatus.ANALYZED:
        return 'Analisado';
      case ReportStatus.PENDING:
        return 'Pendente';
      default:
        return 'Erro';
    }
  };

  const getModalityLabel = (modality: Modality): string => {
    switch (modality) {
      case Modality.CT:
        return 'TC';
      case Modality.MRI:
        return 'RM';
      case Modality.XRAY:
        return 'RX';
      case Modality.ULTRASOUND:
        return 'US';
      case Modality.MAMMOGRAPHY:
        return 'Mamografia';
      case Modality.NUCLEAR:
        return 'Nuclear';
      case Modality.FLUOROSCOPY:
        return 'Fluoroscopia';
      default:
        return modality;
    }
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.bodyPart.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUrgency = filterUrgency === 'all' || report.urgencyLevel === filterUrgency;
    const matchesModality = filterModality === 'all' || report.modality === filterModality;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesUrgency && matchesModality && matchesStatus;
  });

  const stats = {
    total: reports.length,
    critical: reports.filter(r => r.urgencyLevel === UrgencyLevel.CRITICAL).length,
    communicated: reports.filter(r => r.status === ReportStatus.COMMUNICATED).length,
    pending: reports.filter(r => r.status === ReportStatus.ANALYZED && r.urgencyLevel !== UrgencyLevel.NORMAL).length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          📋 Histórico de Análises
        </h1>
        <p className="text-slate-600">
          Visualize e gerencie todas as análises de laudos radiológicos realizadas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Laudos</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achados Críticos</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <div className="text-2xl">🚨</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comunicados</p>
                <p className="text-2xl font-bold text-green-600">{stats.communicated}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="text-2xl">⏳</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Buscar paciente ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as urgências</SelectItem>
                  <SelectItem value={UrgencyLevel.CRITICAL}>🚨 Crítico</SelectItem>
                  <SelectItem value={UrgencyLevel.URGENT}>⚡ Urgente</SelectItem>
                  <SelectItem value={UrgencyLevel.ATTENTION}>⚠️ Atenção</SelectItem>
                  <SelectItem value={UrgencyLevel.NORMAL}>✅ Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filterModality} onValueChange={setFilterModality}>
                <SelectTrigger>
                  <SelectValue placeholder="Modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as modalidades</SelectItem>
                  <SelectItem value={Modality.CT}>TC</SelectItem>
                  <SelectItem value={Modality.MRI}>RM</SelectItem>
                  <SelectItem value={Modality.XRAY}>RX</SelectItem>
                  <SelectItem value={Modality.ULTRASOUND}>US</SelectItem>
                  <SelectItem value={Modality.MAMMOGRAPHY}>Mamografia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value={ReportStatus.COMMUNICATED}>Comunicado</SelectItem>
                  <SelectItem value={ReportStatus.ANALYZED}>Analisado</SelectItem>
                  <SelectItem value={ReportStatus.PENDING}>Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setFilterUrgency('all');
                  setFilterModality('all');
                  setFilterStatus('all');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Resultados ({filteredReports.length} de {reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Região</TableHead>
                  <TableHead>Urgência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs">{report.id.split('_').pop()}</TableCell>
                    <TableCell className="font-medium">{report.patientName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getModalityLabel(report.modality)}</Badge>
                    </TableCell>
                    <TableCell>{report.bodyPart}</TableCell>
                    <TableCell>
                      <Badge className={getUrgencyColor(report.urgencyLevel)}>
                        {getUrgencyLabel(report.urgencyLevel)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(report.status)}>
                        {getStatusLabel(report.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {report.studyDate.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                              Ver Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Análise - {selectedReport?.patientName}</DialogTitle>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-4 max-h-96 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-semibold">ID:</span> {selectedReport.id}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Data:</span> {selectedReport.studyDate.toLocaleString('pt-BR')}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Modalidade:</span> {getModalityLabel(selectedReport.modality)}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Região:</span> {selectedReport.bodyPart}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Achados ({selectedReport.findings.length}):</h4>
                                  {selectedReport.findings.length > 0 ? (
                                    <div className="space-y-2">
                                      {selectedReport.findings.map((finding, index) => (
                                        <div key={finding.id} className="p-3 bg-gray-50 rounded border">
                                          <div className="flex items-center space-x-2 mb-1">
                                            <Badge className={getUrgencyColor(finding.severity)}>
                                              {getUrgencyLabel(finding.severity)}
                                            </Badge>
                                            <span className="text-sm text-gray-600">#{index + 1}</span>
                                          </div>
                                          <p className="text-sm text-gray-700 mb-1">{finding.description}</p>
                                          <p className="text-xs text-gray-600">
                                            <span className="font-medium">Recomendação:</span> {finding.recommendation}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-600">Nenhum achado crítico identificado</p>
                                  )}
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Texto do Laudo:</h4>
                                  <div className="p-3 bg-gray-50 rounded border text-sm max-h-32 overflow-y-auto">
                                    {selectedReport.reportText}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {report.status === ReportStatus.ANALYZED && report.urgencyLevel !== UrgencyLevel.NORMAL && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Comunicar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>Nenhum resultado encontrado com os filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}