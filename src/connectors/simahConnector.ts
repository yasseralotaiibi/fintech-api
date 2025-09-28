export type SimahCreditReportRequest = {
  nationalId: string;
  consentId: string;
};

export type SimahCreditReport = {
  score: number;
  lastUpdated: string;
  summary: string;
};

export async function fetchSimahCreditReport(
  _request: SimahCreditReportRequest,
): Promise<SimahCreditReport> {
  return {
    score: 720,
    lastUpdated: new Date().toISOString(),
    summary: 'Mock credit report for sandbox usage.',
  };
}
