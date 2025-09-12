import { Inter } from 'next/font/google';
import Header from '../components/Header';
import TextToSpeech from '../components/TextToSpeech';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      {/* Header outside the container to make it full width */}
      <Header />
      
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="py-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI Text to Speech
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Generate natural-sounding speech in any voice, style, and language.
              </p>
            </div>
            <TextToSpeech />
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ElevenLabs Clone. For demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
