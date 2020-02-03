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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * キーを1つしか持たないテーブルからレコードを1件取得する。取得できなかった場合は例外をスローする。
 * @param documentClient
 * @param tableName DynamoDBのテーブル名
 * @param tableKeyName テーブルのキー名（テーブルによって決まっている値）
 * @param key キーの値
 * @param typeGuardFunction レコードが見つかってもこのチェックが通らなかったら例外をスローする
 */
function getSingleRecord(documentClient, tableName, tableKeyName, key, typeGuardFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        const condition = {
            TableName: tableName,
            KeyConditionExpression: "#k = :val",
            ExpressionAttributeValues: { ":val": key },
            ExpressionAttributeNames: { "#k": tableKeyName }
        };
        const raw = yield documentClient.query(condition).promise();
        if (!raw || !Array.isArray(raw.Items) || raw.Items.length === 0) {
            throw new Error(`record not found: tableName=${tableName}, tableKeyName=${tableKeyName}, key=${key}`);
        }
        const result = raw.Items[0]; // Itemsが直接レコードを含むようになった
        if (typeGuardFunction) {
            if (typeGuardFunction(result)) {
                return result;
            }
            else {
                throw new Error("record found but type not match");
            }
        }
        else {
            // tslint:disable-next-line: prefer-type-cast
            return result;
        }
    });
}
exports.getSingleRecord = getSingleRecord;
/**
 * あるテーブルのレコードをすべて取得する
 * @param documentClient
 * @param tableName
 * @param typeGuardFunction
 */
function getAllRecords(documentClient, tableName, typeGuardFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastEvaluatedKey = undefined;
        let result = [];
        // tslint:disable-next-line: no-constant-condition
        while (true) {
            const params = { TableName: tableName, Limit: 100 };
            if (lastEvaluatedKey) {
                params.ExclusiveStartKey = lastEvaluatedKey;
            }
            const raw = yield documentClient.scan(params).promise();
            if (!raw || !Array.isArray(raw.Items)) {
                throw new Error(`table scan failed: tableName=${tableName}`);
            }
            result = result.concat(applyTypeGuardFunction(raw.Items, typeGuardFunction));
            lastEvaluatedKey = raw.LastEvaluatedKey;
            if (!lastEvaluatedKey) {
                break;
            }
        }
        return result;
    });
}
exports.getAllRecords = getAllRecords;
function applyTypeGuardFunction(array, typeGuardFunction) {
    if (!Array.isArray(array)) {
        throw new Error("argument is not an array");
    }
    if (!typeGuardFunction) {
        // tslint:disable-next-line: prefer-type-cast
        return array;
    }
    if (array.some(x => !typeGuardFunction(x))) {
        if (process.env.DEBUG) {
            console.error("type guard function returns false");
            for (const item of array) {
                if (!typeGuardFunction(item)) {
                    console.log(item);
                    break;
                }
            }
        }
        throw new Error("some record(s) is not T");
    }
    // tslint:disable-next-line: prefer-type-cast
    return array;
}
