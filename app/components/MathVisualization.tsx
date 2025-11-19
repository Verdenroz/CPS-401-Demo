'use client';

import MathFormula from './MathFormula';

interface Step {
  label: string;
  formula: string;
  explanation: string;
}

interface MathVisualizationProps {
  title: string;
  steps: Step[];
  currentStep: number;
  isVisible: boolean;
}

export default function MathVisualization({
  title,
  steps,
  currentStep,
  isVisible,
}: MathVisualizationProps) {
  if (!isVisible || steps.length === 0) return null;

  return (
    <div className="border border-gray-600 rounded-lg p-4 bg-gray-850 mt-4">
      <h4 className="text-md font-semibold text-purple-400 mb-3">{title}</h4>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-3 rounded transition-all duration-300 ${
              index < currentStep
                ? 'bg-gray-700 opacity-100'
                : index === currentStep
                ? 'bg-gray-700 border border-purple-500 opacity-100'
                : 'bg-gray-800 opacity-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < currentStep
                    ? 'bg-green-600 text-white'
                    : index === currentStep
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-600 text-gray-400'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-300">{step.label}</div>
                <div className="text-yellow-400 mt-1">
                  <MathFormula>{step.formula}</MathFormula>
                </div>
                <div className="text-xs text-gray-400 mt-1">{step.explanation}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Key Generation Steps - with LaTeX formatting
export const KEY_GENERATION_STEPS: Step[] = [
  {
    label: 'Generate random secret key',
    formula: 'sk \\leftarrow \\text{random element in } \\mathbb{F}_r',
    explanation: '32 bytes of cryptographic randomness mapped to scalar field Fr (order ~2²⁵⁵)',
  },
  {
    label: 'Compute public key via scalar multiplication',
    formula: 'PK = [sk] \\cdot G_1',
    explanation: 'Multiply generator point G₁ by secret key (elliptic curve scalar multiplication)',
  },
  {
    label: 'Serialize public key',
    formula: 'PK \\rightarrow 48 \\text{ bytes (compressed } G_1 \\text{ point)}',
    explanation: 'Store x-coordinate + 1 bit for y-coordinate sign',
  },
];

// Signing Steps - with LaTeX formatting
export const SIGNING_STEPS: Step[] = [
  {
    label: 'Hash message to curve point',
    formula: 'H(M) \\rightarrow \\text{Point on } G_2',
    explanation: 'hash-to-curve algorithm maps "Block #12345" to elliptic curve point on G₂',
  },
  {
    label: 'Scalar multiply by secret key',
    formula: '\\sigma = [sk] \\cdot H(M)',
    explanation: 'Same operation as key generation, but on the hashed message point',
  },
  {
    label: 'Serialize signature',
    formula: '\\sigma \\rightarrow 96 \\text{ bytes (compressed } G_2 \\text{ point)}',
    explanation: 'Signature is a point on G₂ curve (2x size of G₁ due to extension field)',
  },
];

// Aggregation Steps - with LaTeX formatting
export const AGGREGATION_STEPS: Step[] = [
  {
    label: 'Each validator has signed the message',
    formula: '\\sigma_1 = [sk_1]H(M), \\quad \\sigma_2 = [sk_2]H(M), \\quad \\sigma_3 = [sk_3]H(M)',
    explanation: 'Each signature is a point on G₂, all signing the same message',
  },
  {
    label: 'Aggregate via elliptic curve point addition',
    formula: '\\sigma_{agg} = \\sigma_1 + \\sigma_2 + \\sigma_3',
    explanation: 'Uses EC point addition formula (not simple field addition)',
  },
  {
    label: 'Result is single curve point',
    formula: '\\sigma_{agg} \\rightarrow 96 \\text{ bytes}',
    explanation: 'Same size as one signature regardless of how many were aggregated!',
  },
];

// Individual Verification Steps - with LaTeX formatting
export const INDIVIDUAL_VERIFICATION_STEPS: Step[] = [
  {
    label: 'Hash message to curve point',
    formula: 'H(M) \\rightarrow \\text{Point on } G_2',
    explanation: 'Same hash function produces same curve point for verification',
  },
  {
    label: 'Compute pairing of signature with generator',
    formula: 'e(G_1, \\sigma_i)',
    explanation: 'Pairing maps (G₁, G₂) → G_T (target group)',
  },
  {
    label: 'Compute pairing of public key with message hash',
    formula: 'e(PK_i, H(M))',
    explanation: 'Second pairing to compare against',
  },
  {
    label: 'Check pairing equality',
    formula: 'e(G_1, \\sigma_i) \\stackrel{?}{=} e(PK_i, H(M))',
    explanation: 'Bilinearity ensures this holds if σᵢ = [skᵢ]H(M) and PKᵢ = [skᵢ]G₁',
  },
  {
    label: 'Repeat for each validator',
    formula: '\\text{Verify } \\sigma_1, \\sigma_2, \\sigma_3 \\text{ separately}',
    explanation: 'Each verification requires expensive pairing computation (~2ms each)',
  },
];

// Aggregated Verification Steps - with LaTeX formatting
export const VERIFICATION_STEPS: Step[] = [
  {
    label: 'Hash message to curve point',
    formula: 'H(M) \\rightarrow \\text{Point on } G_2',
    explanation: 'Same hash-to-curve as signing',
  },
  {
    label: 'Aggregate all public keys',
    formula: 'PK_{agg} = PK_1 + PK_2 + PK_3',
    explanation: 'Elliptic curve point addition on G₁',
  },
  {
    label: 'Compute pairing batch with negation trick',
    formula: 'e(-PK_{agg}, H(M)) \\cdot e(G_1, \\sigma_{agg})',
    explanation: 'Library uses negation for efficiency: checks if product = 1',
  },
  {
    label: 'Check if result equals identity',
    formula: '\\text{Result} \\stackrel{?}{=} 1 \\in G_T',
    explanation: 'Equivalent to e(G₁, σ_agg) = e(PK_agg, H(M))',
  },
];

// Bilinearity Explanation - with LaTeX formatting
export const BILINEARITY_EXPLANATION: Step[] = [
  {
    label: 'Start with aggregated signature',
    formula: '\\sigma_{agg} = [sk_1]H(M) + [sk_2]H(M) + [sk_3]H(M)',
    explanation: 'Sum of all individual signatures',
  },
  {
    label: 'Factor out H(M) using EC properties',
    formula: '\\sigma_{agg} = [sk_1 + sk_2 + sk_3] \\cdot H(M)',
    explanation: 'Scalar multiplication distributes: [a]P + [b]P = [a+b]P',
  },
  {
    label: 'Apply pairing to aggregated signature',
    formula: 'e(G_1, \\sigma_{agg}) = e(G_1, [sk_{sum}]H(M))',
    explanation: 'Left side of verification equation',
  },
  {
    label: 'Use bilinearity property',
    formula: 'e(G_1, [sk_{sum}]H(M)) = e([sk_{sum}]G_1, H(M))',
    explanation: 'Key insight: e(P, [a]Q) = e([a]P, Q)',
  },
  {
    label: 'Recognize aggregated public key',
    formula: 'e([sk_{sum}]G_1, H(M)) = e(PK_{agg}, H(M))',
    explanation: 'Since PK_agg = [sk₁]G₁ + [sk₂]G₁ + [sk₃]G₁ = [sk_sum]G₁',
  },
];
