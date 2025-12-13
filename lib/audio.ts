import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

export async function mergeAudioSegments(segmentPaths: string[], outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (segmentPaths.length === 0) {
      return reject(new Error("No audio segments to merge."));
    }

    const command = ffmpeg();

    segmentPaths.forEach(segment => {
      command.input(segment);
    });

    command
      .on('error', (err) => {
        console.error('An error occurred during audio merging:', err.message);
        reject(err);
      })
      .on('end', () => {
        console.log('Audio merging finished successfully.');
        // Clean up temp files
        segmentPaths.forEach(p => {
            try {
                if(fs.existsSync(p)) fs.unlinkSync(p);
            } catch(e) { console.error("Failed to delete temp file", p)}
        });
        resolve();
      })
      .mergeToFile(outputPath, path.dirname(outputPath)); // temp path for ffmpeg, not strictly needed as 2nd arg usually
  });
}
