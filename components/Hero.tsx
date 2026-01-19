import Image from 'next/image';

export default function Hero() {
  return (
    <div className="w-full relative h-64 md:h-96 overflow-hidden rounded-xl mb-8">
      <Image
        src="/hero.png"
        alt="Robot agent reading news in TV studio"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
        <div className="p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Podcast Generator</h1>
          <p className="text-lg opacity-90">Your personal AI news anchor</p>
        </div>
      </div>
    </div>
  );
}
