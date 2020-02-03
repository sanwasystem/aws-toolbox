import * as AWS from "aws-sdk";

/**
 * KMSを使って暗号化された値を復号する。失敗時は例外をスローするのではなくnullを返す
 * @param kms 
 * @param encrypted 
 */
// tslint:disable-next-line: export-name
export const decrypt = async (kms: AWS.KMS, encrypted: string) => {
  try {
    const data = await kms
      .decrypt({ CiphertextBlob: new Buffer(encrypted, "base64") })
      .promise();
    if (!data || !data.Plaintext) {
      return null;
    }
    const plainTextData = data.Plaintext;
    if (Buffer.isBuffer(plainTextData)) {
      return plainTextData.toString("ascii");
    }
    if (typeof plainTextData === "string") {
      return plainTextData;
    }
    return plainTextData.toString();
  } catch (e) {
    console.error("decryption failed");
    console.error(e);
    return null;
  }
};
