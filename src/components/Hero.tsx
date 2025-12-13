import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-lg">
      <Image
        src="/hero.png"
        alt="AI News Anchor"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">AI Podcast Generator</h1>
          <p className="text-gray-200 text-lg">Your personalized news feed, summarized and spoken by AI.</p>
        </div>
      </div>
    </div>
  );
}
