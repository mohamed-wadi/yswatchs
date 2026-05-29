const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function b32Decode(s: string): Uint8Array {
  s = s.toUpperCase().replace(/=+$/, "").replace(/\s/g, "");
  const bytes: number[] = [];
  let bits = 0, val = 0;
  for (const c of s) {
    const i = B32.indexOf(c);
    if (i < 0) continue;
    val = (val << 5) | i;
    bits += 5;
    if (bits >= 8) {
      bytes.push((val >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

function b32Encode(bytes: Uint8Array): string {
  let out = "";
  let bits = 0, val = 0;
  for (const b of bytes) {
    val = (val << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(val >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(val << (5 - bits)) & 0x1f];
  return out;
}

export function generateSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return b32Encode(bytes);
}

export function getOtpAuthUri(secret: string, account: string, issuer = "YsWatchs"): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

async function hotp(keyBytes: Uint8Array, counter: number): Promise<string> {
  const counterBuf = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    counterBuf[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const key = await crypto.subtle.importKey("raw", keyBytes.buffer as ArrayBuffer, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBuf.buffer as ArrayBuffer));
  const offset = sig[sig.length - 1] & 0x0f;
  const code = ((sig[offset] & 0x7f) << 24) | (sig[offset + 1] << 16) | (sig[offset + 2] << 8) | sig[offset + 3];
  return String(code % 1_000_000).padStart(6, "0");
}

export async function verifyTOTP(secret: string, code: string, window = 1): Promise<boolean> {
  const keyBytes = b32Decode(secret);
  const t = Math.floor(Date.now() / 1000 / 30);
  for (let i = -window; i <= window; i++) {
    if ((await hotp(keyBytes, t + i)) === code.trim()) return true;
  }
  return false;
}
