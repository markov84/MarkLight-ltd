import React, { useState } from 'react';

const GDPRBanner = () => {
  const [accepted, setAccepted] = useState(() => {
    return localStorage.getItem('gdprAccepted') === 'true';
  });

  const handleAccept = () => {
    localStorage.setItem('gdprAccepted', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col md:flex-row items-center justify-between z-50">
      <span className="mb-2 md:mb-0">Този сайт използва бисквитки и обработва лични данни съгласно <a href="/privacy" className="underline">Политиката за защита на личните данни</a>.</span>
      <button onClick={handleAccept} className="bg-blue-600 px-4 py-2 rounded ml-4">Съгласен съм</button>
    </div>
  );
};

export default GDPRBanner;
