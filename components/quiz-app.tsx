'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { type Question, type Category, type QuizData, sampleData } from '@/types/quiz'

// Local storage key
const STORAGE_KEY = 'bankingQuizData_v3'

export function QuizApp() {
  const [quizData, setQuizData] = useState<QuizData>(sampleData)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [dataReset, setDataReset] = useState(false)

  // Initialize quiz data from localStorage or use sample data
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY)

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)

        // Check if stored data has the correct version
        if (parsedData.version === sampleData.version) {
          setQuizData(parsedData)
        } else {
          // Handle version mismatch - reset to sample data
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData))
          setQuizData(sampleData)
          setDataReset(true)
        }
      } catch (e) {
        // Handle invalid JSON
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData))
        setQuizData(sampleData)
        setDataReset(true)
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData))
      setQuizData(sampleData)
    }
  }, [])

  // Save quiz data to localStorage whenever it changes
  useEffect(() => {
    if (quizData.categories.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizData))
    }
  }, [quizData])

  // Select a new question when needed or when active category changes
  useEffect(() => {
    if (quizData.categories.length > 0 && !currentQuestion) {
      selectNextQuestion()
    }
  }, [quizData, currentQuestion])

  // Get the active category
  const getActiveCategory = (): Category | undefined => {
    return quizData.categories.find(cat => cat.id === quizData.activeCategory)
  }

  // Handle tab change
  const handleTabChange = (categoryId: string) => {
    setQuizData(prev => ({
      ...prev,
      activeCategory: categoryId,
    }))
    setCurrentQuestion(null)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCorrect(null)
  }

  // Algorithm to select the next question based on spaced repetition
  const selectNextQuestion = () => {
    const activeCategory = getActiveCategory()
    if (!activeCategory || activeCategory.questions.length === 0) return

    // Calculate a score for each question (lower is more likely to be shown)
    const now = Date.now()
    const scoredQuestions = activeCategory.questions.map(q => {
      // Base score on correct/incorrect ratio and time since last seen
      const correctRatio = q.correctCount / (q.correctCount + q.incorrectCount + 1)
      const daysSinceLastSeen = q.lastAnswered ? (now - q.lastAnswered) / (1000 * 60 * 60 * 24) : 100

      // Calculate time since this question was last shown (to prevent immediate repeats)
      const minutesSinceLastShown = q.lastShown ? (now - q.lastShown) / (1000 * 60) : 1000

      // Add a significant penalty for recently shown questions (ensures variety)
      const recencyPenalty = minutesSinceLastShown < 1 ? 1000 : 0

      // Questions answered correctly more often and seen recently get higher scores (less likely to be shown)
      // Questions answered incorrectly more often and not seen recently get lower scores (more likely to be shown)
      // But we add the recency penalty to prevent immediate repeats
      const score = correctRatio * 10 - daysSinceLastSeen * (1 - correctRatio) + recencyPenalty

      return { question: q, score }
    })

    // Sort by score (ascending)
    scoredQuestions.sort((a, b) => a.score - b.score)

    // Exclude the current question from selection if possible
    const filteredQuestions =
      currentQuestion && scoredQuestions.length > 1 ? scoredQuestions.filter(q => q.question.id !== currentQuestion.id) : scoredQuestions

    // Select one of the top questions (or fewer if we have fewer questions)
    // Increase this number to add more variety
    const topN = Math.min(3, filteredQuestions.length)
    const randomIndex = Math.floor(Math.random() * topN)
    const nextQuestion = filteredQuestions[randomIndex].question

    // Update the lastShown timestamp for the selected question
    updateQuestion(nextQuestion.id, { lastShown: now })

    setCurrentQuestion(nextQuestion)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCorrect(null)
  }

  // Update a specific question in the active category
  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuizData(prevData => {
      const newCategories = prevData.categories.map(category => {
        if (category.id === prevData.activeCategory) {
          const newQuestions = category.questions.map(q => {
            if (q.id === questionId) {
              return { ...q, ...updates }
            }
            return q
          })
          return { ...category, questions: newQuestions }
        }
        return category
      })
      return { ...prevData, categories: newCategories }
    })
  }

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered || !currentQuestion) return

    setSelectedAnswer(answer)
    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)

    // Update question stats
    updateQuestion(currentQuestion.id, {
      lastAnswered: Date.now(),
      correctCount: correct ? currentQuestion.correctCount + 1 : currentQuestion.correctCount,
      incorrectCount: correct ? currentQuestion.incorrectCount : currentQuestion.incorrectCount + 1,
    })
  }

  // Handle next question button
  const handleNextQuestion = () => {
    setCurrentQuestion(null)
  }

  // Reset all progress for the current category
  const handleResetCategory = () => {
    if (confirm('Opravdu chcete resetovat postup v této kategorii?')) {
      setQuizData(prevData => {
        const newCategories = prevData.categories.map(category => {
          if (category.id === prevData.activeCategory) {
            const resetQuestions = category.questions.map(q => ({
              ...q,
              lastAnswered: undefined,
              lastShown: undefined,
              correctCount: 0,
              incorrectCount: 0,
            }))
            return { ...category, questions: resetQuestions }
          }
          return category
        })
        return { ...prevData, categories: newCategories }
      })
      setCurrentQuestion(null)
    }
  }

  // Reset all progress for all categories
  const handleResetAll = () => {
    if (confirm('Opravdu chcete resetovat postup ve VŠECH kategoriích?')) {
      setQuizData(prevData => {
        const newCategories = prevData.categories.map(category => {
          const resetQuestions = category.questions.map(q => ({
            ...q,
            lastAnswered: undefined,
            lastShown: undefined,
            correctCount: 0,
            incorrectCount: 0,
          }))
          return { ...category, questions: resetQuestions }
        })
        return { ...prevData, categories: newCategories }
      })
      setCurrentQuestion(null)
    }
  }

  const activeCategory = getActiveCategory()

  return (
    <div className='space-y-6'>
      {dataReset && (
        <Alert variant='warning' className='mb-4'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>
            Váš uložený postup byl resetován z důvodu změn ve struktuře dat. Omlouváme se za nepříjemnosti.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={quizData.activeCategory} onValueChange={handleTabChange} className='w-full'>
        <TabsList className='w-full grid' style={{ gridTemplateColumns: `repeat(${quizData.categories.length}, 1fr)` }}>
          {quizData.categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {!currentQuestion && activeCategory && <div className='text-center py-8'>Načítání otázek...</div>}

      {currentQuestion && activeCategory && (
        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle className='text-xl'>{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    selectedAnswer === option
                      ? isCorrect
                        ? 'success'
                        : 'destructive'
                      : isAnswered && option === currentQuestion.correctAnswer
                      ? 'success'
                      : 'outline'
                  }
                  className={`w-full justify-start text-left p-4 h-auto min-h-[60px] whitespace-normal ${
                    isAnswered ? 'cursor-default' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                >
                  <div className='flex w-full'>
                    <div className='flex-grow mr-2'>{option}</div>
                    {isAnswered && option === selectedAnswer && isCorrect && <CheckCircle className='flex-shrink-0 h-5 w-5 ml-auto' />}
                    {isAnswered && option === selectedAnswer && !isCorrect && <XCircle className='flex-shrink-0 h-5 w-5 ml-auto' />}
                    {isAnswered && !isCorrect && option === currentQuestion.correctAnswer && (
                      <CheckCircle className='flex-shrink-0 h-5 w-5 ml-auto' />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            {isAnswered && (
              <Alert variant={isCorrect ? 'success' : 'destructive'} className='w-full'>
                <AlertDescription>
                  {isCorrect ? 'Správně! Výborně.' : `Nesprávně. Správná odpověď je: ${currentQuestion.correctAnswer}`}
                </AlertDescription>
              </Alert>
            )}
            {isAnswered && (
              <Button onClick={handleNextQuestion} className='w-full'>
                Další otázka
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      <div className='flex justify-between flex-wrap gap-2'>
        <div className='text-sm text-gray-500'>
          {activeCategory ? `Otázky v kategorii ${activeCategory.name}: ${activeCategory.questions.length}` : ''}
        </div>
        <div className='space-x-2'>
          <Button variant='outline' size='sm' onClick={handleResetCategory}>
            Resetovat kategorii
          </Button>
          <Button variant='outline' size='sm' onClick={handleResetAll}>
            Resetovat vše
          </Button>
        </div>
      </div>
    </div>
  )
}
