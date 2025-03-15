import { useEffect } from "react";

const ModalOverflow = () => {
  useEffect(() => {
    const body = document.body;
    if (!body) return;

    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = "auto";
    };
  }, []);

  return <></>;
};
export default ModalOverflow;
