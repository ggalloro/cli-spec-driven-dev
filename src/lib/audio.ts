import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function generateAudio(text: string): Promise<string> {
  try {
    // Use getAllAudioBase64 to automatically split long text (limit 200 chars)
    // and get multiple audio segments.
    const results = await googleTTS.getAllAudioBase64(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
      splitPunct: ',.?!', // Split on punctuation
    });

    // Convert all base64 results to buffers
    const buffers = results.map(result => Buffer.from(result.base64, 'base64'));

    // Concatenate all buffers into one
    const combinedBuffer = Buffer.concat(buffers);

    const fileName = `${crypto.randomUUID()}.mp3`;
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, combinedBuffer);
    
    return filePath;
  } catch (error) {
    console.error('Error generating audio:', error);
    throw error;
  }
}