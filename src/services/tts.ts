import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const client = new TextToSpeechClient();

export async function synthesizeSpeech(text: string): Promise<string> {
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'en-US', name: 'en-US-Chirp-HD-D' },
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' as const },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    
    if (!response.audioContent) {
      throw new Error("No audio content received from TTS API.");
    }

    const fileName = `${uuidv4()}.mp3`;
    // Save to a temporary directory first
    const tmpDir = path.join(process.cwd(), 'tmp');
    try {
        await fs.access(tmpDir);
    } catch {
        await fs.mkdir(tmpDir, { recursive: true });
    }
    
    const filePath = path.join(tmpDir, fileName);
    await fs.writeFile(filePath, response.audioContent, 'binary');
    
    return filePath;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
}
