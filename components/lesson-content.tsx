"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight, Eye, EyeOff, BookOpen, Code2, Target } from "lucide-react"

interface LessonContentProps {
  lessonId: number
}

const lessonData = {
  1: {
    title: "O que é HTML?",
    concept:
      "HTML é como o esqueleto de um site. É uma linguagem super fácil que usa 'etiquetas' para organizar o conteúdo da página.",
    explanation: `HTML funciona com "tags" (etiquetas):
- Tags são palavras entre < >
- Exemplo: <h1> faz um título grande
- A maioria tem abertura <tag> e fechamento </tag>
- O conteúdo fica no meio: <tag>seu texto</tag>

É mais fácil do que parece!`,
    examples: [
      {
        title: "Sua Primeira Página",
        code: `<!DOCTYPE html>
<html>
<head>
    <title>Meu Primeiro Site</title>
</head>
<body>
    <h1>Oi! Este é meu site!</h1>
    <p>Estou aprendendo HTML na ETEC!</p>
</body>
</html>`,
        explanation: "Este é um site completo! Simples assim.",
      },
    ],
    exercise: {
      instruction: `1. **Preparar o template:**
   • Clique no botão "Template" para começar com a estrutura básica

2. **Alterar o título da página:**
   • Mude o conteúdo da tag <title> para "Meu Site ETEC"

3. **Criar o título principal:**
   • Mude o <h1> para "Meu Site ETEC"

4. **Adicionar um parágrafo:**
   • Adicione uma tag <p> com o texto "Olá mundo!" abaixo do h1`,
      expectedOutput: `<!DOCTYPE html>
<html>
<head>
    <title>Meu Site ETEC</title>
</head>
<body>
    <h1>Meu Site ETEC</h1>
    <p>Olá mundo!</p>
</body>
</html>`,
      hint: "Use o botão 'Template' primeiro! Depois digite 'h' para ver <h1> e 'p' para ver <p>. O editor vai te ajudar com sugestões!",
    },
  },
  2: {
    title: "Títulos e Textos",
    concept: "Vamos aprender a fazer títulos de diferentes tamanhos e deixar o texto bonito com negrito e itálico.",
    explanation: `Tags para texto:
- <h1>: Título muito grande (principal)
- <h2>: Título médio
- <h3>: Título pequeno
- <p>: Parágrafo normal
- <strong>: Texto em negrito
- <em>: Texto em itálico

Dica: Use h1 só uma vez por página!`,
    examples: [
      {
        title: "Diferentes Tipos de Texto",
        code: `<h1>Meu Blog da ETEC</h1>
<h2>Primeiro Post</h2>
<p>Este é um <strong>texto importante</strong> e este está em <em>itálico</em>.</p>
<p>HTML é <strong>muito fácil</strong>!</p>`,
        explanation: "Veja como cada tag muda a aparência do texto.",
      },
    ],
    exercise: {
      instruction: `1. **Preparar a estrutura:**
   • Use o botão "Template" para começar

2. **Configurar o título da página:**
   • Mude a tag <title> para "Sobre Mim"

3. **Criar o título principal:**
   • Adicione um <h1> com o texto "Sobre Mim"

4. **Adicionar subtítulo:**
   • Crie um <h2> com "Estudante da ETEC"

5. **Escrever apresentação:**
   • Adicione um parágrafo falando seu nome e que está aprendendo HTML
   • Use a tag <strong> para destacar a palavra "aprendendo"`,
      expectedOutput: `<!DOCTYPE html>
<html>
<head>
    <title>Sobre Mim</title>
</head>
<body>
    <h1>Sobre Mim</h1>
    <h2>Estudante da ETEC</h2>
    <p>Meu nome é João e estou <strong>aprendendo HTML</strong>!</p>
</body>
</html>`,
      hint: "Digite 'h1' para título principal, 'h2' para subtítulo, 'p' para parágrafo e 'strong' para negrito. Troque 'João' pelo seu nome!",
    },
  },
  3: {
    title: "Organizando a Página",
    concept: "Vamos organizar nossa página em seções, como cabeçalho, conteúdo principal e rodapé.",
    explanation: `Tags de organização:
- <header>: Cabeçalho (topo da página)
- <main>: Conteúdo principal
- <footer>: Rodapé (final da página)
- <section>: Uma seção da página

É como organizar um documento!`,
    examples: [
      {
        title: "Página Bem Organizada",
        code: `<!DOCTYPE html>
<html>
<head>
    <title>Site Organizado</title>
</head>
<body>
    <header>
        <h1>Meu Site da ETEC</h1>
    </header>
    <main>
        <h2>Bem-vindos!</h2>
        <p>Este é meu primeiro site.</p>
    </main>
    <footer>
        <p>Feito por mim - 1º DS</p>
    </footer>
</body>
</html>`,
        explanation: "Agora a página tem uma estrutura clara e organizada.",
      },
    ],
    exercise: {
      instruction: `1. **Preparar a base:**
   • Use o botão "Template" para começar

2. **Criar o cabeçalho:**
   • Dentro do <body>, adicione uma tag <header>
   • Dentro do header, coloque um <h1> com "Meu Site"

3. **Adicionar conteúdo principal:**
   • Crie uma tag <main> após o header
   • Dentro do main, adicione um <p> com "Conteúdo principal aqui."

4. **Finalizar com rodapé:**
   • Adicione uma tag <footer> após o main
   • Dentro do footer, coloque um <p> com "Rodapé da página"`,
      expectedOutput: `<!DOCTYPE html>
<html>
<head>
    <title>Minha Página</title>
</head>
<body>
    <header>
        <h1>Meu Site</h1>
    </header>
    <main>
        <p>Conteúdo principal aqui.</p>
    </main>
    <footer>
        <p>Rodapé da página</p>
    </footer>
</body>
</html>`,
      hint: "Digite 'header' para cabeçalho, 'main' para conteúdo principal e 'footer' para rodapé. Coloque tudo dentro do <body>!",
    },
  },
  4: {
    title: "Links e Imagens",
    concept: "Agora vamos adicionar links para outros sites e imagens para deixar a página mais interessante!",
    explanation: `Para links e imagens:
- <a href="site.com">texto do link</a>: Link para outro site
- <img src="foto.jpg" alt="descrição">: Adiciona uma imagem
- <a href="mailto:email@email.com">: Link de email

Sempre coloque uma descrição na imagem (alt)!`,
    examples: [
      {
        title: "Links e Imagens",
        code: `<h1>Meus Links Favoritos</h1>
<p>Acesse o <a href="https://google.com">Google</a></p>
<img src="etec-logo.jpg" alt="Logo da ETEC">
<p>Email: <a href="mailto:contato@etec.sp.gov.br">contato@etec.sp.gov.br</a></p>`,
        explanation: "Agora sua página tem links clicáveis e imagens!",
      },
    ],
    exercise: {
      instruction: `1. **Preparar a estrutura:**
   • Use o botão "Template" para começar

2. **Criar título da página:**
   • Adicione um <h1> com "Minha Página"

3. **Adicionar link para o Google:**
   • Crie um parágrafo com o texto "Visite o "
   • Dentro do parágrafo, adicione um link: <a href="https://google.com">Google</a>

4. **Inserir uma imagem:**
   • Digite 'img' e use o autocomplete para criar uma tag de imagem
   • Use qualquer nome de arquivo (ex: "imagem.jpg") e uma descrição`,
      expectedOutput: `<!DOCTYPE html>
<html>
<head>
    <title>Links e Imagens</title>
</head>
<body>
    <h1>Minha Página</h1>
    <p>Visite o <a href="https://google.com">Google</a></p>
    <img src="imagem.jpg" alt="Minha imagem">
</body>
</html>`,
      hint: "Digite 'a' para link e 'img' para imagem. O autocomplete vai te ajudar com a estrutura completa!",
    },
  },
  5: {
    title: "Quiz Final - Ganhe seu Certificado!",
    concept: "Parabéns! Agora você sabe criar sites! Faça o quiz para ganhar seu certificado da ETEC.",
    explanation:
      "Este quiz testa tudo que você aprendeu nas 4 lições. Precisa acertar pelo menos 6 de 10 perguntas para passar e ganhar o certificado. Não se preocupe, as perguntas são sobre tags, estrutura e organização de páginas. Você consegue!",
    examples: [],
    exercise: {
      instruction: `**MISSÃO FINAL:**

1. **Responder o questionário:**
   • 10 perguntas sobre HTML básico
   • Perguntas sobre tags, estrutura e organização

2. **Meta de aprovação:**
   • Acerte pelo menos 6 perguntas (60%)
   • Cada pergunta vale 1 ponto

3. **Recompensa:**
   • Certificado digital da ETEC
   • Conclusão do curso de HTML básico`,
      expectedOutput: "",
      hint: "Releia as lições anteriores se precisar. As perguntas são sobre tags, estrutura e organização de páginas. Você consegue!",
    },
  },
}

export function getExpectedOutput(lessonId: number): string {
  const lesson = lessonData[lessonId as keyof typeof lessonData]
  return lesson?.exercise.expectedOutput || ""
}

export function LessonContent({ lessonId }: LessonContentProps) {
  const [showSolution, setShowSolution] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    concept: true,
    explanation: true,
    examples: true,
    exercise: true,
  })

  const lesson = lessonData[lessonId as keyof typeof lessonData]

  if (!lesson) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Conteúdo da lição não encontrado.</p>
      </div>
    )
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleShowSolution = () => {
    if (!showSolution) {
      setShowConfirmation(true)
    } else {
      setShowSolution(false)
    }
  }

  const confirmShowSolution = () => {
    setShowSolution(true)
    setShowConfirmation(false)
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Lesson Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{lesson.title}</h2>
          </div>
          <Badge variant="secondary">Lição {lessonId}</Badge>
        </div>

        {/* Concept Section */}
        <Card>
          <CardHeader className="pb-3">
            <Button
              variant="ghost"
              className="justify-start p-0 h-auto font-semibold"
              onClick={() => toggleSection("concept")}
            >
              {expandedSections.concept ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <Target className="w-4 h-4 mr-2" />
              Conceito
            </Button>
          </CardHeader>
          {expandedSections.concept && (
            <CardContent className="pt-0">
              <p className="text-muted-foreground leading-relaxed">{lesson.concept}</p>
            </CardContent>
          )}
        </Card>

        {/* Explanation Section */}
        <Card>
          <CardHeader className="pb-3">
            <Button
              variant="ghost"
              className="justify-start p-0 h-auto font-semibold"
              onClick={() => toggleSection("explanation")}
            >
              {expandedSections.explanation ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <BookOpen className="w-4 h-4 mr-2" />
              Como Funciona
            </Button>
          </CardHeader>
          {expandedSections.explanation && (
            <CardContent className="pt-0">
              <pre className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
                {lesson.explanation}
              </pre>
            </CardContent>
          )}
        </Card>

        {/* Examples Section */}
        <Card>
          <CardHeader className="pb-3">
            <Button
              variant="ghost"
              className="justify-start p-0 h-auto font-semibold"
              onClick={() => toggleSection("examples")}
            >
              {expandedSections.examples ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <Code2 className="w-4 h-4 mr-2" />
              Exemplos
            </Button>
          </CardHeader>
          {expandedSections.examples && (
            <CardContent className="pt-0 space-y-4">
              {lesson.examples.map((example, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="font-medium">{example.title}</h4>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{example.code}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground">{example.explanation}</p>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Exercise Section */}
        <Card>
          <CardHeader className="pb-3">
            <Button
              variant="ghost"
              className="justify-start p-0 h-auto font-semibold"
              onClick={() => toggleSection("exercise")}
            >
              {expandedSections.exercise ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <Target className="w-4 h-4 mr-2" />
              Exercício
            </Button>
          </CardHeader>
          {expandedSections.exercise && (
            <CardContent className="pt-0 space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Sua Missão:</h4>
                <p className="text-blue-800 text-sm leading-relaxed">{lesson.exercise.instruction}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Dica:</h4>
                <p className="text-yellow-800 text-sm">{lesson.exercise.hint}</p>
              </div>

              <Separator />

              {/* Solution Section */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleShowSolution}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSolution ? "Ocultar Solução" : "Mostrar Solução"}
                </Button>

                {showConfirmation && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-4">
                      <p className="text-orange-800 mb-4">
                        Tem certeza que você quer ver a solução? Tente resolver primeiro!
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowConfirmation(false)}>
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={confirmShowSolution}>
                          Sim, mostrar solução
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {showSolution && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-700">Solução:</h4>
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{lesson.exercise.expectedOutput}</pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </ScrollArea>
  )
}
