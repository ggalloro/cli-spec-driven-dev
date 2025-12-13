import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export async function stitchAudio(filePaths: string[], outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    filePaths.forEach((file) => {
      command.input(file);
    });

    command
      .on('error', (err) => {
        console.error('An error occurred during audio stitching:', err);
        reject(err);
      })
      .on('end', () => {
        console.log('Audio stitching finished successfully');
        resolve();
      })
      .mergeToFile(outputPath, path.dirname(outputPath));
  });
}
