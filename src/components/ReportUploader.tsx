'use client';

import { useState, useRef } from 'react';
import { Modality } from '@/types/medical';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ReportUploaderProps {
  onReportSubmit: (data: {
    text: string;
    patientName: string;
    modality: Modality;
    bodyPart: string;
    file?: File;
  }) => void;
  isAnalyzing: boolean;
}

interface ReportMetadata {
  patientName: string;
  patientAge: string;
  modality: Modality;
  bodyPart: string;
  studyDate: string;
  medicalRecord: string;
}

export function ReportUploader({ onReportSubmit, isAnalyzing }: ReportUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [reportText, setReportText] = useState('');
  const [metadata, setMetadata] = useState<ReportMetadata>({
    patientName: '',
    patientAge: '',
    modality: Modality.CT,
    bodyPart: '',
    studyDate: new Date().toISOString().split('T')[0],
    medicalRecord: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploadedFile(file);
    
    // Simular extração de texto do arquivo
    try {
      if (file.type === 'text/plain') {
        const text = await file.text();
        setReportText(text);
      } else {
        // Para PDFs, simularemos a extração de texto
        setReportText('Texto extraído do arquivo PDF/DOC será exibido aqui após processamento...');
      }
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
    }
  };

  const handleSubmit = () => {
    if (reportText && metadata.patientName) {
      onReportSubmit({
        text: reportText,
        patientName: metadata.patientName,
        modality: metadata.modality,
        bodyPart: metadata.bodyPart,
        file: uploadedFile || undefined
      });
    }
  };

  const isFormValid = reportText.trim() && metadata.patientName.trim();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-lg">📄</span>
            <span>Upload do Laudo Radiológico</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Área de Upload */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
              }
              ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileInput}
              disabled={isAnalyzing}
            />
            
            {uploadedFile ? (
              <div className="space-y-2">
                <div className="text-2xl">✅</div>
                <p className="font-medium text-slate-900">{uploadedFile.name}</p>
                <p className="text-sm text-slate-600">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || 'Arquivo de texto'}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                    setReportText('');
                  }}
                >
                  Remover Arquivo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl text-slate-400">📁</div>
                <p className="text-lg font-medium text-slate-700">
                  Arraste o laudo ou clique para selecionar
                </p>
                <p className="text-sm text-slate-500">
                  Suporte: TXT, PDF, DOC, DOCX (máx. 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Preview do Texto */}
          {reportText && (
            <div className="space-y-2">
              <Label htmlFor="report-text">Conteúdo do Laudo</Label>
              <Textarea
                id="report-text"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Cole ou edite o texto do laudo aqui..."
                className="min-h-32 font-mono text-sm"
                disabled={isAnalyzing}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadados do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-lg">👤</span>
            <span>Dados do Paciente e Exame</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-name">Nome do Paciente *</Label>
              <Input
                id="patient-name"
                value={metadata.patientName}
                onChange={(e) => setMetadata({ ...metadata, patientName: e.target.value })}
                placeholder="Ex: João Silva Santos"
                disabled={isAnalyzing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-age">Idade</Label>
              <Input
                id="patient-age"
                value={metadata.patientAge}
                onChange={(e) => setMetadata({ ...metadata, patientAge: e.target.value })}
                placeholder="Ex: 45 anos"
                disabled={isAnalyzing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modality">Modalidade do Exame</Label>
              <Select
                value={metadata.modality}
                onValueChange={(value) => setMetadata({ ...metadata, modality: value as Modality })}
                disabled={isAnalyzing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Modality.CT}>Tomografia (CT)</SelectItem>
                  <SelectItem value={Modality.MRI}>Ressonância (RM)</SelectItem>
                  <SelectItem value={Modality.XRAY}>Radiografia (RX)</SelectItem>
                  <SelectItem value={Modality.ULTRASOUND}>Ultrassom (US)</SelectItem>
                  <SelectItem value={Modality.MAMMOGRAPHY}>Mamografia</SelectItem>
                  <SelectItem value={Modality.NUCLEAR}>Medicina Nuclear</SelectItem>
                  <SelectItem value={Modality.FLUOROSCOPY}>Fluoroscopia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body-part">Região Anatômica</Label>
              <Input
                id="body-part"
                value={metadata.bodyPart}
                onChange={(e) => setMetadata({ ...metadata, bodyPart: e.target.value })}
                placeholder="Ex: Crânio, Tórax, Abdome"
                disabled={isAnalyzing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-date">Data do Exame</Label>
              <Input
                id="study-date"
                type="date"
                value={metadata.studyDate}
                onChange={(e) => setMetadata({ ...metadata, studyDate: e.target.value })}
                disabled={isAnalyzing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-record">Prontuário</Label>
              <Input
                id="medical-record"
                value={metadata.medicalRecord}
                onChange={(e) => setMetadata({ ...metadata, medicalRecord: e.target.value })}
                placeholder="Ex: 12345/2024"
                disabled={isAnalyzing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Análise */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isAnalyzing}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 px-8"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analisando Laudo...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔍</span>
              <span>Analisar Achados Críticos</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}