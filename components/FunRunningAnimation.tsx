import { Text } from "ink";
import { useEffect, useState } from "react";

export default function FunRunningAnimation({
  maxDots,
  speed,
  color,
}: {
  maxDots?: number;
  speed?: number;
  color?: Parameters<typeof Text>[0]["color"];
}) {
  if (!maxDots || maxDots < 0) {
    maxDots = 10;
  }

  const [dots, setDots] = useState(0);

  useEffect(() => {
    setDots(0);

    const interval = setInterval(() => {
      setDots((dots) => {
        dots = dots + 1;
        if (dots > maxDots) {
          dots = -maxDots;
        }

        return dots;
      });
    }, speed ?? 100);

    return () => clearInterval(interval);
  }, [maxDots, speed]);

  const dotsRender = "-".repeat(Math.abs(dots));
  const spaceRender = dots < 0 ? " ".repeat(dots + maxDots) : "";

  return (
    <Text color={color}>
      {dotsRender}
      {spaceRender}
      {spaceRender}
      {dotsRender}
    </Text>
  );
}
