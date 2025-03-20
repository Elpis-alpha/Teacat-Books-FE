"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import SafeImage from "./SafeImage";

interface BigImageProps {
  src: string;
  mobileSrc?: string;
  children: React.ReactNode;
  blackOpacity: number;
}
const BigImage = (props: BigImageProps) => {
  const { src, blackOpacity, children, mobileSrc } = props;

  const imageRef = useRef<HTMLImageElement>(null);
  const imageURL = useMemo(() => {
    if (src.startsWith("https://res.cloudinary.com/")) {
      return src.replace("/upload/", `/upload/c_scale,w_50/`);
    }
    return src;
  }, [src]);

  const [ready, setReady] = useState(false);
  const hasChanged = useRef(false);

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

    if (imageRef.current && ready && !hasChanged.current) {
      hasChanged.current = true;
      handleIamgeReload(imageRef.current);
    }
  }, [ready]);

  const mobileImageRef = useRef<HTMLImageElement>(null);
  const mobileImageURL = useMemo(() => {
    if (!mobileSrc) return null;
    if (mobileSrc.startsWith("https://res.cloudinary.com/")) {
      return mobileSrc.replace("/upload/", `/upload/c_scale,w_50/`);
    }
    return mobileSrc;
  }, [mobileSrc]);

  const [readyMobile, setReadyMobile] = useState(false);
  const hasChangedMobile = useRef(false);

  useEffect(() => {
    const handleIamgeReload = (image: HTMLImageElement) => {
      const newImageSrc = (() => {
        if (image.src.includes("/upload/c_scale,w_50/")) {
          return image.src.replace(
            "/upload/c_scale,w_50/",
            `/upload/c_scale,w_900/`
          );
        } else {
          return null;
        }
      })();
      if (!newImageSrc) return;

      const mobileBigImage = new Image();
      mobileBigImage.src = newImageSrc;
      mobileBigImage.className = image.className;
      mobileBigImage.alt = image.alt;

      mobileBigImage.onload = () => {
        image.replaceWith(mobileBigImage);
      };
    };

    if (mobileImageRef.current && readyMobile && !hasChangedMobile.current) {
      hasChangedMobile.current = true;
      handleIamgeReload(mobileImageRef.current);
    }
  }, [readyMobile]);

  return (
    <div className="min-h-[100vh] w-full flex items-center justify-center flex-col py-36">
      {children}
      <SafeImage
        setReady={setReady}
        ref={imageRef}
        src={imageURL}
        alt="hero"
        className={
          "absolute top-0 left-0 z-0 w-full h-full object-cover " +
          (mobileImageURL ? "hidden slg:block" : "block")
        }
      />
      {mobileImageURL && (
        <SafeImage
          setReady={setReadyMobile}
          ref={mobileImageRef}
          src={mobileImageURL}
          alt="hero mobile"
          className="absolute top-0 left-0 z-0 w-full h-full object-cover block slg:hidden"
        />
      )}
      <div
        className="absolute inset-0 bg-black z-10"
        style={{ opacity: blackOpacity * 0.01 }}
      ></div>
    </div>
  );
};
export default BigImage;
