import ffmpeg from 'fluent-ffmpeg';

export async function concatAudioSegments(filePaths: string[], outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (filePaths.length === 0) {
      reject(new Error('No files to concatenate'));
      return;
    }

    const command = ffmpeg();

    filePaths.forEach(file => {
      command.input(file);
    });

    command
      .on('error', (err) => {
        console.error('An error occurred during audio concatenation: ' + err.message);
        reject(err);
      })
      .on('end', () => {
        resolve();
      })
      .mergeToFile(outputPath, '/tmp'); // /tmp is temp dir for ffmpeg
  });
}
