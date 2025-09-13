import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RadiologyAI - Análise Inteligente de Laudos",
  description: "Sistema de análise automatizada de laudos radiológicos para identificação de achados críticos",
  keywords: ["radiologia", "IA", "análise médica", "laudos", "diagnóstico"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen`}>
        <div className="min-h-screen">
          {/* Header Global */}
          <header className="bg-white shadow-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-slate-900">RadiologyAI</h1>
                    <p className="text-xs text-slate-500">Análise Inteligente de Laudos</p>
                  </div>
                </div>
                
                <nav className="hidden md:flex items-center space-x-6">
                  <a 
                    href="/" 
                    className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Dashboard
                  </a>
                  <a 
                    href="/analyze" 
                    className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Analisar Laudo
                  </a>
                  <a 
                    href="/history" 
                    className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Histórico
                  </a>
                </nav>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">Dr. Maria Silva</p>
                    <p className="text-xs text-slate-500">Radiologista</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">MS</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Conteúdo Principal */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer Global */}
          <footer className="bg-white border-t border-slate-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">RadiologyAI</h3>
                  <p className="text-sm text-slate-600">
                    Sistema inteligente para análise automatizada de laudos radiológicos, 
                    identificando achados críticos que requerem comunicação urgente.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Recursos</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Análise por IA avançada</li>
                    <li>• Classificação de urgência</li>
                    <li>• Templates de comunicação</li>
                    <li>• Histórico completo</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Suporte</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Modalidades: TC, RM, RX, US</li>
                    <li>• Disponível 24/7</li>
                    <li>• Conformidade LGPD</li>
                    <li>• Auditoria completa</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-xs text-slate-500">
                  © 2024 RadiologyAI. Sistema desenvolvido para análise médica assistida por IA.
                </p>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  <span className="text-xs text-slate-500">Status:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-600">Sistema Operacional</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 5000,
            style: {
              background: 'white',
              border: '1px solid #e2e8f0',
              color: '#1e293b',
            },
          }}
        />
      </body>
    </html>
  );
}