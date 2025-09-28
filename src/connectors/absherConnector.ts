export type AbsherVerificationRequest = {
  nationalId: string;
  otp: string;
};

export async function verifyAbsherIdentity(
  _request: AbsherVerificationRequest,
): Promise<{ verified: boolean }> {
  return { verified: true };
}
