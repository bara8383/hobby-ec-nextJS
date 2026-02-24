'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type SlideImage = {
  src: string;
  alt: string;
};

type HeroBackgroundSlideshowProps = {
  images: SlideImage[];
  intervalMs?: number;
  fadeMs?: number;
};

export function HeroBackgroundSlideshow({ images, intervalMs = 10000, fadeMs = 1000 }: HeroBackgroundSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  const slideCount = images.length;

  useEffect(() => {
    if (prefersReducedMotion) {
      setIndex(0);
      return;
    }

    if (slideCount <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slideCount);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [intervalMs, prefersReducedMotion, slideCount]);

  const transitionStyle = useMemo(
    () => ({
      transitionDuration: `${fadeMs}ms`
    }),
    [fadeMs]
  );

  if (slideCount === 0) {
    return null;
  }

  return (
    <div className="hero-slideshow" aria-hidden="true">
      {images.map((image, slideIndex) => (
        <div
          key={image.src}
          className="hero-slide"
          style={{
            ...transitionStyle,
            opacity: slideIndex === index ? 1 : 0
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            quality={80}
            className="hero-slide-image"
          />
        </div>
      ))}
    </div>
  );
}
