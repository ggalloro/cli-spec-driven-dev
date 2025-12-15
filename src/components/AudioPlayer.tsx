import React from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  if (!src) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
      {title && <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>}
      <audio controls className="w-full focus:outline-none">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
