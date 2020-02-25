/// <reference types="node" />
import * as types from "./types";
import * as AWS from "aws-sdk";
export declare type APIGatewayProxyEvent = types.APIGatewayProxyEvent;
export declare type Context = types.Context;
export declare const isAPIGatewayProxyEvent: (arg: any) => arg is import("aws-lambda").APIGatewayProxyEvent;
/**
 * Lambda関数を実行し、結果をJSONとしてパースしてtype guardに通して返す
 * @param lambda
 * @param functionName
 * @param payload
 * @param typeguard
 * @param options
 */
export declare const invokeFunction: <T>(lambda: AWS.Lambda, functionName: string, payload: object, typeguard?: ((arg: any) => arg is T) | undefined, options?: {
    ClientContext?: string | undefined;
    InvocationType?: string | undefined;
    LogType?: string | undefined;
    Qualifier?: string | undefined;
} | undefined) => Promise<T>;
/**
 * API GatewayのLambda Proxyで呼び出されるLambdaはこれを使って結果を返す
 * @param obj 戻り値
 * @param statusCode ステータスコード。省略時は200
 * @param contentType
 * @param accessControlAllowOrigin
 */
export declare const completeForAPIGateway: (obj: string | number | object | Buffer, statusCode?: number, contentType?: string, accessControlAllowOrigin?: string) => {
    statusCode: number;
    body: string | number;
    headers: {
        "Content-Type": string;
        "Access-Control-Allow-Origin": string;
    };
};
/**
 * ContextのinvokedFunctionArnからリージョン名を取り出す
 * @param context
 */
export declare const extractRegion: (context: import("aws-lambda").Context) => string;
/**
 * Lambdaが実環境で呼び出されるときのContextと同じ形のオブジェクトを作成して返す
 * @param functionName
 * @param functionVersion
 * @param region
 * @param accountNo
 * @param awsRequestId
 * @param memoryLimitInMB
 */
export declare const generateLambdaContextSample: (functionName: string, functionVersion?: string, region?: string, accountNo?: string, awsRequestId?: string, memoryLimitInMB?: number) => import("aws-lambda").Context;
