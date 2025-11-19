'use client';

import { InlineMath } from 'react-katex';

interface MathFormulaProps {
  children: string;
  className?: string;
}

export default function MathFormula({ children, className = '' }: MathFormulaProps) {
  try {
    return (
      <span className={className}>
        <InlineMath math={children} />
      </span>
    );
  } catch {
    // Fallback to plain text if LaTeX parsing fails
    return <span className={`font-mono ${className}`}>{children}</span>;
  }
}
