import * as types from "./types";

export type APIGatewayProxyEvent = types.APIGatewayProxyEvent;
export type Context = types.Context;
export const isAPIGatewayProxyEvent = types.isAPIGatewayProxyEvent;

/**
 * API GatewayのLambda Proxyで呼び出されるLambdaはこれを使って結果を返す
 * @param obj 戻り値
 * @param statusCode ステータスコード。省略時は200
 * @param contentType
 * @param accessControlAllowOrigin
 */
export const completeForAPIGateway = (
  obj: string | number | object | Buffer,
  statusCode: number = 200,
  contentType: string = "application/json; charset=utf-8",
  accessControlAllowOrigin: string = "*"
) => {
  if (Buffer.isBuffer(obj)) {
    obj = obj.toString("utf-8");
  } else if (typeof obj == "object") {
    obj = JSON.stringify(obj);
  }
  return {
    statusCode: statusCode,
    body: obj,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*"
    }
  };
};

/**
 * ContextのinvokedFunctionArnからリージョン名を取り出す
 * @param context 
 */
export const extractRegion = (context: Context) => {
  // 'arn:aws:lambda:ap-northeast-1:999999999999:function:XXXXX'
  return context.invokedFunctionArn.split(":")[3];
}

/**
 * Lambdaが実環境で呼び出されるときのContextと同じ形のオブジェクトを作成して返す
 * @param functionName
 * @param functionVersion
 * @param region
 * @param accountNo
 * @param awsRequestId
 * @param memoryLimitInMB
 */
export const generateLambdaContextSample = (
  functionName: string,
  functionVersion = "$LATEST",
  region = "ap-northeast-1",
  accountNo = "999999999999",
  awsRequestId = "ffffffff-ffff-ffff-ffff-ffffffffffff",
  memoryLimitInMB = 128
): Context => {
  if (!/^\d{12}$/.test(accountNo)) {
    throw new Error("Account No must be 12-digit number");
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(awsRequestId)) {
    throw new Error("request id must be formatted like 'ffffffff-ffff-ffff-ffff-ffffffffffff'");
  }

  const now = new Date();
  const ymd = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const ymdStr = `${ymd}`;
  const ymdStr_ = ymdStr.substring(0, 4) + "/" + ymdStr.substring(4, 6) + "/" + ymdStr.substring(6, 8);
  let logStream = "";
  for (let i = 0; i < 32; i++) {
    // tslint:disable-next-line: insecure-random
    logStream += Math.floor(Math.random() * 16 + 0.5).toString(16);
  }

  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: functionName,
    functionVersion: functionVersion,
    invokedFunctionArn: `arn:aws:lambda:${region}:${accountNo}:function:${functionName}`,
    memoryLimitInMB: `${memoryLimitInMB}`,
    awsRequestId: awsRequestId,
    logGroupName: `/aws/lambda/${functionName}`,
    logStreamName: `${ymdStr_}/[${functionVersion}]${logStream}`,
    identity: undefined,
    clientContext: undefined,
    getRemainingTimeInMillis: () => {
      return 1;
    },
    done: (error?: Error, result?: any) => {},
    fail: (error: Error | string) => {},
    succeed: (message: any, object?: any) => {}
  };
};
