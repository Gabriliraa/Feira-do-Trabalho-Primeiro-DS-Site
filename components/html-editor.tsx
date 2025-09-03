"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useLessons } from "@/lib/lesson-context"
import { CheckCircle, RotateCcw, Lightbulb, Zap, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"

interface HTMLEditorProps {
  lessonId: number
  expectedOutput: string
  initialCode?: string
}

export function HTMLEditor({ lessonId, expectedOutput, initialCode = "" }: HTMLEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lineNumbers, setLineNumbers] = useState<number[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const previewRef = useRef<HTMLIFrameElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { completeLesson, lessons } = useLessons()
  const router = useRouter()

  const lesson = lessons.find((l) => l.id === lessonId)

  // Generate line numbers
  useEffect(() => {
    const lines = code.split("\n").length
    setLineNumbers(Array.from({ length: Math.max(lines, 10) }, (_, i) => i + 1))
  }, [code])

  useEffect(() => {
    if (previewRef.current) {
      const iframe = previewRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(code || "<html><body><p>Digite seu código HTML...</p></body></html>")
        doc.close()
      }
    }

    // Also update global preview frame if it exists
    if (window.previewFrame) {
      const doc = window.previewFrame.contentDocument || window.previewFrame.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(code || "<html><body><p>Digite seu código HTML...</p></body></html>")
        doc.close()
      }
    }
  }, [code])

  useEffect(() => {
    const normalizeHTML = (html: string) => {
      return html.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim().toLowerCase()
    }

    const userCode = normalizeHTML(code)
    const expected = normalizeHTML(expectedOutput)
    const correct = userCode === expected

    setIsCorrect(correct)
  }, [code, expectedOutput])

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    const position = e.target.selectionStart
    setCode(newCode)
    setCursorPosition(position)

    // Show suggestions when typing < or after certain characters
    const beforeCursor = newCode.substring(0, position)
    const shouldShowSuggestions =
      beforeCursor.endsWith("<") ||
      (beforeCursor.includes("<") && !beforeCursor.substring(beforeCursor.lastIndexOf("<")).includes(">"))

    setShowSuggestions(shouldShowSuggestions)
  }

  const insertSuggestion = (suggestion: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const beforeCursor = code.substring(0, start)
    const afterCursor = code.substring(end)

    // Remove the < that triggered the suggestion
    const beforeWithoutTrigger = beforeCursor.endsWith("<") ? beforeCursor.slice(0, -1) : beforeCursor

    const newCode = beforeWithoutTrigger + suggestion + afterCursor
    setCode(newCode)
    setShowSuggestions(false)

    // Set cursor position after the inserted tag
    setTimeout(() => {
      const newPosition = beforeWithoutTrigger.length + suggestion.length
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()
    }, 0)
  }

  const handleReset = () => {
    setCode(initialCode)
    setShowSuccess(false)
    setShowSuggestions(false)
  }

  const handleRunCode = () => {
    if (isCorrect && !lesson?.isCompleted) {
      setShowSuccess(true)
      completeLesson(lessonId)

      // Show success for 3 seconds then redirect to home
      setTimeout(() => {
        router.push("/")
      }, 3000)
    }
  }

  const getStarterTemplate = () => {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Minha Página</title>
</head>
<body>
    <!-- Escreva seu código aqui -->
    
</body>
</html>`
  }

  const htmlSuggestions = [
    { tag: "<html>", description: "Elemento raiz do documento" },
    { tag: "<head>", description: "Cabeçalho do documento" },
    { tag: "<title>", description: "Título da página" },
    { tag: "<body>", description: "Corpo do documento" },
    { tag: "<h1>", description: "Título principal" },
    { tag: "<h2>", description: "Subtítulo" },
    { tag: "<p>", description: "Parágrafo" },
    { tag: "<strong>", description: "Texto em negrito" },
    { tag: "<em>", description: "Texto em itálico" },
    { tag: '<a href="">', description: "Link" },
    { tag: '<img src="/placeholder.svg" alt="">', description: "Imagem" },
    { tag: "<header>", description: "Cabeçalho da página" },
    { tag: "<main>", description: "Conteúdo principal" },
    { tag: "<footer>", description: "Rodapé da página" },
    { tag: "<!DOCTYPE html>", description: "Declaração do tipo de documento" },
  ]

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-slate-300">index.html</span>
          {isCorrect && (
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Pronto para executar!
            </Badge>
          )}
          <Badge variant="outline" className="text-slate-300 border-slate-600">
            <Zap className="w-3 h-3 mr-1" />
            Preview Automático
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCode(getStarterTemplate())}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Template
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {isCorrect && (
        <div className="bg-green-600 p-4 border-b border-green-500">
          <div className="flex items-center justify-center">
            <Button
              size="lg"
              onClick={handleRunCode}
              className="bg-white text-green-600 hover:bg-green-50 font-bold text-lg px-8 py-3 shadow-lg"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Finalizar Lição {lessonId}
            </Button>
          </div>
          <p className="text-center text-green-100 text-sm mt-2">
            🎉 Parabéns! Seu código está correto. Clique para completar a lição!
          </p>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 flex relative">
        {/* Line Numbers */}
        <div className="bg-slate-800 text-slate-500 text-sm font-mono p-4 pr-2 select-none border-r border-slate-700">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6 text-right">
              {num}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            placeholder="Digite seu código HTML aqui... (Digite < para ver sugestões)"
            className="w-full h-full bg-slate-900 text-slate-100 border-0 resize-none font-mono text-sm leading-6 p-4 focus:ring-0 focus:outline-none"
            style={{
              minHeight: "100%",
              fontFamily: "Consolas, 'Courier New', monospace",
            }}
          />

          {showSuggestions && (
            <div className="absolute top-16 left-4 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10 max-w-sm">
              <div className="p-2 border-b border-slate-600">
                <p className="text-xs text-slate-300 font-medium">💡 Sugestões HTML</p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {htmlSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => insertSuggestion(suggestion.tag)}
                    className="w-full text-left p-2 hover:bg-slate-700 text-sm text-slate-100 border-b border-slate-700 last:border-b-0"
                  >
                    <div className="font-mono text-blue-300">{suggestion.tag}</div>
                    <div className="text-xs text-slate-400">{suggestion.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-800 border-t border-slate-700 px-4 py-2 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>HTML</span>
          <span>UTF-8</span>
          <span>
            Ln {code.split("\n").length}, Col {code.length}
          </span>
          <span className="text-blue-400">Preview automático ativo</span>
        </div>
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <span className="text-green-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Código correto - Clique no botão verde acima!
            </span>
          ) : (
            <span className="text-yellow-400">Continue digitando...</span>
          )}
        </div>
      </div>

      {/* Hidden preview iframe for real-time updates */}
      <iframe ref={previewRef} className="hidden" title="Hidden Preview" sandbox="allow-same-origin" />
    </div>
  )
}

// Preview component for the right panel
export function HTMLPreview() {
  return (
    <div className="h-full bg-white">
      <iframe
        ref={(ref) => {
          if (ref) {
            // This will be updated by the editor component
            window.previewFrame = ref
          }
        }}
        className="w-full h-full border-0"
        title="HTML Preview"
        sandbox="allow-same-origin"
      />
    </div>
  )
}
