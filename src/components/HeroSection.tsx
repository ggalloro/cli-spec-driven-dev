import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden mb-8 shadow-xl">
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Robot agent reading news in a TV studio"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-gray-900/90 to-transparent">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Your Personal AI News Anchor
        </h1>
        <p className="text-xl text-gray-200 max-w-2xl drop-shadow-md">
          Turn your favorite RSS feeds into a daily personalized podcast.
        </p>
      </div>
    </section>
  );
}
