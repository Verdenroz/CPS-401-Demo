'use client';

import { truncateHex, bytesToHex, getSignatureSize, getPublicKeySize } from '../lib/bls';

interface ValidatorCardProps {
  id: number;
  publicKey: Uint8Array | null;
  signature: Uint8Array | null;
  onGenerateKey: () => void;
  onSign: () => void;
  canSign: boolean;
}

export default function ValidatorCard({
  id,
  publicKey,
  signature,
  onGenerateKey,
  onSign,
  canSign,
}: ValidatorCardProps) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Validator {id}</h3>
        <div className="flex gap-2">
          <button
            onClick={onGenerateKey}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Generate Key
          </button>
          <button
            onClick={onSign}
            disabled={!canSign}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              canSign
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Sign
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-400">PubKey: </span>
          {publicKey ? (
            <span className="text-cyan-400 font-mono">
              {truncateHex(bytesToHex(publicKey))}
              <span className="text-gray-500 ml-2">({getPublicKeySize()} bytes)</span>
            </span>
          ) : (
            <span className="text-gray-500">Not generated</span>
          )}
        </div>

        <div>
          <span className="text-gray-400">Signature: </span>
          {signature ? (
            <span className="text-yellow-400 font-mono">
              {truncateHex(bytesToHex(signature))}
              <span className="text-gray-500 ml-2">({getSignatureSize()} bytes)</span>
            </span>
          ) : (
            <span className="text-gray-500">Not signed</span>
          )}
        </div>
      </div>
    </div>
  );
}
