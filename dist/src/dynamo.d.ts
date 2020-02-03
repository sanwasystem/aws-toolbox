import * as AWS from "aws-sdk";
/**
 * キーを1つしか持たないテーブルからレコードを1件取得する。取得できなかった場合は例外をスローする。
 * @param documentClient
 * @param tableName DynamoDBのテーブル名
 * @param tableKeyName テーブルのキー名（テーブルによって決まっている値）
 * @param key キーの値
 * @param typeGuardFunction レコードが見つかってもこのチェックが通らなかったら例外をスローする
 */
export declare function getSingleRecord<T extends object>(documentClient: AWS.DynamoDB.DocumentClient, tableName: string, tableKeyName: string, key: string, typeGuardFunction?: (arg: any) => arg is T): Promise<T>;
/**
 * あるテーブルのレコードをすべて取得する
 * @param documentClient
 * @param tableName
 * @param typeGuardFunction
 */
export declare function getAllRecords<T extends object>(documentClient: AWS.DynamoDB.DocumentClient, tableName: string, typeGuardFunction?: (arg: any) => arg is T): Promise<T[]>;
