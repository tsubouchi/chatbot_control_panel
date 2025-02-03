import { useState, useEffect } from "react";

type Props = {
  text: string;
  speed?: number;
};

export default function Typewriter({ text, speed = 50 }: Props) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((current) => current + text[currentIndex]);
        setCurrentIndex((current) => current + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
  }, [text]);

  return <span className="whitespace-pre-wrap">{displayText}</span>;
}
