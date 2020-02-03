import * as AWS from "aws-sdk";
/**
 * STSで新しい認証情報を返す。失敗したらnullを返す
 * @param sts
 * @param roleArn 認証に用いるロールのARN
 * @param sessionName
 */
export declare const assumeRole: (sts: AWS.STS, roleArn: string, sessionName?: string | undefined) => Promise<AWS.Credentials | null>;
/**
 * 環境変数 XXX_ACCESS_KEY_ID, XXX_SECRET_ACCESS_KEY から認証情報を取得し、 get() を呼び出して返す
 * @param prefix XXXの部分
 */
export declare const getEnvironmentCredentials: (prefix: string) => Promise<AWS.EnvironmentCredentials>;
