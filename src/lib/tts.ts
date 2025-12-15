import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient();

export async function synthesizeSpeech(text: string): Promise<Buffer | null> {
  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'en-US', name: 'en-US-Studio-O' }, // Using Studio voice as Chirp might require specific compilation/long-running ops for simple implementation
      audioConfig: { audioEncoding: 'MP3' },
    });

    if (response.audioContent) {
      return Buffer.from(response.audioContent);
    }
    return null;
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    return null;
  }
}
