import { useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

export function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen w-full relative overflow-hidden">
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Primary shader — cobre/dorado sobre negro */}
      {isVisible && (
        <>
          <MeshGradient
            className="absolute inset-0 w-full h-full"
            colors={["#0D0F12", "#B8864E", "#1A1410", "#8B5E3C", "#0D0F12"]}
            speed={0.25}
            backgroundColor="#0D0F12"
          />
          {/* Overlay shader más sutil para profundidad */}
          <MeshGradient
            className="absolute inset-0 w-full h-full opacity-40"
            colors={["#0D0F12", "#D4A574", "#B8864E", "#0D0F12"]}
            speed={0.15}
            backgroundColor="transparent"
          />
        </>
      )}

      {/* Overlay oscuro para que el texto sea legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

      {children}
    </div>
  );
}
