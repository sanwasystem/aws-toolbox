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
 * タグ情報を取得する
 * @param rds
 * @param arn RDSインスタンスのARN
 */
const getTag = (rds, arn) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tagData = yield rds.listTagsForResource({ ResourceName: arn }).promise();
        const tagArray = [];
        const tagDic = {};
        if (Array.isArray(tagData.TagList)) {
            for (const item of tagData.TagList) {
                tagDic[item.Key || ""] = item.Value || "";
                tagArray.push({ Key: item.Key || "", Value: item.Value || "" });
            }
        }
        return {
            Tags: tagArray,
            Tag: tagDic
        };
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
/**
 * 名前でRDSインスタンスを1個取得する
 * @param rds
 * @param identifier
 */
exports.getInstanceByIdentifier = (rds, identifier) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield rds.describeDBInstances({ DBInstanceIdentifier: identifier }).promise();
        if (!data.DBInstances) {
            return null;
        }
        const instance = data.DBInstances[0];
        const required = {
            DBInstanceIdentifier: instance.DBInstanceIdentifier || "",
            DBInstanceArn: instance.DBInstanceArn || "",
            DBInstanceClass: instance.DBInstanceClass || ""
        };
        const tag = yield getTag(rds, instance.DBInstanceArn || "");
        if (tag === null) {
            return null;
        }
        return Object.assign(Object.assign(Object.assign({}, instance), required), tag);
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
/**
 * すべてのDBインスタンスを取得する。エラー時はnullを返す
 * @param rds
 */
exports.getAllInstances = (rds) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield rds.describeDBInstances().promise();
    if (!Array.isArray(data.DBInstances)) {
        return null;
    }
    const result = [];
    for (const instance of data.DBInstances) {
        const required = {
            DBInstanceIdentifier: instance.DBInstanceIdentifier || "",
            DBInstanceArn: instance.DBInstanceArn || "",
            DBInstanceClass: instance.DBInstanceClass || ""
        };
        const tag = yield getTag(rds, instance.DBInstanceArn || "");
        if (tag === null) {
            return null;
        }
        result.push(Object.assign(Object.assign(Object.assign({}, instance), required), tag));
    }
    return result;
});
/**
 * RDSインスタンスを停止する
 * @param rds
 * @param identifier
 */
exports.stopInstance = (rds, identifier) => __awaiter(void 0, void 0, void 0, function* () {
    const instance = yield exports.getInstanceByIdentifier(rds, name);
    if (instance === null) {
        return { result: false, reason: "DBインスタンスが見つからないか取得に失敗" };
    }
    if (instance.DBInstanceStatus === "stopped") {
        return { result: true, reason: "既に停止中" };
    }
    if (instance.DBInstanceStatus !== "available") {
        return { result: false, reason: "利用可能(available)以外の状態" };
    }
    try {
        yield rds.stopDBInstance({ DBInstanceIdentifier: identifier }).promise();
        return { result: true, reason: "OK" };
    }
    catch (e) {
        return { result: false, reason: e };
    }
});
/**
 * RDSインスタンスを起動する
 * @param rds
 * @param identifier
 */
exports.startInstance = (rds, identifier) => __awaiter(void 0, void 0, void 0, function* () {
    const instance = yield exports.getInstanceByIdentifier(rds, name);
    if (instance === null) {
        return { result: false, reason: "DBインスタンスが見つからないか取得に失敗" };
    }
    if (instance.DBInstanceStatus === "available") {
        return { result: true, reason: "既に起動中" };
    }
    if (instance.DBInstanceStatus !== "stopped") {
        return { result: false, reason: "停止中(stopped)以外の状態" };
    }
    try {
        yield rds.startDBInstance({ DBInstanceIdentifier: identifier }).promise();
        return { result: true, reason: "OK" };
    }
    catch (e) {
        return { result: false, reason: e };
    }
});
