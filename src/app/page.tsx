import Header from '@/components/Header'
import TextToSpeech from '@/components/TextToSpeech'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets:['latin'] })

export default function Home(){
  return (
    <div className={`${inter.className} min-h-screen bg-white`}>
      <Header />
      <main>
        <TextToSpeech />
      </main>
      <footer className="mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ElevenLabs - Clone for demo purposes
        </div>
      </footer>
    </div>
  )
}
