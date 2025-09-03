"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Award, Download, Share2, Calendar, User, Code, Briefcase, GraduationCap } from "lucide-react"

interface CertificateProps {
  score: number
  completionDate?: Date
}

export function Certificate({ score, completionDate = new Date() }: CertificateProps) {
  const [studentName, setStudentName] = useState("")
  const [showCertificate, setShowCertificate] = useState(false)

  const handleGenerateCertificate = () => {
    if (studentName.trim()) {
      setShowCertificate(true)
    }
  }

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    const element = document.getElementById("certificate")
    if (element) {
      // Simple implementation - in production you'd use a proper PDF library
      window.print()
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Certificado HTML ETEC",
        text: `${studentName} completou o curso de HTML básico da ETEC com sucesso!`,
        url: window.location.origin,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `${studentName} completou o curso de HTML básico na ETEC com sucesso! ${window.location.origin}`,
      )
    }
  }

  if (!showCertificate) {
    return (
      <div className="p-6 space-y-6">
        <Card className="max-w-md mx-auto border-2 border-green-500 bg-green-50">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Trophy className="w-16 h-16 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-green-700">Parabéns!</h2>
              <p className="text-muted-foreground">Você concluiu com sucesso o curso de HTML básico!</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="studentName" className="text-sm font-medium">
                  Digite seu nome para o certificado:
                </Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleGenerateCertificate}
                disabled={!studentName.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Award className="w-4 h-4 mr-2" />
                Gerar Certificado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Certificate Actions */}
      <div className="flex justify-center gap-4">
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Baixar Certificado
        </Button>
        <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </div>

      {/* Certificate */}
      <Card
        id="certificate"
        className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-primary"
      >
        <CardContent className="p-12">
          <div className="text-center space-y-8">
            {/* Header with ETEC branding */}
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-4">
                <img src="/etec-logo.jpg" alt="ETEC" className="w-16 h-16" />
                <div className="bg-primary rounded-full p-4">
                  <Trophy className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-primary">CERTIFICADO DE CONCLUSÃO</h1>
              <p className="text-lg text-muted-foreground">Centro Paula Souza - ETEC</p>
              <div className="w-32 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">Certificamos que</p>

              <div className="bg-white rounded-lg p-6 border-2 border-dashed border-primary/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <User className="w-6 h-6 text-primary" />
                  <p className="text-2xl font-bold text-primary">{studentName.toUpperCase()}</p>
                </div>
                <p className="text-muted-foreground">completou com sucesso o curso</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">HTML BÁSICO</h2>
                <p className="text-lg text-muted-foreground">Fundamentos de Desenvolvimento Web</p>
                <p className="text-sm text-muted-foreground">Desenvolvido pela turma 1º DS</p>
              </div>

              <div className="flex justify-center items-center gap-8">
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                    <Award className="w-5 h-5 mr-2" />
                    Aprovado
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{completionDate.toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-border space-y-4">
                <h3 className="font-semibold text-center flex items-center justify-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Como usar o HTML na sua carreira
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Code className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Desenvolvedor Front-end</p>
                        <p className="text-muted-foreground text-xs">Crie interfaces de sites e aplicações web</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Designer Web</p>
                        <p className="text-muted-foreground text-xs">Combine design e código para criar experiências</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Freelancer</p>
                        <p className="text-muted-foreground text-xs">Trabalhe de forma independente criando sites</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Próximos passos</p>
                        <p className="text-muted-foreground text-xs">Aprenda CSS, JavaScript e frameworks modernos</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-xs text-center">
                    💡 <strong>Dica:</strong> Continue estudando! O HTML é apenas o primeiro passo para se tornar um
                    desenvolvedor web completo.
                  </p>
                </div>
              </div>

              {/* Skills Acquired */}
              <div className="bg-white rounded-lg p-6 border border-border">
                <h3 className="font-semibold mb-4 text-center">Habilidades Adquiridas</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Estrutura HTML básica</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Tags e elementos HTML</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Formatação de texto</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Semântica HTML</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Boas práticas de código</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Criação do primeiro site</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-center items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold text-primary">HTML ETEC ACADEMY</span>
              </div>
              <p className="text-sm text-muted-foreground">Projeto desenvolvido pela turma 1º DS</p>
              <p className="text-sm text-muted-foreground">Centro Paula Souza - Escola Técnica Estadual</p>
              <div className="text-xs text-muted-foreground">
                Certificado ID: ETEC-HTML-{Date.now().toString(36).toUpperCase()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
