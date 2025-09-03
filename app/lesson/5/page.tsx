"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLessons } from "@/lib/lesson-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { QuizComponent } from "@/components/quiz-component"
import { Certificate } from "@/components/certificate"
import { ArrowLeft, Home, CheckCircle, Trophy } from "lucide-react"

export default function QuizPage() {
  const router = useRouter()
  const { lessons, navigateToLesson, progressPercentage } = useLessons()
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizPassed, setQuizPassed] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)

  const lesson = lessons.find((l) => l.id === 5)

  useEffect(() => {
    if (lesson && lesson.isUnlocked) {
      navigateToLesson(5)
    } else if (lesson && !lesson.isUnlocked) {
      router.push("/")
    }
  }, [lesson, navigateToLesson, router])

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizCompleted(true)
    setQuizScore(score)
    setQuizPassed(passed)

    if (passed) {
      // Show certificate after a short delay
      setTimeout(() => {
        setShowCertificate(true)
      }, 2000)
    }
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Lição não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!lesson.isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Bloqueado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Complete todas as lições anteriores para acessar o quiz final.</p>
            <Button onClick={() => router.push("/")} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showCertificate && quizPassed) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50 shrink-0">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Início
                </Button>
                <div>
                  <h1 className="font-semibold text-lg">Certificado de Conclusão</h1>
                  <p className="text-sm text-muted-foreground">Parabéns pela conquista!</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">Curso Concluído</span>
              </div>
            </div>
          </div>
        </header>

        {/* Certificate */}
        <main className="flex-1">
          <Certificate score={quizScore} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div>
                <h1 className="font-semibold text-lg">{lesson.title}</h1>
                <p className="text-sm text-muted-foreground">Lição 5 de {lessons.length} - Quiz Final</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {lesson.isCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Concluída</span>
                </div>
              )}
              <div className="w-32">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {!quizCompleted ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Quiz Final - HTML Básico</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Teste seus conhecimentos sobre HTML básico. Você precisa de pelo menos 60% para ganhar seu certificado
                de Criador de Sites.
              </p>
            </div>
            <QuizComponent onComplete={handleQuizComplete} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              {quizPassed ? (
                <Trophy className="w-24 h-24 text-yellow-500" />
              ) : (
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">😔</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">{quizPassed ? "Parabéns! 🎉" : "Continue Tentando! 💪"}</h2>
              <p className="text-lg text-muted-foreground">
                {quizPassed
                  ? "Você demonstrou domínio dos conceitos básicos de HTML e conquistou seu certificado!"
                  : `Você obteve ${quizScore}%. Revise o conteúdo e tente novamente para obter pelo menos 60%.`}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/")} variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
              {quizPassed && (
                <Button onClick={() => setShowCertificate(true)} className="bg-green-600 hover:bg-green-700">
                  <Trophy className="w-4 h-4 mr-2" />
                  Ver Certificado
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
