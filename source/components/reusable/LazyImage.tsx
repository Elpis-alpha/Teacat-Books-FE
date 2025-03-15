"use client";
import { useEffect, useRef } from "react";

type LazyImageProps = {
  lowSizeSrc: string;
  highSizeSrc: string;
  alt: string;
  className: string;
};

const LazyImage = (props: LazyImageProps) => {
  const { alt, className, highSizeSrc, lowSizeSrc } = props;
  const imageRef = useRef<HTMLImageElement>(null);

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

    if (imageRef.current) changeImage(imageRef.current);
  }, [highSizeSrc]);

  return (
    <img src={lowSizeSrc} alt={alt} className={className} ref={imageRef} />
  );
};
export default LazyImage;
