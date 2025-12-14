import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export async function concatAudioSegments(segments: string[], outputFilename: string): Promise<string> {
    const publicDir = path.join(process.cwd(), 'public');
    const outputPath = path.join(publicDir, 'podcasts', outputFilename);
    
    // Ensure output directory exists
    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    return new Promise((resolve, reject) => {
        const command = ffmpeg();

        segments.forEach(segment => {
             // If segment path starts with /, assume it's relative to public/
             const fullPath = segment.startsWith('/') ? path.join(publicDir, segment) : segment;
             command.input(fullPath);
        });

        command
            .on('error', (err) => {
                console.error('An error occurred during audio concatenation: ' + err.message);
                reject(err);
            })
            .on('end', () => {
                console.log('Merging finished!');
                resolve(`/podcasts/${outputFilename}`);
            })
            .mergeToFile(outputPath, path.join(process.cwd(), '.gemini/tmp'));
    });
}
