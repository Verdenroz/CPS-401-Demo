'use client';

import { truncateHex, bytesToHex, getSignatureSize } from '../lib/bls';

interface AggregationPanelProps {
  signatures: (Uint8Array | null)[];
  aggregatedSignature: Uint8Array | null;
  onAggregate: () => void;
  canAggregate: boolean;
}

export default function AggregationPanel({
  signatures,
  aggregatedSignature,
  onAggregate,
  canAggregate,
}: AggregationPanelProps) {
  const validSignatures = signatures.filter((s): s is Uint8Array => s !== null);
  const totalSize = validSignatures.length * getSignatureSize();
  const aggregatedSize = getSignatureSize();

  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Signature Aggregation</h3>
        <button
          onClick={onAggregate}
          disabled={!canAggregate}
          className={`px-4 py-2 rounded font-medium transition-all ${
            canAggregate
              ? 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 text-white cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Aggregate Signatures
        </button>
      </div>

      {validSignatures.length > 0 && (
        <div className="mb-4 text-sm">
          <span className="text-gray-400">Individual signatures: </span>
          <span className="text-white">{validSignatures.length} × {getSignatureSize()} bytes = </span>
          <span className="text-red-400 font-semibold">{totalSize} bytes</span>
        </div>
      )}

      {aggregatedSignature && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">→</span>
            <div>
              <div className="text-gray-400 text-sm">Aggregated Signature:</div>
              <div className="text-green-400 font-mono text-sm">
                {truncateHex(bytesToHex(aggregatedSignature), 12)}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Size reduction:</span>
              <div>
                <span className="text-red-400 line-through">{totalSize} bytes</span>
                <span className="text-gray-400 mx-2">→</span>
                <span className="text-green-400 font-bold">{aggregatedSize} bytes</span>
              </div>
            </div>
            <div className="text-right text-sm text-green-400 mt-1">
              {validSignatures.length}× smaller!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
