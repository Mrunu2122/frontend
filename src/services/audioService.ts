const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Language to code mapping
const LANGUAGE_MAP = {
  english: 'en',
  arabic: 'ar'
};

// Get the audio URL for text-to-speech
export const getTtsAudioUrl = (text: string, language: string): string => {
  const langCode = LANGUAGE_MAP[language.toLowerCase() as keyof typeof LANGUAGE_MAP] || 'en';
  return `${API_BASE_URL}/tts?text=${encodeURIComponent(text)}&lang=${language}`;
};

// Get the supported languages
export const getSupportedLanguages = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching languages: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.languages || [];
  } catch (error) {
    console.error('Error fetching supported languages:', error);
    return ['english']; // Default to English if there's an error
  }
};

// For backward compatibility
export const getAudioByLanguage = async (text: string, language: string): Promise<string> => {
  return getTtsAudioUrl(text, language);
};

/**
 * Fetches all available audio files
 */
export const getAllAudioFiles = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/audio`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error fetching audio files: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching audio files:', error);
    throw error;
  }
};
