import * as LambdaType from "aws-lambda";

type keyValueMap = { [name: string]: string };
const isKeyValueMap = (arg: any): arg is keyValueMap => {
  if (typeof arg !== "object" || arg === null) { return false; }
  for (const key of Object.keys(arg)) {
    if (typeof arg[key] !== "string") { return false; }
  }
  return true;
};
type keyValueArrayMap = { [name: string]: string[] };
const isKeyValueArrayMap = (arg: any): arg is keyValueArrayMap => {
  if (typeof arg !== "object" || arg === null) { return false; }
  for (const key of Object.keys(arg)) {
    if (!Array.isArray(arg[key])) { return false; }
    const types = Array.from(new Set(arg[key].map((x: any) => typeof x)));
    // 空の配列も許容する
    if (types.length === 0) { continue; }
    if (types.length > 1) { return false; }
    if (types[0] !== "string") { return false; }
  }
  return true;
};

export type APIGatewayProxyEvent = LambdaType.APIGatewayProxyEvent;
export type Context = LambdaType.Context;

export const isAPIGatewayProxyEvent = (arg: any): arg is LambdaType.APIGatewayProxyEvent => {
  let i = 0;
  if (typeof arg !== "object" || arg === null) { return false; }
  if (arg.body !== null && typeof arg.body !== "string") { return false; }
  if (!isKeyValueMap(arg.headers)) { return false; }
  if (!isKeyValueArrayMap(arg.multiValueHeaders)) { return false; }
  if (typeof arg.httpMethod !== "string") { return false; }
  if (typeof arg.isBase64Encoded !== "boolean") { return false; }
  if (typeof arg.path !== "string") { return false; }
  if (arg.pathParameters !== null && !isKeyValueMap(arg.pathParameters)) { return false; }
  if (arg.queryStringParameters !== null && !isKeyValueMap(arg.queryStringParameters)) { return false; }
  if (arg.multiValueQueryStringParameters !== null && !isKeyValueArrayMap(arg.multiValueQueryStringParameters)) { return false; }
  if (arg.stageVariables !== null && !isKeyValueMap(arg.stageVariables)) { return false; }
  if (typeof arg.requestContext !== "object") { return false; } // TODO: ここは中身をチェックしてない
  if (typeof arg.resource !== "string") { return false; }
  return true;
};
