import * as types from "./types";
import * as AWS from "aws-sdk";
export type APIGatewayProxyEvent = types.APIGatewayProxyEvent;
export type Context = types.Context;
export const isAPIGatewayProxyEvent = types.isAPIGatewayProxyEvent;

/**
 * Lambda関数を実行し、結果をJSONとしてパースしてtype guardに通して返す
 * @param lambda
 * @param functionName
 * @param payload
 * @param typeguard
 * @param options
 */
export const invokeFunction = async <T>(
  lambda: AWS.Lambda,
  functionName: string,
  payload: object,
  typeguard?: (arg: any) => arg is T,
  options?: {
    ClientContext?: string;
    InvocationType?: string;
    LogType?: string;
    Qualifier?: string;
  }
): Promise<T> => {
  const params: AWS.Lambda.InvocationRequest = {
    ...(options ?? {}),
    FunctionName: functionName,
    Payload: JSON.stringify(payload)
  };

  const lambdaResult = await lambda.invoke(params).promise();

  if (lambdaResult.Payload === undefined) {
    throw new Error(`lambda function '${functionName}' returned undefined`);
  }
  let resultObject: unknown;
  try {
    let resultPayload = "";
    if (typeof lambdaResult.Payload === "string") {
      resultPayload = lambdaResult.Payload;
    } else if (Buffer.isBuffer(lambdaResult.Payload)) {
      resultPayload = lambdaResult.Payload.toString("utf-8");
    } else {
      resultPayload = lambdaResult.Payload.toString();
    }
    resultObject = JSON.parse(resultPayload);
  } catch (e) {
    throw new Error(`lambda function '${functionName}' returned non-JSON`);
  }

  if (typeguard === undefined) {
    return resultObject as T;
  }
  if (typeguard(resultObject)) {
    return resultObject;
  }
  throw new Error(`type guard not satisfied: ${lambdaResult.Payload}`);
};

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
};

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
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      awsRequestId
    )
  ) {
    throw new Error(
      "request id must be formatted like 'ffffffff-ffff-ffff-ffff-ffffffffffff'"
    );
  }

  const now = new Date();
  const ymd =
    now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const ymdStr = `${ymd}`;
  const ymdStr_ =
    ymdStr.substring(0, 4) +
    "/" +
    ymdStr.substring(4, 6) +
    "/" +
    ymdStr.substring(6, 8);
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
