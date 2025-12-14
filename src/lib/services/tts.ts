import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import fs from "fs";
import util from "util";
import path from "path";

// Initialize TTS Client
const client = new TextToSpeechClient();

export async function synthesizeSpeech(text: string, outputFilename: string): Promise<string> {
  // Construct the request
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "en-US", name: "en-US-Chirp-HD-F" }, // Using Chirp model as requested
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" as const },
  };

  try {
    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    const outputPath = path.join(process.cwd(), 'public', 'podcasts', outputFilename);
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    await writeFile(outputPath, response.audioContent as string | Uint8Array, 'binary');
    console.log(`Audio content written to file: ${outputPath}`);
    return `/podcasts/${outputFilename}`;
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    throw error;
  }
}
