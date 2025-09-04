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
  const [currentSuggestion, setCurrentSuggestion] = useState("")
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
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
    const validateCode = (userCode: string, expectedCode: string) => {
      // Create temporary iframes to test both codes
      const testUserCode = () => {
        try {
          const iframe = document.createElement("iframe")
          iframe.style.display = "none"
          document.body.appendChild(iframe)
          const doc = iframe.contentDocument || iframe.contentWindow?.document
          if (doc) {
            doc.open()
            doc.write(userCode)
            doc.close()

            // Check if the code produces similar visual output
            const userBody = doc.body
            const userText = userBody?.textContent?.trim().toLowerCase() || ""

            document.body.removeChild(iframe)
            return userText
          }
        } catch (error) {
          return ""
        }
        return ""
      }

      const testExpectedCode = () => {
        try {
          const iframe = document.createElement("iframe")
          iframe.style.display = "none"
          document.body.appendChild(iframe)
          const doc = iframe.contentDocument || iframe.contentWindow?.document
          if (doc) {
            doc.open()
            doc.write(expectedCode)
            doc.close()

            const expectedBody = doc.body
            const expectedText = expectedBody?.textContent?.trim().toLowerCase() || ""

            document.body.removeChild(iframe)
            return expectedText
          }
        } catch (error) {
          return ""
        }
        return ""
      }

      const userOutput = testUserCode()
      const expectedOutput = testExpectedCode()

      // Check if the essential content matches (ignoring minor spelling errors and formatting)
      const normalizeText = (text: string) => {
        return text
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, " ")
          .trim()
      }

      const normalizedUser = normalizeText(userOutput)
      const normalizedExpected = normalizeText(expectedOutput)

      // If the text content is similar (allowing for small differences)
      if (normalizedUser && normalizedExpected) {
        const similarity = calculateSimilarity(normalizedUser, normalizedExpected)
        return similarity > 0.7 // 70% similarity threshold
      }

      // Fallback to basic HTML structure check
      const hasBasicStructure = userCode.includes("<") && userCode.includes(">")
      const hasRequiredElements = checkRequiredElements(userCode, expectedCode)

      return hasBasicStructure && hasRequiredElements
    }

    const calculateSimilarity = (str1: string, str2: string) => {
      const longer = str1.length > str2.length ? str1 : str2
      const shorter = str1.length > str2.length ? str2 : str1

      if (longer.length === 0) return 1.0

      const editDistance = levenshteinDistance(longer, shorter)
      return (longer.length - editDistance) / longer.length
    }

    const levenshteinDistance = (str1: string, str2: string) => {
      const matrix = []
      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i]
      }
      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j
      }
      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1]
          } else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          }
        }
      }
      return matrix[str2.length][str1.length]
    }

    const checkRequiredElements = (userCode: string, expectedCode: string) => {
      // Extract key HTML elements from expected code
      const elementRegex = /<(\w+)[^>]*>/g
      const expectedElements = []
      let match
      while ((match = elementRegex.exec(expectedCode)) !== null) {
        expectedElements.push(match[1].toLowerCase())
      }

      // Check if user code has most of the required elements
      const userLower = userCode.toLowerCase()
      const foundElements = expectedElements.filter(
        (element) => userLower.includes(`<${element}`) || userLower.includes(`<${element} `),
      )

      return foundElements.length >= Math.ceil(expectedElements.length * 0.7) // 70% of elements present
    }

    const correct = validateCode(code, expectedOutput)
    setIsCorrect(correct)
  }, [code, expectedOutput])

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    const position = e.target.selectionStart
    setCode(newCode)
    setCursorPosition(position)

    // Get the character before cursor
    const beforeCursor = newCode.substring(0, position)
    const lastChar = beforeCursor.charAt(position - 1)

    // Smart autocomplete detection
    if (lastChar && /[a-zA-Z]/.test(lastChar)) {
      const wordStart = beforeCursor.search(/[a-zA-Z][a-zA-Z]*$/)
      if (wordStart !== -1) {
        const currentWord = beforeCursor.substring(wordStart)
        const matchingSuggestions = getMatchingSuggestions(currentWord)

        if (matchingSuggestions.length > 0) {
          setTypedText(currentWord)
          setCurrentSuggestion(matchingSuggestions[0])
          setSuggestionIndex(0)
          setShowSuggestions(true)
        } else {
          setShowSuggestions(false)
        }
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && showSuggestions && currentSuggestion) {
      e.preventDefault()
      acceptSuggestion()
    } else if (e.key === "Escape" && showSuggestions) {
      setShowSuggestions(false)
    }
  }

  const getMatchingSuggestions = (typed: string) => {
    const suggestions = [
      { trigger: "p", completion: "<p></p>", description: "Parágrafo" },
      { trigger: "h1", completion: "<h1></h1>", description: "Título principal" },
      { trigger: "h2", completion: "<h2></h2>", description: "Subtítulo" },
      { trigger: "h3", completion: "<h3></h3>", description: "Título menor" },
      { trigger: "div", completion: "<div></div>", description: "Divisão/Container" },
      { trigger: "span", completion: "<span></span>", description: "Texto inline" },
      { trigger: "strong", completion: "<strong></strong>", description: "Texto em negrito" },
      { trigger: "em", completion: "<em></em>", description: "Texto em itálico" },
      { trigger: "a", completion: '<a href=""></a>', description: "Link" },
      { trigger: "img", completion: '<img src="/placeholder.svg" alt="">', description: "Imagem" },
      { trigger: "ul", completion: "<ul>\n  <li></li>\n</ul>", description: "Lista não ordenada" },
      { trigger: "ol", completion: "<ol>\n  <li></li>\n</ol>", description: "Lista ordenada" },
      { trigger: "li", completion: "<li></li>", description: "Item de lista" },
      { trigger: "br", completion: "<br>", description: "Quebra de linha" },
      { trigger: "hr", completion: "<hr>", description: "Linha horizontal" },
      { trigger: "html", completion: "<html>\n</html>", description: "Elemento raiz" },
      { trigger: "head", completion: "<head>\n</head>", description: "Cabeçalho do documento" },
      { trigger: "body", completion: "<body>\n</body>", description: "Corpo do documento" },
      { trigger: "title", completion: "<title></title>", description: "Título da página" },
    ]

    return suggestions.filter(
      (s) => s.trigger.toLowerCase().startsWith(typed.toLowerCase()) && s.trigger !== typed.toLowerCase(),
    )
  }

  const acceptSuggestion = () => {
    if (!textareaRef.current || !currentSuggestion) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const beforeCursor = code.substring(0, start)
    const afterCursor = code.substring(end)

    // Remove the typed text and insert the suggestion
    const wordStart = beforeCursor.search(/[a-zA-Z][a-zA-Z]*$/)
    const beforeWord = beforeCursor.substring(0, wordStart)

    const suggestion = htmlSuggestions.find((s) => s.completion === currentSuggestion)
    const newCode = beforeWord + suggestion.completion + afterCursor
    setCode(newCode)
    setShowSuggestions(false)

    // Position cursor appropriately
    setTimeout(() => {
      const cursorPos = beforeWord.length + suggestion.completion.indexOf("></") + 1
      textarea.setSelectionRange(cursorPos, cursorPos)
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
    { completion: "<p></p>", description: "Parágrafo" },
    { completion: "<h1></h1>", description: "Título principal" },
    { completion: "<h2></h2>", description: "Subtítulo" },
    { completion: "<strong></strong>", description: "Texto em negrito" },
    { completion: "<em></em>", description: "Texto em itálico" },
    { completion: '<a href=""></a>', description: "Link" },
    { completion: '<img src="/placeholder.svg" alt="">', description: "Imagem" },
    { completion: "<div></div>", description: "Container" },
    { completion: "<span></span>", description: "Texto inline" },
    { completion: "<ul>\n  <li></li>\n</ul>", description: "Lista não ordenada" },
    { completion: "<ol>\n  <li></li>\n</ol>", description: "Lista ordenada" },
    { completion: "<li></li>", description: "Item de lista" },
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
            Preview Automático + Autocomplete Inteligente
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
            🎉 Parabéns! Seu código funciona perfeitamente. Clique para completar a lição!
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
            onKeyDown={handleKeyDown}
            placeholder="Digite seu código HTML aqui... (Digite qualquer letra para ver sugestões inteligentes)"
            className="w-full h-full bg-slate-900 text-slate-100 border-0 resize-none font-mono text-sm leading-6 p-4 focus:ring-0 focus:outline-none"
            style={{
              minHeight: "100%",
              fontFamily: "Consolas, 'Courier New', monospace",
            }}
          />

          {showSuggestions && currentSuggestion && (
            <div className="absolute top-16 left-4 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10 max-w-sm">
              <div className="p-3 border-b border-slate-600">
                <p className="text-xs text-slate-300 font-medium">💡 Sugestão Inteligente</p>
                <p className="text-xs text-slate-400 mt-1">
                  Pressione <kbd className="bg-slate-700 px-1 rounded">Enter</kbd> para aceitar
                </p>
              </div>
              <div className="p-3">
                <div className="font-mono text-blue-300 text-sm">{currentSuggestion}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {htmlSuggestions.find((s) => s.completion === currentSuggestion)?.description}
                </div>
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
          <span className="text-blue-400">Autocomplete inteligente + Preview automático</span>
        </div>
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <span className="text-green-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Código funcionando - Clique no botão verde acima!
            </span>
          ) : (
            <span className="text-yellow-400">Continue digitando... (Digite qualquer letra para sugestões)</span>
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
