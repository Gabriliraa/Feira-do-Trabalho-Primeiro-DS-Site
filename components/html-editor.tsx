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
  const [suggestions, setSuggestions] = useState<Array<{ trigger: string; completion: string; description: string }>>(
    [],
  )
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { completeLesson, lessons } = useLessons()
  const router = useRouter()

  const lesson = lessons.find((l) => l.id === lessonId)

  useEffect(() => {
    const lines = code.split("\n").length
    setLineNumbers(Array.from({ length: Math.max(lines, 10) }, (_, i) => i + 1))
  }, [code])

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).updatePreview) {
      ;(window as any).updatePreview(code)
    }
  }, [code])

  useEffect(() => {
    const validateCode = (userCode: string, expectedCode: string) => {
      if (!userCode.includes("<") || !userCode.includes(">")) {
        return false
      }

      const testCode = (htmlCode: string) => {
        try {
          const tempDiv = document.createElement("div")
          tempDiv.innerHTML = htmlCode

          const textContent = tempDiv.textContent?.trim() || ""
          const htmlContent = tempDiv.innerHTML || ""

          return { text: textContent, html: htmlContent }
        } catch (error) {
          return { text: "", html: "" }
        }
      }

      const userOutput = testCode(userCode)
      const expectedOutput = testCode(expectedCode)

      const requiredElements = extractRequiredElements(expectedCode)
      const hasRequiredElements = checkRequiredElements(userCode, requiredElements)

      const textMatches = checkTextContent(userOutput.text, expectedOutput.text)

      const structureMatches = checkHTMLStructure(userOutput.html, expectedOutput.html)

      return hasRequiredElements && textMatches && structureMatches
    }

    const extractRequiredElements = (expectedCode: string) => {
      const elementRegex = /<(\w+)(?:\s[^>]*)?>/g
      const elements = []
      let match
      while ((match = elementRegex.exec(expectedCode)) !== null) {
        elements.push(match[1].toLowerCase())
      }
      return [...new Set(elements)]
    }

    const checkRequiredElements = (userCode: string, requiredElements: string[]) => {
      const userLower = userCode.toLowerCase()
      const foundElements = requiredElements.filter((element) => {
        return (
          userLower.includes(`<${element}>`) || userLower.includes(`<${element} `) || userLower.includes(`<${element}/`)
        )
      })

      return foundElements.length >= Math.ceil(requiredElements.length * 0.8)
    }

    const checkTextContent = (userText: string, expectedText: string) => {
      if (!expectedText.trim()) return true

      const normalizeForSpelling = (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      }

      const userNormalized = normalizeForSpelling(userText)
      const expectedNormalized = normalizeForSpelling(expectedText)

      if (userNormalized === expectedNormalized) return true

      const similarity = calculateTextSimilarity(userNormalized, expectedNormalized)
      return similarity > 0.75
    }

    const checkHTMLStructure = (userHTML: string, expectedHTML: string) => {
      const extractStructure = (html: string) => {
        return html
          .replace(/<(\w+)[^>]*>/g, "<$1>")
          .replace(/>\s*</g, "><")
          .toLowerCase()
      }

      const userStructure = extractStructure(userHTML)
      const expectedStructure = extractStructure(expectedHTML)

      const similarity = calculateTextSimilarity(userStructure, expectedStructure)
      return similarity > 0.6
    }

    const calculateTextSimilarity = (str1: string, str2: string) => {
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

    const correct = validateCode(code, expectedOutput)
    setIsCorrect(correct)
  }, [code, expectedOutput])

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    const position = e.target.selectionStart
    setCode(newCode)
    setCursorPosition(position)

    const beforeCursor = newCode.substring(0, position)
    const lastChar = beforeCursor.charAt(position - 1)

    if (lastChar && /[a-zA-Z]/.test(lastChar)) {
      const wordStart = beforeCursor.search(/[a-zA-Z][a-zA-Z]*$/)
      if (wordStart !== -1) {
        const currentWord = beforeCursor.substring(wordStart)
        const matchingSuggestions = getMatchingSuggestions(currentWord)

        if (matchingSuggestions.length > 0) {
          setTypedText(currentWord)
          setSuggestions(matchingSuggestions)
          setSelectedSuggestionIndex(0)
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
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
      } else if (e.key === "Enter") {
        e.preventDefault()
        acceptSuggestion()
      } else if (e.key === "Escape") {
        setShowSuggestions(false)
      }
    }
  }

  const getMatchingSuggestions = (typed: string) => {
    const allSuggestions = [
      { trigger: "p", completion: "<p></p>", description: "Parágrafo" },
      { trigger: "h1", completion: "<h1></h1>", description: "Título principal" },
      { trigger: "h2", completion: "<h2></h2>", description: "Subtítulo" },
      { trigger: "h3", completion: "<h3></h3>", description: "Título menor" },
      { trigger: "h4", completion: "<h4></h4>", description: "Título pequeno" },
      { trigger: "h5", completion: "<h5></h5>", description: "Título muito pequeno" },
      { trigger: "h6", completion: "<h6></h6>", description: "Título mínimo" },
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
      { trigger: "header", completion: "<header></header>", description: "Cabeçalho da página" },
      { trigger: "footer", completion: "<footer></footer>", description: "Rodapé da página" },
      { trigger: "section", completion: "<section></section>", description: "Seção do conteúdo" },
      { trigger: "nav", completion: "<nav></nav>", description: "Navegação" },
      { trigger: "article", completion: "<article></article>", description: "Artigo" },
      { trigger: "aside", completion: "<aside></aside>", description: "Conteúdo lateral" },
      { trigger: "main", completion: "<main></main>", description: "Conteúdo principal" },
      { trigger: "button", completion: "<button></button>", description: "Botão" },
      { trigger: "input", completion: '<input type="text">', description: "Campo de entrada" },
      { trigger: "form", completion: "<form></form>", description: "Formulário" },
      { trigger: "label", completion: "<label></label>", description: "Rótulo" },
      { trigger: "textarea", completion: "<textarea></textarea>", description: "Área de texto" },
      { trigger: "select", completion: "<select>\n  <option></option>\n</select>", description: "Lista de seleção" },
      { trigger: "option", completion: "<option></option>", description: "Opção de seleção" },
      { trigger: "table", completion: "<table>\n  <tr>\n    <td></td>\n  </tr>\n</table>", description: "Tabela" },
      { trigger: "tr", completion: "<tr></tr>", description: "Linha da tabela" },
      { trigger: "td", completion: "<td></td>", description: "Célula da tabela" },
      { trigger: "th", completion: "<th></th>", description: "Cabeçalho da tabela" },
      { trigger: "thead", completion: "<thead></thead>", description: "Cabeçalho da tabela" },
      { trigger: "tbody", completion: "<tbody></tbody>", description: "Corpo da tabela" },
      { trigger: "meta", completion: '<meta charset="UTF-8">', description: "Metadados" },
      { trigger: "link", completion: '<link rel="stylesheet" href="">', description: "Link externo" },
      { trigger: "script", completion: "<script></script>", description: "Script JavaScript" },
      { trigger: "style", completion: "<style></style>", description: "Estilos CSS" },
    ]

    return allSuggestions.filter(
      (s) => s.trigger.toLowerCase().startsWith(typed.toLowerCase()) && typed.toLowerCase() !== "",
    )
  }

  const acceptSuggestion = () => {
    if (!textareaRef.current || suggestions.length === 0) return

    const selectedSuggestion = suggestions[selectedSuggestionIndex]
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const beforeCursor = code.substring(0, start)
    const afterCursor = code.substring(end)

    const wordStart = beforeCursor.search(/[a-zA-Z][a-zA-Z]*$/)
    const beforeWord = beforeCursor.substring(0, wordStart)

    const newCode = beforeWord + selectedSuggestion.completion + afterCursor
    setCode(newCode)
    setShowSuggestions(false)

    setTimeout(() => {
      const cursorPos = beforeWord.length + selectedSuggestion.completion.indexOf("></") + 1
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

  return (
    <div className="h-full flex flex-col bg-slate-900">
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

      <div className="flex-1 flex relative">
        <div className="bg-slate-800 text-slate-500 text-sm font-mono p-4 pr-2 select-none border-r border-slate-700">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6 text-right">
              {num}
            </div>
          ))}
        </div>

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

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-16 left-4 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10 max-w-sm">
              <div className="p-3 border-b border-slate-600">
                <p className="text-xs text-slate-300 font-medium">💡 Sugestões Inteligentes</p>
                <p className="text-xs text-slate-400 mt-1">
                  Use <kbd className="bg-slate-700 px-1 rounded">↑↓</kbd> para navegar,{" "}
                  <kbd className="bg-slate-700 px-1 rounded">Enter</kbd> para aceitar
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b border-slate-700 last:border-b-0 cursor-pointer ${
                      index === selectedSuggestionIndex ? "bg-slate-700" : "hover:bg-slate-750"
                    }`}
                    onClick={() => {
                      setSelectedSuggestionIndex(index)
                      acceptSuggestion()
                    }}
                  >
                    <div className="font-mono text-blue-300 text-sm">{suggestion.completion}</div>
                    <div className="text-xs text-slate-400 mt-1">{suggestion.description}</div>
                  </div>
                ))}
              </div>
              {suggestions.length > 1 && (
                <div className="p-2 border-t border-slate-600 text-xs text-slate-400 text-center">
                  {selectedSuggestionIndex + 1} de {suggestions.length} sugestões
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
    </div>
  )
}

export function HTMLPreview() {
  const [previewContent, setPreviewContent] = useState("<html><body><p>Digite seu código HTML...</p></body></html>")

  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).updatePreview = (code: string) => {
        setPreviewContent(code || "<html><body><p>Digite seu código HTML...</p></body></html>")
      }
    }
  }, [])

  return (
    <div className="h-full bg-white">
      <iframe
        className="w-full h-full border-0"
        title="HTML Preview"
        sandbox="allow-same-origin allow-scripts"
        srcDoc={previewContent}
      />
    </div>
  )
}
