import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export async function stitchAudioSegments(filePaths: string[]): Promise<{ fileName: string, duration: number }> {
  return new Promise(async (resolve, reject) => {
    if (filePaths.length === 0) {
      return reject(new Error("No audio segments to stitch."));
    }

    const outputFileName = `podcast-${uuidv4()}.mp3`;
    const publicDir = path.join(process.cwd(), 'public', 'podcasts');
    
    // Ensure public/podcasts exists
    try {
        await fs.access(publicDir);
    } catch {
        await fs.mkdir(publicDir, { recursive: true });
    }

    const outputPath = path.join(publicDir, outputFileName);
    const command = ffmpeg();

    filePaths.forEach(file => {
      command.input(file);
    });

    command
      .on('error', (err) => {
        console.error('An error occurred during stitching:', err.message);
        reject(err);
      })
      .on('end', async () => {
        console.log('Audio stitching finished successfully.');
        
        // Get duration
        ffmpeg.ffprobe(outputPath, (err, metadata) => {
            if (err) {
                console.warn("Could not determine duration:", err);
                resolve({ fileName: `/podcasts/${outputFileName}`, duration: 0 });
            } else {
                resolve({ 
                    fileName: `/podcasts/${outputFileName}`, 
                    duration: metadata.format.duration || 0 
                });
            }
        });
        
        // Cleanup temp files - asynchronously to not block
        filePaths.forEach(async (file) => {
            try {
                await fs.unlink(file);
            } catch (e) {
                console.warn(`Failed to delete temp file ${file}`, e);
            }
        });
      })
      .mergeToFile(outputPath, path.join(process.cwd(), 'tmp')); // 2nd arg is temp dir for ffmpeg
  });
}
