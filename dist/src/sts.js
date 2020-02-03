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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = __importStar(require("aws-sdk"));
/**
 * STSで新しい認証情報を返す。失敗したらnullを返す
 * @param sts
 * @param roleArn 認証に用いるロールのARN
 * @param sessionName
 */
// tslint:disable-next-line: export-name
exports.assumeRole = (sts, roleArn, sessionName) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield sts
        .assumeRole({
        RoleArn: roleArn,
        RoleSessionName: sessionName || "session"
    })
        .promise();
    if (session && session.Credentials) {
        return new AWS.Credentials(session.Credentials.AccessKeyId, session.Credentials.SecretAccessKey, session.Credentials.SessionToken);
    }
    else {
        return null;
    }
});
/**
 * 環境変数 XXX_ACCESS_KEY_ID, XXX_SECRET_ACCESS_KEY から認証情報を取得し、 get() を呼び出して返す
 * @param prefix XXXの部分
 */
exports.getEnvironmentCredentials = (prefix) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const envCreds = new AWS.EnvironmentCredentials(prefix);
        envCreds.get((error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(envCreds);
            }
        });
    });
});
