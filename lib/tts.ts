import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Ensure credentials are set or this will fail
const client = new TextToSpeechClient();

export async function generateAudioSegment(text: string): Promise<string> {
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'en-US', name: 'en-US-Neural2-J', ssmlGender: 'MALE' as const },
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' as const },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    if (!audioContent) {
      throw new Error("No audio content received from TTS API.");
    }

    // Save temporary segment
    const tempDir = path.join(process.cwd(), 'tmp_audio');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(tempDir, fileName);

    await fs.promises.writeFile(filePath, audioContent, 'binary');
    return filePath;
  } catch (error) {
    console.error("Error generating audio segment:", error);
    throw error;
  }
}
