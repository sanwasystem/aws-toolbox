"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * KMSを使って暗号化された値を復号する。失敗時は例外をスローするのではなくnullを返す
 * @param kms
 * @param encrypted
 */
// tslint:disable-next-line: export-name
exports.decrypt = (kms, encrypted) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield kms
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
    }
    catch (e) {
        console.error("decryption failed");
        console.error(e);
        return null;
    }
});
