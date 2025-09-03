"use client"

import { useRouter } from "next/navigation"
import { useLessons } from "@/lib/lesson-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Lock, Play, Code, Trophy, Star, GraduationCap, RotateCcw } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { lessons, completedLessons, progressPercentage, navigateToLesson, resetAllProgress } = useLessons()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico":
        return "bg-green-100 text-green-800"
      case "Intermediário":
        return "bg-yellow-100 text-yellow-800"
      case "Avançado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleLessonClick = (lesson: any) => {
    if (lesson.isUnlocked) {
      navigateToLesson(lesson.id)
      router.push(`/lesson/${lesson.id}`)
    }
  }

  const handleReset = () => {
    if (confirm("⚠️ ATENÇÃO PROFESSOR: Isso vai apagar TODO o progresso dos alunos. Tem certeza?")) {
      resetAllProgress()
      alert("✅ Progresso resetado com sucesso!")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">HTML Academy ETEC</h1>
                <p className="text-sm text-muted-foreground">Crie seu primeiro site - Projeto 1º DS</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{completedLessons * 100} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="font-semibold">{completedLessons === lessons.length ? 1 : 0} Certificados</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset (Professor)
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Seu Progresso
            </CardTitle>
            <CardDescription>
              Complete todas as lições para criar seu primeiro site e ganhar certificado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progresso Geral</span>
                <span>
                  {completedLessons}/{lessons.length} lições concluídas
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Iniciante</span>
                <span>Criador de Sites Certificado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Introduction */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-balance">Crie Seu Primeiro Site do Zero!</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Aprenda HTML de forma super fácil e prática. Mesmo sem experiência, você vai conseguir criar seu próprio
            site! Cada lição é simples e tem ajuda automática para você não travar.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-800 font-medium">
              🎓 Projeto desenvolvido pela turma do 1º Desenvolvimento de Sistemas - ETEC
            </p>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson, index) => (
            <Card
              key={lesson.id}
              className={`relative transition-all duration-200 hover:shadow-lg ${
                lesson.isUnlocked ? "cursor-pointer hover:scale-105" : "opacity-60"
              }`}
              onClick={() => handleLessonClick(lesson)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        lesson.isCompleted
                          ? "bg-green-100 text-green-600"
                          : lesson.isUnlocked
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {lesson.isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : lesson.isUnlocked ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <Badge variant="secondary" className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-pretty">{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  disabled={!lesson.isUnlocked}
                  variant={lesson.isCompleted ? "secondary" : "default"}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLessonClick(lesson)
                  }}
                >
                  {lesson.isCompleted ? "Revisar Lição" : lesson.isUnlocked ? "Iniciar Lição" : "Bloqueado"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Editor com Ajuda Automática
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-pretty">
                Editor inteligente com sugestões automáticas de código. Você nunca vai ficar travado digitando!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-secondary" />
                Veja Resultado na Hora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-pretty">
                Veja como seu site fica enquanto você digita. É como mágica!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Certificado ETEC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-pretty">
                Complete o curso e ganhe seu certificado oficial de Criador de Sites da ETEC!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
