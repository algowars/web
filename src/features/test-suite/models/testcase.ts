import { IoExactPayload } from "./io-exact-payload";

export interface TestCaseBase {
  id: number;
  testSuiteId: number;
  ordinal: number;
  points: number;
  timeoutMs: number;
  memoryKb: number;
}

export interface IoExactTestCase extends TestCaseBase {
  typeCode: "io_exact";
  payload: IoExactPayload;
}

export interface IoRandomTestCase extends TestCaseBase {
  typeCode: "io_random";
}

export interface FileTestCase extends TestCaseBase {
  typeCode: "test_file";
}

export type Testcase = IoExactTestCase | IoRandomTestCase | FileTestCase;
