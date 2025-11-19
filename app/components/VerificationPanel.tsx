'use client';

interface VerificationResult {
  validatorId: number;
  success: boolean;
  timeMs: number;
}

interface VerificationPanelProps {
  individualResults: VerificationResult[];
  aggregatedResult: { success: boolean; timeMs: number } | null;
  onVerifyIndividual: () => void;
  onVerifyAggregated: () => void;
  canVerifyIndividual: boolean;
  canVerifyAggregated: boolean;
}

export default function VerificationPanel({
  individualResults,
  aggregatedResult,
  onVerifyIndividual,
  onVerifyAggregated,
  canVerifyIndividual,
  canVerifyAggregated,
}: VerificationPanelProps) {
  const totalIndividualTime = individualResults.reduce((sum, r) => sum + r.timeMs, 0);

  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Verification</h3>

      <div className="flex gap-3 mb-4">
        <button
          onClick={onVerifyIndividual}
          disabled={!canVerifyIndividual}
          className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
            canVerifyIndividual
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Verify Individual
        </button>
        <button
          onClick={onVerifyAggregated}
          disabled={!canVerifyAggregated}
          className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
            canVerifyAggregated
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Verify Aggregated
        </button>
      </div>

      {individualResults.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Individual Verification:</div>
          <div className="space-y-1">
            {individualResults.map((result) => (
              <div key={result.validatorId} className="flex justify-between text-sm">
                <span className="text-gray-300">Validator {result.validatorId}:</span>
                <span>
                  <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                    {result.success ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-400 ml-2">({result.timeMs.toFixed(1)}ms)</span>
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t border-gray-700 pt-1 mt-1">
              <span className="text-gray-300">Total:</span>
              <span className="text-orange-400">{totalIndividualTime.toFixed(1)}ms</span>
            </div>
          </div>
        </div>
      )}

      {aggregatedResult && (
        <div>
          <div className="text-sm text-gray-400 mb-2">Aggregated Verification:</div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Aggregated:</span>
            <span>
              <span className={aggregatedResult.success ? 'text-green-400' : 'text-red-400'}>
                {aggregatedResult.success ? '✓' : '✗'}
              </span>
              <span className="text-teal-400 ml-2">({aggregatedResult.timeMs.toFixed(1)}ms)</span>
            </span>
          </div>
        </div>
      )}

      {individualResults.length > 0 && aggregatedResult && (
        <div className="mt-4 bg-gray-900 rounded p-3">
          <div className="text-sm text-gray-400 mb-1">Speed improvement:</div>
          <div className="text-lg">
            <span className="text-orange-400">{totalIndividualTime.toFixed(1)}ms</span>
            <span className="text-gray-400 mx-2">→</span>
            <span className="text-teal-400">{aggregatedResult.timeMs.toFixed(1)}ms</span>
          </div>
          <div className="text-green-400 text-sm">
            {(totalIndividualTime / aggregatedResult.timeMs).toFixed(1)}× faster!
          </div>
        </div>
      )}
    </div>
  );
}
