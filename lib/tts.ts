import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Assumes GOOGLE_APPLICATION_CREDENTIALS is set in env
const client = new TextToSpeechClient();

export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const request = {
    input: { text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'en-US', name: 'en-US-Chirp-HD-F' }, // Chirp voice
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' as const },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    
    if (!response.audioContent) {
      throw new Error('No audio content received from TTS API');
    }

    return Buffer.from(response.audioContent);
  } catch (error) {
    console.error('Error in TTS synthesis:', error);
    throw error;
  }
}
