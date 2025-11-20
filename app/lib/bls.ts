import { bls12_381 as bls } from '@noble/curves/bls12-381.js';

// Use longSignatures for Ethereum-style BLS (48-byte pubkeys in G₁, 96-byte sigs in G₂)
const BLS = bls.longSignatures;

// Access to curve primitives for pairing visualization
const { pairing, fields } = bls;

const G1Point = bls.G1.Point;
const G2Point = bls.G2.Point;

// Types
export interface KeyPair {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

export interface Validator {
  id: number;
  keyPair: KeyPair | null;
  signature: Uint8Array | null;
}

export interface TimingResult {
  success: boolean;
  timeMs: number;
}

// Generate a random BLS key pair
export function generateKeyPair(): KeyPair {
  const privateKey = bls.utils.randomSecretKey();
  const publicKey = BLS.getPublicKey(privateKey).toBytes();
  return { privateKey, publicKey };
}

// Sign a message with a private key
export function signMessage(privateKey: Uint8Array, message: string): Uint8Array {
  const messageBytes = new TextEncoder().encode(message);
  const hashedMessage = BLS.hash(messageBytes);
  return BLS.sign(hashedMessage, privateKey).toBytes();
}

// Verify a single signature
export function verifySignature(
  publicKey: Uint8Array,
  message: string,
  signature: Uint8Array
): boolean {
  const messageBytes = new TextEncoder().encode(message);
  const hashedMessage = BLS.hash(messageBytes);
  return BLS.verify(signature, hashedMessage, publicKey);
}

// Aggregate multiple signatures into one
export function aggregateSignatures(signatures: Uint8Array[]): Uint8Array {
  return BLS.aggregateSignatures(signatures).toBytes();
}

// Aggregate multiple public keys into one
export function aggregatePublicKeys(publicKeys: Uint8Array[]): Uint8Array {
  return BLS.aggregatePublicKeys(publicKeys).toBytes();
}

// Verify an aggregated signature against aggregated public key
export function verifyAggregatedSignature(
  publicKeys: Uint8Array[],
  message: string,
  aggregatedSignature: Uint8Array
): boolean {
  const messageBytes = new TextEncoder().encode(message);
  const hashedMessage = BLS.hash(messageBytes);
  const aggregatedPubKey = BLS.aggregatePublicKeys(publicKeys);
  return BLS.verify(aggregatedSignature, hashedMessage, aggregatedPubKey);
}

// Pairing result interface for visualization
export interface PairingResult {
  lhs: string; // e(G₁, σ)
  rhs: string; // e(PK, H(M))
  equal: boolean;
}

// Compute and return pairing values for visualization
export function verifyWithPairings(
  publicKey: Uint8Array,
  message: string,
  signature: Uint8Array
): PairingResult {
  const messageBytes = new TextEncoder().encode(message);
  const hashedMessage = BLS.hash(messageBytes);

  // Parse points
  const sigPoint = G2Point.fromBytes(signature);
  const pkPoint = G1Point.fromBytes(publicKey);

  // Compute pairings: e(G₁, σ) and e(PK, H(M))
  const lhsPairing = pairing(G1Point.BASE, sigPoint);
  const rhsPairing = pairing(pkPoint, hashedMessage);

  // Convert Fp12 elements to hex for display (first coefficient)
  const lhsHex = fp12ToHex(lhsPairing);
  const rhsHex = fp12ToHex(rhsPairing);

  return {
    lhs: lhsHex,
    rhs: rhsHex,
    equal: lhsHex === rhsHex,
  };
}

// Compute pairing values for aggregated verification
export function verifyAggregatedWithPairings(
  publicKeys: Uint8Array[],
  message: string,
  aggregatedSignature: Uint8Array
): PairingResult {
  const messageBytes = new TextEncoder().encode(message);
  const hashedMessage = BLS.hash(messageBytes);

  // Parse aggregated signature
  const sigPoint = G2Point.fromBytes(aggregatedSignature);

  // Aggregate public keys
  const aggregatedPk = BLS.aggregatePublicKeys(publicKeys);
  const pkPoint = G1Point.fromBytes(aggregatedPk.toBytes());

  // Compute pairings
  const lhsPairing = pairing(G1Point.BASE, sigPoint);
  const rhsPairing = pairing(pkPoint, hashedMessage);

  // Convert to hex
  const lhsHex = fp12ToHex(lhsPairing);
  const rhsHex = fp12ToHex(rhsPairing);

  return {
    lhs: lhsHex,
    rhs: rhsHex,
    equal: lhsHex === rhsHex,
  };
}

// Convert Fp12 element to truncated hex string
function fp12ToHex(fp12: typeof fields.Fp12.ONE): string {
  // Fp12 is represented as coefficients, convert to bytes
  const bytes = fields.Fp12.toBytes(fp12);
  return bytesToHex(bytes);
}

// Measure execution time of a function
export function measureTime<T>(fn: () => T): { result: T; timeMs: number } {
  const start = performance.now();
  const result = fn();
  const timeMs = performance.now() - start;
  return { result, timeMs };
}

// Convert bytes to hex string
export function bytesToHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Truncate hex string for display
export function truncateHex(hex: string, length: number = 8): string {
  if (hex.length <= length * 2 + 4) return hex;
  return `${hex.slice(0, length + 2)}...${hex.slice(-length)}`;
}

// Get byte size of signature (always 96 bytes for BLS)
export function getSignatureSize(): number {
  return 96;
}

// Get byte size of public key (always 48 bytes for BLS)
export function getPublicKeySize(): number {
  return 48;
}
