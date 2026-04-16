import React from 'react';
import { cn } from '../lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className }) => {
  return (
    <span 
      className={cn("glitch-text inline-block font-sans font-extrabold", className)} 
      data-text={text}
    >
      {text}
    </span>
  );
};
