import * as AWS from "aws-sdk";

/**
 * STSで新しい認証情報を返す。失敗したらnullを返す
 * @param sts
 * @param roleArn 認証に用いるロールのARN
 * @param sessionName
 */
// tslint:disable-next-line: export-name
export const assumeRole = async (
  sts: AWS.STS,
  roleArn: string,
  sessionName?: string
) => {
  const session = await sts
    .assumeRole({
      RoleArn: roleArn,
      RoleSessionName: sessionName || "session"
    })
    .promise();

  if (session && session.Credentials) {
    return new AWS.Credentials(
      session.Credentials.AccessKeyId,
      session.Credentials.SecretAccessKey,
      session.Credentials.SessionToken
    );
  } else {
    return null;
  }
};

/**
 * 環境変数 XXX_ACCESS_KEY_ID, XXX_SECRET_ACCESS_KEY から認証情報を取得し、 get() を呼び出して返す
 * @param prefix XXXの部分
 */
export const getEnvironmentCredentials = async (prefix: string) => {
  return new Promise<AWS.EnvironmentCredentials>((resolve, reject) => {
      const envCreds = new AWS.EnvironmentCredentials(prefix);
      envCreds.get((error: any) => {
          if (error) { reject(error); }
          else { resolve(envCreds); }
      });
  });
};
