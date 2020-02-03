"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const get = __importStar(require("./getInstance"));
const _startStop = __importStar(require("./startStop"));
exports.getInstanceById = get.getInstanceById;
exports.getInstanceById2 = get.getInstanceById2;
exports.getAllInstances = get.getAllInstances;
exports.startStopInstance = _startStop.startStopInstance;
exports.startInstance = _startStop.startInstance;
exports.stopInstance = _startStop.stopInstance;
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
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
