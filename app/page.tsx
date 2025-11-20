'use client';

import { useState, useEffect } from 'react';
import ValidatorCard from './components/ValidatorCard';
import AggregationPanel from './components/AggregationPanel';
import VerificationPanel from './components/VerificationPanel';
import MathVisualization, {
  KEY_GENERATION_STEPS,
  SIGNING_STEPS,
  AGGREGATION_STEPS,
  VERIFICATION_STEPS,
  INDIVIDUAL_VERIFICATION_STEPS,
  BILINEARITY_EXPLANATION,
} from './components/MathVisualization';
import {
  generateKeyPair,
  signMessage,
  verifySignature,
  aggregateSignatures,
  verifyAggregatedSignature,
  verifyWithPairings,
  verifyAggregatedWithPairings,
  measureTime,
  truncateHex,
  KeyPair,
  PairingResult,
} from './lib/bls';

interface Validator {
  id: number;
  keyPair: KeyPair | null;
  signature: Uint8Array | null;
}

interface VerificationResult {
  validatorId: number;
  success: boolean;
  timeMs: number;
}

export default function Home() {
  const [message, setMessage] = useState('Block #12345');
  const [validators, setValidators] = useState<Validator[]>([
    { id: 1, keyPair: null, signature: null },
    { id: 2, keyPair: null, signature: null },
    { id: 3, keyPair: null, signature: null },
  ]);
  const [aggregatedSignature, setAggregatedSignature] = useState<Uint8Array | null>(null);
  const [individualResults, setIndividualResults] = useState<VerificationResult[]>([]);
  const [aggregatedResult, setAggregatedResult] = useState<{ success: boolean; timeMs: number } | null>(null);
  const [individualPairings, setIndividualPairings] = useState<{ validatorId: number; pairing: PairingResult }[]>([]);
  const [aggregatedPairing, setAggregatedPairing] = useState<PairingResult | null>(null);

  // Math visualization state
  const [showKeyGenSteps, setShowKeyGenSteps] = useState(false);
  const [showSigningSteps, setShowSigningSteps] = useState(false);
  const [showAggregationSteps, setShowAggregationSteps] = useState(false);
  const [showVerificationSteps, setShowVerificationSteps] = useState(false);
  const [showIndividualSteps, setShowIndividualSteps] = useState(false);
  const [showBilinearity, setShowBilinearity] = useState(false);
  const [keyGenStep, setKeyGenStep] = useState(0);
  const [signingStep, setSigningStep] = useState(0);
  const [aggregationStep, setAggregationStep] = useState(0);
  const [verificationStep, setVerificationStep] = useState(0);
  const [individualStep, setIndividualStep] = useState(0);
  const [bilinearityStep, setBilinearityStep] = useState(0);

  // Animate key generation steps
  useEffect(() => {
    if (showKeyGenSteps && keyGenStep < KEY_GENERATION_STEPS.length) {
      const timer = setTimeout(() => {
        setKeyGenStep((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showKeyGenSteps, keyGenStep]);

  // Animate signing steps
  useEffect(() => {
    if (showSigningSteps && signingStep < SIGNING_STEPS.length) {
      const timer = setTimeout(() => {
        setSigningStep((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showSigningSteps, signingStep]);

  // Animate aggregation steps
  useEffect(() => {
    if (showAggregationSteps && aggregationStep < AGGREGATION_STEPS.length) {
      const timer = setTimeout(() => {
        setAggregationStep((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showAggregationSteps, aggregationStep]);

  // Animate verification steps
  useEffect(() => {
    if (showVerificationSteps && verificationStep < VERIFICATION_STEPS.length) {
      const timer = setTimeout(() => {
        setVerificationStep((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showVerificationSteps, verificationStep]);

  // Animate individual verification steps
  useEffect(() => {
    if (showIndividualSteps && individualStep < INDIVIDUAL_VERIFICATION_STEPS.length) {
      const timer = setTimeout(() => {
        setIndividualStep((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showIndividualSteps, individualStep]);

  // Animate bilinearity steps
  useEffect(() => {
    if (showBilinearity && bilinearityStep < BILINEARITY_EXPLANATION.length) {
      const timer = setTimeout(() => {
        setBilinearityStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showBilinearity, bilinearityStep]);

  const handleGenerateKey = (validatorId: number) => {
    setValidators((prev) =>
      prev.map((v) =>
        v.id === validatorId
          ? { ...v, keyPair: generateKeyPair(), signature: null }
          : v
      )
    );
    // Reset aggregation when keys change
    setAggregatedSignature(null);
    setIndividualResults([]);
    setAggregatedResult(null);
    setIndividualPairings([]);
    setAggregatedPairing(null);
    // Show key generation steps
    setShowKeyGenSteps(true);
    setKeyGenStep(0);
    setShowSigningSteps(false);
    setShowAggregationSteps(false);
    setShowVerificationSteps(false);
    setShowIndividualSteps(false);
    setShowBilinearity(false);
  };

  const handleSign = (validatorId: number) => {
    setValidators((prev) =>
      prev.map((v) => {
        if (v.id === validatorId && v.keyPair) {
          const signature = signMessage(v.keyPair.privateKey, message);
          return { ...v, signature };
        }
        return v;
      })
    );
    // Reset aggregation when signatures change
    setAggregatedSignature(null);
    setIndividualResults([]);
    setAggregatedResult(null);
    setIndividualPairings([]);
    setAggregatedPairing(null);
    // Show signing steps
    setShowSigningSteps(true);
    setSigningStep(0);
    setShowKeyGenSteps(false);
    setShowAggregationSteps(false);
    setShowVerificationSteps(false);
    setShowIndividualSteps(false);
    setShowBilinearity(false);
  };

  const handleAggregate = () => {
    const signatures = validators
      .filter((v) => v.signature !== null)
      .map((v) => v.signature!);

    if (signatures.length > 0) {
      const aggregated = aggregateSignatures(signatures);
      setAggregatedSignature(aggregated);
      setIndividualResults([]);
      setAggregatedResult(null);
      setIndividualPairings([]);
      setAggregatedPairing(null);
      // Show aggregation steps
      setShowAggregationSteps(true);
      setAggregationStep(0);
      setShowKeyGenSteps(false);
      setShowSigningSteps(false);
      setShowVerificationSteps(false);
      setShowIndividualSteps(false);
      setShowBilinearity(false);
    }
  };

  const handleVerifyIndividual = () => {
    const results: VerificationResult[] = [];
    const pairings: { validatorId: number; pairing: PairingResult }[] = [];

    validators.forEach((v) => {
      if (v.keyPair && v.signature) {
        const { result, timeMs } = measureTime(() =>
          verifySignature(v.keyPair!.publicKey, message, v.signature!)
        );
        results.push({
          validatorId: v.id,
          success: result,
          timeMs,
        });
        // Compute pairing values for display
        const pairingResult = verifyWithPairings(v.keyPair!.publicKey, message, v.signature!);
        pairings.push({ validatorId: v.id, pairing: pairingResult });
      }
    });

    setIndividualResults(results);
    setIndividualPairings(pairings);
    // Show individual verification steps
    setShowIndividualSteps(true);
    setIndividualStep(0);
    setShowKeyGenSteps(false);
    setShowSigningSteps(false);
    setShowAggregationSteps(false);
    setShowVerificationSteps(false);
    setShowBilinearity(false);
  };

  const handleVerifyAggregated = () => {
    if (!aggregatedSignature) return;

    const publicKeys = validators
      .filter((v) => v.keyPair !== null && v.signature !== null)
      .map((v) => v.keyPair!.publicKey);

    const { result, timeMs } = measureTime(() =>
      verifyAggregatedSignature(publicKeys, message, aggregatedSignature)
    );

    // Compute pairing values for display
    const pairingResult = verifyAggregatedWithPairings(publicKeys, message, aggregatedSignature);

    setAggregatedResult({ success: result, timeMs });
    setAggregatedPairing(pairingResult);
    // Show verification steps
    setShowVerificationSteps(true);
    setVerificationStep(0);
    setShowKeyGenSteps(false);
    setShowSigningSteps(false);
    setShowAggregationSteps(false);
    setShowIndividualSteps(false);
    setShowBilinearity(false);
  };

  const toggleBilinearity = () => {
    setShowBilinearity(!showBilinearity);
    if (!showBilinearity) {
      setBilinearityStep(0);
    }
  };

  const canAggregate = validators.filter((v) => v.signature !== null).length >= 2;
  const canVerifyIndividual = validators.some((v) => v.keyPair && v.signature);
  const canVerifyAggregated = aggregatedSignature !== null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">BLS Signature Aggregation Demo</h1>
          <p className="text-gray-400">
            Demonstrating pairing-based cryptography and the power of bilinear maps
          </p>
        </div>

        {/* Message Input */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <label className="text-gray-400 block mb-2">Message to sign:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              // Reset signatures when message changes
              setValidators((prev) =>
                prev.map((v) => ({ ...v, signature: null }))
              );
              setAggregatedSignature(null);
              setIndividualResults([]);
              setAggregatedResult(null);
              setIndividualPairings([]);
              setAggregatedPairing(null);
              setShowKeyGenSteps(false);
              setShowSigningSteps(false);
              setShowAggregationSteps(false);
              setShowVerificationSteps(false);
              setShowIndividualSteps(false);
              setShowBilinearity(false);
            }}
            className="w-full bg-gray-900 text-white font-mono px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder="Enter message to sign"
          />
        </div>

        {/* Validator Cards */}
        <div className="grid gap-4 mb-6">
          {validators.map((validator) => (
            <ValidatorCard
              key={validator.id}
              id={validator.id}
              publicKey={validator.keyPair?.publicKey ?? null}
              signature={validator.signature}
              onGenerateKey={() => handleGenerateKey(validator.id)}
              onSign={() => handleSign(validator.id)}
              canSign={validator.keyPair !== null}
            />
          ))}
        </div>

        {/* Key Generation Visualization */}
        <MathVisualization
          title="How Key Generation Works"
          steps={KEY_GENERATION_STEPS}
          currentStep={keyGenStep}
          isVisible={showKeyGenSteps}
        />

        {/* Signing Visualization */}
        <MathVisualization
          title="How Signing Works"
          steps={SIGNING_STEPS}
          currentStep={signingStep}
          isVisible={showSigningSteps}
        />

        {/* Aggregation Panel */}
        <div className="mb-6">
          <AggregationPanel
            signatures={validators.map((v) => v.signature)}
            aggregatedSignature={aggregatedSignature}
            onAggregate={handleAggregate}
            canAggregate={canAggregate}
          />

          {/* Aggregation Math Visualization */}
          <MathVisualization
            title="How Signature Aggregation Works"
            steps={AGGREGATION_STEPS}
            currentStep={aggregationStep}
            isVisible={showAggregationSteps}
          />
        </div>

        {/* Verification Panel */}
        <div className="mb-6">
          <VerificationPanel
            individualResults={individualResults}
            aggregatedResult={aggregatedResult}
            onVerifyIndividual={handleVerifyIndividual}
            onVerifyAggregated={handleVerifyAggregated}
            canVerifyIndividual={canVerifyIndividual}
            canVerifyAggregated={canVerifyAggregated}
          />

          {/* Individual Verification Math Visualization */}
          <MathVisualization
            title="How Individual Verification Works"
            steps={INDIVIDUAL_VERIFICATION_STEPS}
            currentStep={individualStep}
            isVisible={showIndividualSteps}
          />

          {/* Individual Pairing Values */}
          {individualPairings.length > 0 && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-orange-600">
              <h4 className="text-md font-semibold text-orange-400 mb-3">Pairing Values</h4>
              {individualPairings.map(({ validatorId, pairing }) => (
                <div key={validatorId} className="mb-4 last:mb-0">
                  <div className="text-sm text-gray-300 mb-2">Validator {validatorId}:</div>
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <span className="text-cyan-400">e(G₁, σ) = </span>
                      <span className="text-gray-400 break-all">{truncateHex(pairing.lhs, 24)}</span>
                    </div>
                    <div>
                      <span className="text-yellow-400">e(PK, H(M)) = </span>
                      <span className="text-gray-400 break-all">{truncateHex(pairing.rhs, 24)}</span>
                    </div>
                    <div className={`font-bold ${pairing.equal ? 'text-green-400' : 'text-red-400'}`}>
                      {pairing.equal ? '✓ Values match - Signature valid!' : '✗ Values differ - Invalid!'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Aggregated Verification Math Visualization */}
          <MathVisualization
            title="How Aggregated Verification Works"
            steps={VERIFICATION_STEPS}
            currentStep={verificationStep}
            isVisible={showVerificationSteps}
          />

          {/* Aggregated Pairing Values */}
          {aggregatedPairing && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-teal-600">
              <h4 className="text-md font-semibold text-teal-400 mb-3">Pairing Values</h4>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-cyan-400">e(G₁, σ_agg) = </span>
                  <span className="text-gray-400 break-all">{truncateHex(aggregatedPairing.lhs, 24)}</span>
                </div>
                <div>
                  <span className="text-yellow-400">e(PK_agg, H(M)) = </span>
                  <span className="text-gray-400 break-all">{truncateHex(aggregatedPairing.rhs, 24)}</span>
                </div>
                <div className={`font-bold ${aggregatedPairing.equal ? 'text-green-400' : 'text-red-400'}`}>
                  {aggregatedPairing.equal ? '✓ Values match - Aggregated signature valid!' : '✗ Values differ - Invalid!'}
                </div>
              </div>
            </div>
          )}

          {/* Bilinearity Deep Dive */}
          {showVerificationSteps && verificationStep >= VERIFICATION_STEPS.length && (
            <div className="mt-4">
              <button
                onClick={toggleBilinearity}
                className="text-sm text-purple-400 hover:text-purple-300 underline cursor-pointer"
              >
                {showBilinearity ? 'Hide' : 'Show'} why bilinearity makes this work
              </button>
              <MathVisualization
                title="The Magic of Bilinearity"
                steps={BILINEARITY_EXPLANATION}
                currentStep={bilinearityStep}
                isVisible={showBilinearity}
              />
            </div>
          )}
        </div>

        {/* Scale Comparison */}
        {aggregatedResult && individualResults.length > 0 && (
          <div className="p-4 bg-gray-800 rounded-lg border border-green-600">
            <h3 className="text-lg font-semibold mb-3 text-green-400">BLS Aggregation Benefits at Scale (10,000 signers)</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Without Aggregation:</div>
                <div className="text-red-400">960 KB signatures</div>
                <div className="text-red-400">~15 seconds verification</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">With Aggregation:</div>
                <div className="text-green-400">96 bytes (10,000× smaller)</div>
                <div className="text-green-400">~2ms verification (7,500× faster)</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400">
              Bilinearity enables constant-size signatures regardless of signer count.
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Powered by @noble/curves BLS12-381 | Real cryptographic operations
        </div>
      </div>
    </div>
  );
}
