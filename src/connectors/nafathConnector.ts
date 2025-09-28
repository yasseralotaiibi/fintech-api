export type NafathAuthRequest = {
  nationalId: string;
  channel: 'mobile' | 'web';
};

export type NafathAuthStatus = 'PENDING' | 'APPROVED' | 'DENIED';

export async function initiateNafathAuth(
  _request: NafathAuthRequest,
): Promise<{ transactionId: string }> {
  return { transactionId: 'nafath-txn-' + Date.now() };
}

export async function pollNafathStatus(_transactionId: string): Promise<NafathAuthStatus> {
  return 'PENDING';
}
