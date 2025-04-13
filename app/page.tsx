import { QuizApp } from '@/components/quiz-app'

export default function Home() {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-4 md:p-24 bg-gray-50'>
      <div className='max-w-3xl w-full'>
        <h1 className='text-3xl font-bold text-center mb-8'>Bankovní kvíz</h1>
        <QuizApp />
      </div>
    </main>
  )
}
