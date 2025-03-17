"use client";
import { useEffect, useRef, useState } from "react";
import SafeImage from "./SafeImage";

type LazyImageProps = {
  lowSizeSrc: string;
  highSizeSrc: string;
  alt: string;
  className: string;
};

const LazyImage = (props: LazyImageProps) => {
  const { alt, className, highSizeSrc, lowSizeSrc } = props;
  const imageRef = useRef<HTMLImageElement>(null);

  const [ready, setReady] = useState(false);
  const hasChanged = useRef(false);

  useEffect(() => {
    const changeImage = (image: HTMLImageElement) => {
      const highSizeImage = new Image();
      highSizeImage.src = highSizeSrc;
      highSizeImage.className = image.className;
      highSizeImage.alt = image.alt;

      highSizeImage.onload = () => {
        image.replaceWith(highSizeImage);
      };
    };

    if (imageRef.current && ready && !hasChanged.current) {
      hasChanged.current = true;
      changeImage(imageRef.current);
    }
  }, [highSizeSrc, ready]);

  return (
    <SafeImage
      setReady={setReady}
      src={lowSizeSrc}
      alt={alt}
      className={className}
      ref={imageRef}
    />
  );
};
export default LazyImage;
