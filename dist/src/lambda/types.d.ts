import * as LambdaType from "aws-lambda";
export declare type APIGatewayProxyEvent = LambdaType.APIGatewayProxyEvent;
export declare type Context = LambdaType.Context;
export declare const isAPIGatewayProxyEvent: (arg: any) => arg is LambdaType.APIGatewayProxyEvent;
