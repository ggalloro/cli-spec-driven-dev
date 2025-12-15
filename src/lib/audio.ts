import fs from 'fs';
import path from 'path';

export async function savePodcastFile(audioBuffers: Buffer[], id: string): Promise<{ url: string; duration: number }> {
  const combinedBuffer = Buffer.concat(audioBuffers);
  const timestamp = Math.floor(Date.now() / 1000);
  const fileName = `${timestamp}-${id}.mp3`;
  const publicDir = path.join(process.cwd(), 'public', 'podcasts');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filePath = path.join(publicDir, fileName);
  fs.writeFileSync(filePath, combinedBuffer);

  // Approximate duration calculation for MP3 (very rough estimate, assuming standard bitrate)
  // For precise duration, we'd need an MP3 parser, but for MVP this suffices or we accept 0
  const duration = Math.ceil(combinedBuffer.length / 16000); // Rough guess for 128kbps

  return {
    url: `/podcasts/${fileName}`,
    duration,
  };
}
