"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Lesson {
  id: number
  title: string
  description: string
  isCompleted: boolean
  isUnlocked: boolean
  difficulty: "Básico" | "Intermediário" | "Avançado"
}

interface LessonContextType {
  lessons: Lesson[]
  currentLesson: number | null
  completedLessons: number
  progressPercentage: number
  completeLesson: (lessonId: number) => void
  navigateToLesson: (lessonId: number) => void
  unlockNextLesson: (lessonId: number) => void
  resetAllProgress: () => void
}

const LessonContext = createContext<LessonContextType | undefined>(undefined)

const initialLessons: Lesson[] = [
  {
    id: 1,
    title: "Introdução ao HTML",
    description: "Aprenda os conceitos básicos do HTML e sua estrutura fundamental",
    isCompleted: false,
    isUnlocked: true,
    difficulty: "Básico",
  },
  {
    id: 2,
    title: "Tags e Elementos",
    description: "Descubra as principais tags HTML e como utilizá-las",
    isCompleted: false,
    isUnlocked: false,
    difficulty: "Básico",
  },
  {
    id: 3,
    title: "Estrutura de Página",
    description: "Construa a estrutura completa de uma página web",
    isCompleted: false,
    isUnlocked: false,
    difficulty: "Básico",
  },
  {
    id: 4,
    title: "Links e Imagens",
    description: "Adicione links e imagens ao seu site",
    isCompleted: false,
    isUnlocked: false,
    difficulty: "Intermediário",
  },
  {
    id: 5,
    title: "Quiz Final",
    description: "Teste seus conhecimentos e ganhe seu certificado",
    isCompleted: false,
    isUnlocked: false,
    difficulty: "Avançado",
  },
]

export function LessonProvider({ children }: { children: ReactNode }) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [currentLesson, setCurrentLesson] = useState<number | null>(null)

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("html-academy-progress")
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress)
      setLessons(parsedProgress.lessons || initialLessons)
      setCurrentLesson(parsedProgress.currentLesson || null)
    }
  }, [])

  // Save progress to localStorage whenever lessons change
  useEffect(() => {
    localStorage.setItem("html-academy-progress", JSON.stringify({ lessons, currentLesson }))
  }, [lessons, currentLesson])

  const completedLessons = lessons.filter((lesson) => lesson.isCompleted).length
  const progressPercentage = (completedLessons / lessons.length) * 100

  const completeLesson = (lessonId: number) => {
    setLessons((prev) => prev.map((lesson) => (lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson)))
    unlockNextLesson(lessonId)
  }

  const unlockNextLesson = (lessonId: number) => {
    const nextLessonId = lessonId + 1
    setLessons((prev) => prev.map((lesson) => (lesson.id === nextLessonId ? { ...lesson, isUnlocked: true } : lesson)))
  }

  const navigateToLesson = (lessonId: number) => {
    const lesson = lessons.find((l) => l.id === lessonId)
    if (lesson && lesson.isUnlocked) {
      setCurrentLesson(lessonId)
    }
  }

  const resetAllProgress = () => {
    setLessons(initialLessons)
    setCurrentLesson(null)
    localStorage.removeItem("html-academy-progress")
  }

  return (
    <LessonContext.Provider
      value={{
        lessons,
        currentLesson,
        completedLessons,
        progressPercentage,
        completeLesson,
        navigateToLesson,
        unlockNextLesson,
        resetAllProgress,
      }}
    >
      {children}
    </LessonContext.Provider>
  )
}

export function useLessons() {
  const context = useContext(LessonContext)
  if (context === undefined) {
    throw new Error("useLessons must be used within a LessonProvider")
  }
  return context
}
