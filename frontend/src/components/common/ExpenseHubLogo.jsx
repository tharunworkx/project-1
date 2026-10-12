import React, { useEffect, useRef, useState } from 'react';
import logoSrc from '@/assets/logo.png';

export const ExpenseHubLogo = ({ className = "h-9 w-auto", alt = "ExpenseHub Logo" }) => {
  const [transparentSrc, setTransparentSrc] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Convert black background to transparent alpha
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;

        if (brightness < 35) {
          data[i + 3] = 0; // Fully transparent
        } else {
          // Keep white with smooth alpha anti-aliasing
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = Math.min(255, Math.max(0, (brightness - 25) * 1.2));
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setTransparentSrc(canvas.toDataURL('image/png'));
    };
  }, []);

  return (
    <img
      src={transparentSrc || logoSrc}
      alt={alt}
      className={`object-contain select-none pointer-events-none mix-blend-screen ${className}`}
      draggable={false}
    />
  );
};

export default ExpenseHubLogo;
