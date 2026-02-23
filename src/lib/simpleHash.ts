// ─── Simple deterministic hash simulation (no Web Crypto needed) ───────────
export function simpleHash(str: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const combined = (h1 >>> 0) * 4294967296 + (h2 >>> 0);
  // Expand to 64 hex chars using multiple rounds
  let result = "";
  let seed = combined;
  for (let i = 0; i < 8; i++) {
    seed = Math.imul(seed ^ (seed >>> 17), 0x45d9f3b);
    seed = Math.imul(seed ^ (seed >>> 13), 0x45d9f3b);
    seed = seed ^ (seed >>> 16);
    result += (seed >>> 0).toString(16).padStart(8, "0");
  }
  return result.slice(0, 64);
}
