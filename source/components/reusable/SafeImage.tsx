"use client";
import { useEffect, useState } from "react";

type SafeImageProps = {
  src: string;
  alt: string;
  className?: string;
  ref?: React.Ref<HTMLImageElement>;
  setReady?: React.Dispatch<React.SetStateAction<boolean>>;
};

const errorSrc = "/icons/error.svg";
const blankSrc = "/icons/blank.svg";

const SafeImage = ({ src, alt, className, ref, setReady }: SafeImageProps) => {
  const [error, setError] = useState(false);
  const [ready, _setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (setReady) setReady(true);
      _setReady(true);
      setError(false);
    };
    img.onerror = (err) => {
      console.error("Error loading image", src, err);
      _setReady(true);
      if (setReady) setReady(true);
      setError(true);
    };
  }, [src, setReady]);

  if (!ready) return <img src={blankSrc} alt={alt} className={className} />;
  return (
    <img
      src={error ? errorSrc : src}
      alt={alt}
      className={className}
      ref={ref}
    />
  );
};

export default SafeImage;
