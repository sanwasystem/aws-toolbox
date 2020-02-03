import * as AWS from "aws-sdk";
/**
 * KMSを使って暗号化された値を復号する。失敗時は例外をスローするのではなくnullを返す
 * @param kms
 * @param encrypted
 */
export declare const decrypt: (kms: AWS.KMS, encrypted: string) => Promise<string | null>;
