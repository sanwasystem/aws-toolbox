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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const get = __importStar(require("./getInstance"));
/**
 * EC2インスタンスの状態コード
 */
var StatusCode;
(function (StatusCode) {
    /**
     * 起動している状態
     */
    StatusCode[StatusCode["RUNNING"] = 16] = "RUNNING";
    /**
     * 停止している状態
     */
    StatusCode[StatusCode["STOPPED"] = 80] = "STOPPED";
    /**
     * 起動処理が進んでいる状態
     */
    StatusCode[StatusCode["PENDING"] = 0] = "PENDING";
    /**
     * 終了（削除）処理が進んでいる状態
     */
    StatusCode[StatusCode["SHUTTINGDOWN"] = 32] = "SHUTTINGDOWN";
    /**
     * 停止処理が進んでいる段階
     */
    StatusCode[StatusCode["STOPPING"] = 64] = "STOPPING";
})(StatusCode || (StatusCode = {}));
/**
 * 指定したインスタンスの状態が指定した値になるまで待つ。
 * インスタンスの状態チェックに失敗した場合、指定した回数チェックしても指定した状態にならなかったら失敗。
 * @param ec2
 * @param instanceId インスタンスID
 * @param desiredStates 目的とするステータスコード
 * @param intervalInSec 何秒おきにチェックするか
 * @param maxWaitTimeInSec 待つ最大時間
 */
const waitInstanceStateTransition = (ec2, instanceId, desiredStates, intervalInSec = 2, maxWaitTimeInSec = 10) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${instanceId}の状態を${intervalInSec}秒ごと、最大${maxWaitTimeInSec}秒までチェックします`);
        const until = new Date().getTime() + maxWaitTimeInSec * 1000;
        if (typeof desiredStates === "number") {
            desiredStates = [desiredStates];
        }
        const maxCount = Math.max(Math.floor(maxWaitTimeInSec / intervalInSec), 1);
        const sleep = (sec) => __awaiter(void 0, void 0, void 0, function* () { return new Promise(resolve => setTimeout(resolve, sec * 1000)); });
        let instance = yield get.getInstanceById2(ec2, instanceId);
        for (let i = 1; i <= maxCount; i++) {
            console.log(`チェック${i}回目...`);
            console.log(`current state: ${instance.State.Code}, desired state(s): ${desiredStates.join("|")}`);
            if (desiredStates.includes(instance.State.Code)) {
                return ["ok", instance];
            }
            if (new Date().getTime() < until) {
                yield sleep(intervalInSec);
            }
            instance = yield get.getInstanceById2(ec2, instanceId);
        }
        console.log("指定した時間内に状態は変わりませんでした");
        return ["timeout", instance];
    }
    catch (e) {
        return ["error", null];
    }
});
/**
 * インスタンスを起動または停止して、状態が変わるのを待つ。
 * 事前に状態のチェックを行っていて起動・停止処理を進めて良いことが分かっていることが前提。
 * @param ec2
 * @param instanceId
 * @param startStop
 * @param intervalInSec
 * @param maxWaitTimeInSec
 */
const _startStop = (ec2, instanceId, startStop, intervalInSec = 2, maxWaitTimeInSec = 10) => __awaiter(void 0, void 0, void 0, function* () {
    let desiredState = [];
    if (startStop === "START") {
        yield ec2.startInstances({ InstanceIds: [instanceId] }).promise();
        desiredState = [StatusCode.RUNNING, StatusCode.PENDING];
    }
    else {
        yield ec2.stopInstances({ InstanceIds: [instanceId] }).promise();
        desiredState = [StatusCode.STOPPED, StatusCode.STOPPING];
    }
    const result = yield waitInstanceStateTransition(ec2, instanceId, desiredState, intervalInSec, maxWaitTimeInSec);
    switch (result[0]) {
        case "error":
            return ["error", "Instance state check failed"];
        case "ok":
            return ["ok", "ok"];
        case "timeout":
            return ["timeout", `state is ${result[1].State.Code} after ${maxWaitTimeInSec} seconds`];
        default:
            throw new Error();
    }
});
/**
 * EC2インスタンスを起動または停止し、状態が変わるのを待つ。
 * @param ec2
 * @param instanceId
 * @param startStop
 * @param intervalInSec
 * @param maxWaitTimeInSec
 */
exports.startStopInstance = (ec2, instanceId, startStop, intervalInSec = 2, maxWaitTimeInSec = 10) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`EC2ID: ${instanceId}, action: ${startStop}, interval: ${intervalInSec}sec, maxWaitTime: ${maxWaitTimeInSec}sec`);
    try {
        const instance = yield get.getInstanceById(ec2, instanceId);
        if (!instance) {
            return ["error", `instance ${instanceId} not found`];
        }
        if (startStop === "START") {
            // 「起動」が指定された場合、「停止」のときだけ処理を行う
            switch (instance.State.Code) {
                case StatusCode.STOPPED:
                    return _startStop(ec2, instanceId, startStop, intervalInSec, maxWaitTimeInSec);
                case StatusCode.PENDING:
                    return ["nothingToDo", "already pending"];
                case StatusCode.RUNNING:
                    return ["nothingToDo", "already running"];
                default:
                    return ["skip", `state is not ${StatusCode.RUNNING} nor ${StatusCode.STOPPED}`];
            }
        }
        else {
            // 「停止」が指定された場合、「起動中」のときだけ処理を行う
            switch (instance.State.Code) {
                case StatusCode.RUNNING:
                    return _startStop(ec2, instanceId, startStop, intervalInSec, maxWaitTimeInSec);
                case StatusCode.STOPPED:
                    return ["nothingToDo", "already stopped"];
                case StatusCode.STOPPING:
                    return ["nothingToDo", "already stopping"];
                default:
                    return ["skip", `state is not ${StatusCode.RUNNING}, ${StatusCode.STOPPING} nor ${StatusCode.STOPPED}`];
            }
        }
    }
    catch (e) {
        return ["error", e.toString()];
    }
});
/**
 * EC2インスタンスを起動し、状態が変わるのを待つ。
 * @param ec2
 * @param instanceId
 * @param startStop
 * @param intervalInSec
 * @param maxWaitTimeInSec
 */
exports.startInstance = (ec2, instanceId, intervalInSec = 2, maxWaitTimeInSec = 10) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.startStopInstance(ec2, instanceId, "START", intervalInSec, maxWaitTimeInSec);
});
/**
 * EC2インスタンスを起動し、状態が変わるのを待つ。
 * @param ec2
 * @param instanceId
 * @param startStop
 * @param intervalInSec
 * @param maxWaitTimeInSec
 */
exports.stopInstance = (ec2, instanceId, intervalInSec = 2, maxWaitTimeInSec = 10) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.startStopInstance(ec2, instanceId, "STOP", intervalInSec, maxWaitTimeInSec);
});
