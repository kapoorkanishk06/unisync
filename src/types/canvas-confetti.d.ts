declare module 'canvas-confetti' {
  export interface Options {
    particleCount?: number;
    spread?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    startVelocity?: number;
    gravity?: number;
    colors?: string[];
    ticks?: number;
    shapes?: ('circle' | 'square')[];
  }

  export default function confetti(options?: Options): void;
}
