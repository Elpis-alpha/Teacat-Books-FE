"use client";
import { useEffect, useMemo, useRef } from "react";

interface BigImageProps {
  src: string;
  children: React.ReactNode;
  blackOpacity: number;
}
const BigImage = (props: BigImageProps) => {
  const { src, blackOpacity, children } = props;

  const imageRef = useRef<HTMLImageElement>(null);
  const imageURL = useMemo(() => {
    if (src.startsWith("https://res.cloudinary.com/")) {
      return src.replace("/upload/", `/upload/c_scale,w_50/`);
    }
    return src;
  }, [src]);

  useEffect(() => {
    const handleIamgeReload = (image: HTMLImageElement) => {
      const newImageSrc = (() => {
        if (image.src.includes("/upload/c_scale,w_50/")) {
          return image.src.replace(
            "/upload/c_scale,w_50/",
            `/upload/c_scale,w_1920/`
          );
        } else {
          return null;
        }
      })();
      if (!newImageSrc) return;

      const bigImage = new Image();
      bigImage.src = newImageSrc;
      bigImage.className = image.className;
      bigImage.alt = image.alt;

      bigImage.onload = () => {
        image.replaceWith(bigImage);
      };
    };

    if (imageRef.current) {
      handleIamgeReload(imageRef.current);
    }
  }, []);

  return (
    <div className="min-h-[100vh] w-full flex items-center justify-center flex-col py-36">
      {children}
      <img
        ref={imageRef}
        src={imageURL}
        alt="hero"
        className="absolute top-0 left-0 z-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-black z-10"
        style={{ opacity: blackOpacity * 0.01 }}
      ></div>
    </div>
  );
};
export default BigImage;
