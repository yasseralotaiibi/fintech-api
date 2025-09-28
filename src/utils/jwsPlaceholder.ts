export function signResponsePlaceholder<T>(payload: T): { payload: T; signature: string } {
  // Placeholder for JWS signing. In production, sign payloads with a hardware-backed key.
  const signature = 'mock-signature';
  return { payload, signature };
}

export function verifyRequestSignaturePlaceholder(): boolean {
  // Placeholder for verifying incoming JWS signatures.
  return true;
}
