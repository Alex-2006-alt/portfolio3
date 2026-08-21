"use client";

import { useEffect } from "react";

export function AutoScroller({ threshold = 80, speed = 8 }: { threshold?: number; speed?: number }) {
  useEffect(() => {
    let scrollAnimationFrame: number;
    let isMouseNearTop = false;
    let isMouseNearBottom = false;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      
      // Check if mouse is near top or bottom edges
      isMouseNearTop = e.clientY < threshold;
      isMouseNearBottom = e.clientY > windowHeight - threshold;
    };

    const handleMouseLeave = () => {
      // Stop scrolling if the mouse leaves the browser window
      isMouseNearTop = false;
      isMouseNearBottom = false;
    };

    const scrollLoop = () => {
      if (isMouseNearTop) {
        window.scrollBy({ top: -speed, behavior: "auto" });
      } else if (isMouseNearBottom) {
        window.scrollBy({ top: speed, behavior: "auto" });
      }
      scrollAnimationFrame = requestAnimationFrame(scrollLoop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    scrollAnimationFrame = requestAnimationFrame(scrollLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(scrollAnimationFrame);
    };
  }, [threshold, speed]);

  return null; // This component doesn't render anything visually
}
