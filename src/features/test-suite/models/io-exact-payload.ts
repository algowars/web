export interface IoExactPayload {
  id: number;
  input: string;
  expectedOutput: string;
  pairHash?: string;
  inputHash?: string;
  outputHash?: string;
}
