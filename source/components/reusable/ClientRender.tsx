"use client";
import { useEffect, useState } from "react";

const ClientRender = ({
  children,
  initial = <></>,
}: {
  children: React.ReactNode;
  initial?: React.ReactNode;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return initial;
  else return children;
};
export default ClientRender;
