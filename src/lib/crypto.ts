import { sha256 } from "@noble/hashes/sha2.js";
import { sha512 } from "@noble/hashes/sha2.js";
import { hmac } from "@noble/hashes/hmac.js";
import { pbkdf2 } from "@noble/hashes/pbkdf2.js";
import { ripemd160 } from "@noble/hashes/legacy.js";
import { getPublicKey } from "@noble/secp256k1";
import { bech32 } from "@scure/base";
import { wordlist } from "@/data/bip39-wordlist";

/** Byte array → hex string */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Byte array → binary string */
function bytesToBinary(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(2).padStart(8, "0"))
    .join("");
}

// ─── Step 1: 엔트로피 생성 ───────────────────────────────────────

export function generateEntropy(bits: 128 | 256 = 128): Uint8Array {
  const entropy = new Uint8Array(bits / 8);
  crypto.getRandomValues(entropy);
  return entropy;
}

// ─── Step 2: 체크섬 계산 ─────────────────────────────────────────

export interface ChecksumResult {
  hash: string; // 전체 SHA-256 해시 (hex)
  hashBinary: string; // 전체 SHA-256 해시 (binary)
  checksumBits: string; // 추출된 체크섬 비트
  checksumLength: number; // 체크섬 비트 수
}

export function computeChecksum(entropy: Uint8Array): ChecksumResult {
  const hash = sha256(entropy);
  const hashHex = bytesToHex(hash);
  const hashBinary = bytesToBinary(hash);
  const checksumLength = (entropy.length * 8) / 32; // 128→4, 256→8
  const checksumBits = hashBinary.slice(0, checksumLength);
  return { hash: hashHex, hashBinary, checksumBits, checksumLength };
}

// ─── Step 3: 니모닉 생성 (BIP-39) ───────────────────────────────

export interface MnemonicGroup {
  bits: string;
  index: number;
  word: string;
}

export interface MnemonicResult {
  binaryString: string; // entropy + checksum 전체 바이너리
  groups: MnemonicGroup[];
  mnemonic: string;
}

export function entropyToMnemonic(entropy: Uint8Array): MnemonicResult {
  const { checksumBits } = computeChecksum(entropy);
  const binaryString = bytesToBinary(entropy) + checksumBits;

  const groups: MnemonicGroup[] = [];
  for (let i = 0; i < binaryString.length; i += 11) {
    const bits = binaryString.slice(i, i + 11);
    const index = parseInt(bits, 2);
    groups.push({ bits, index, word: wordlist[index] });
  }

  const mnemonic = groups.map((g) => g.word).join(" ");
  return { binaryString, groups, mnemonic };
}

// ─── Step 4: 시드 생성 (PBKDF2) ─────────────────────────────────

export function mnemonicToSeed(
  mnemonic: string,
  passphrase: string = ""
): Uint8Array {
  const encoder = new TextEncoder();
  const password = encoder.encode(mnemonic.normalize("NFKD"));
  const salt = encoder.encode(("mnemonic" + passphrase).normalize("NFKD"));
  return pbkdf2(sha512, password, salt, { c: 2048, dkLen: 64 });
}

// ─── Step 5: 마스터 키 (BIP-32) ──────────────────────────────────

export interface MasterKeyResult {
  privateKey: Uint8Array;
  chainCode: Uint8Array;
  privateKeyHex: string;
  chainCodeHex: string;
}

export function seedToMasterKey(seed: Uint8Array): MasterKeyResult {
  const encoder = new TextEncoder();
  const key = encoder.encode("Bitcoin seed");
  const I = hmac(sha512, key, seed);
  const privateKey = I.slice(0, 32);
  const chainCode = I.slice(32);
  return {
    privateKey,
    chainCode,
    privateKeyHex: bytesToHex(privateKey),
    chainCodeHex: bytesToHex(chainCode),
  };
}

// ─── Step 6: 공개키 (secp256k1) ──────────────────────────────────

export interface PublicKeyResult {
  publicKey: Uint8Array;
  publicKeyHex: string;
}

export function privateKeyToPublicKey(privKey: Uint8Array): PublicKeyResult {
  const publicKey = getPublicKey(privKey, true); // compressed
  return {
    publicKey,
    publicKeyHex: bytesToHex(publicKey),
  };
}

// ─── Step 7: 비트코인 주소 (Bech32) ─────────────────────────────

export interface AddressResult {
  hash160Hex: string;
  address: string;
}

export function publicKeyToAddress(pubKey: Uint8Array): AddressResult {
  // HASH160 = RIPEMD160(SHA256(pubKey))
  const sha256Hash = sha256(pubKey);
  const hash160 = ripemd160(sha256Hash);
  const hash160Hex = bytesToHex(hash160);

  // Bech32 encoding (SegWit v0)
  const words = bech32.toWords(hash160);
  const address = bech32.encode("bc", [0, ...words]);

  return { hash160Hex, address };
}

// ─── 전체 파이프라인 ─────────────────────────────────────────────

export interface DerivationResult {
  entropy: Uint8Array;
  entropyHex: string;
  entropyBinary: string;
  checksum: ChecksumResult;
  mnemonicResult: MnemonicResult;
  seed: Uint8Array;
  seedHex: string;
  masterKey: MasterKeyResult;
  publicKeyResult: PublicKeyResult;
  addressResult: AddressResult;
}

export function runFullDerivation(
  bits: 128 | 256 = 128,
  passphrase: string = ""
): DerivationResult {
  const entropy = generateEntropy(bits);
  const entropyHex = bytesToHex(entropy);
  const entropyBinary = bytesToBinary(entropy);
  const checksum = computeChecksum(entropy);
  const mnemonicResult = entropyToMnemonic(entropy);
  const seed = mnemonicToSeed(mnemonicResult.mnemonic, passphrase);
  const seedHex = bytesToHex(seed);
  const masterKey = seedToMasterKey(seed);
  const publicKeyResult = privateKeyToPublicKey(masterKey.privateKey);
  const addressResult = publicKeyToAddress(publicKeyResult.publicKey);

  return {
    entropy,
    entropyHex,
    entropyBinary,
    checksum,
    mnemonicResult,
    seed,
    seedHex,
    masterKey,
    publicKeyResult,
    addressResult,
  };
}
