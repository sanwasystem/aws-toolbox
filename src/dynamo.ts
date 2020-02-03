import * as AWS from "aws-sdk";

/**
 * キーを1つしか持たないテーブルからレコードを1件取得する。取得できなかった場合は例外をスローする。
 * @param documentClient
 * @param tableName DynamoDBのテーブル名
 * @param tableKeyName テーブルのキー名（テーブルによって決まっている値）
 * @param key キーの値
 * @param typeGuardFunction レコードが見つかってもこのチェックが通らなかったら例外をスローする
 */
export async function getSingleRecord<T extends object>(
  documentClient: AWS.DynamoDB.DocumentClient,
  tableName: string,
  tableKeyName: string,
  key: string,
  typeGuardFunction?: (arg: any) => arg is T
): Promise<T> {
  const condition = {
    TableName: tableName,
    KeyConditionExpression: "#k = :val",
    ExpressionAttributeValues: { ":val": key },
    ExpressionAttributeNames: { "#k": tableKeyName }
  };
  const raw = await documentClient.query(condition).promise();
  if (!raw || !Array.isArray(raw.Items) || raw.Items.length === 0) {
    throw new Error(
      `record not found: tableName=${tableName}, tableKeyName=${tableKeyName}, key=${key}`
    );
  }

  const result = raw.Items[0]; // Itemsが直接レコードを含むようになった

  if (typeGuardFunction) {
    if (typeGuardFunction(result)) {
      return result;
    } else {
      throw new Error("record found but type not match");
    }
  } else {
    // tslint:disable-next-line: prefer-type-cast
    return result as T;
  }
}

/**
 * あるテーブルのレコードをすべて取得する
 * @param documentClient 
 * @param tableName 
 * @param typeGuardFunction 
 */
export async function getAllRecords<T extends object>(
  documentClient: AWS.DynamoDB.DocumentClient,
  tableName: string,
  typeGuardFunction?: (arg: any) => arg is T
): Promise<T[]> {

  let lastEvaluatedKey: LastEvaluatedKeyType|undefined = undefined;
  let result: T[] = [];
  // tslint:disable-next-line: no-constant-condition
  while(true) {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = { TableName: tableName, Limit: 100 };
    if (lastEvaluatedKey) { params.ExclusiveStartKey = lastEvaluatedKey; }

    const raw = await documentClient.scan(params).promise();
    if (!raw || !Array.isArray(raw.Items)) {
      throw new Error(`table scan failed: tableName=${tableName}`);
    }
    
    result = result.concat(applyTypeGuardFunction(raw.Items, typeGuardFunction));
    lastEvaluatedKey = raw.LastEvaluatedKey;
    if (!lastEvaluatedKey) { break; }
  }

  return result;
}

type LastEvaluatedKeyType = {[key: string]: any};

function applyTypeGuardFunction<T>(array: any, typeGuardFunction?: (obj: any) => obj is T) {
  if (!Array.isArray(array)) { throw new Error("argument is not an array"); }
  if (!typeGuardFunction) { 
    // tslint:disable-next-line: prefer-type-cast
    return array as T[];
  }

  if (array.some(x => !typeGuardFunction(x))) {
    if (process.env.DEBUG) {
      console.error("type guard function returns false");
      for(const item of array) {
        if (!typeGuardFunction(item)) {
          console.log(item);
          break;
        }
      }
    }
    throw new Error("some record(s) is not T");
  }

  // tslint:disable-next-line: prefer-type-cast
  return array as T[];
}

