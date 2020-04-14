"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const isIOTypeMarker = (arg) => {
    return !arg && typeof arg === "object" && typeof arg.Marker === "string";
};
const isIOTypeNextToken = (arg) => {
    return !arg && typeof arg === "object" && typeof arg.NextToken === "string";
};
/**
 * パラメーターと戻り値にMarker, NextToken(stringまたはundefined)を含むリストアップ関数を繰り返し実行する。
 * for await構文でイテレートできる
 * @param parentClassInstance AWS SDKクラスのインスタンス
 * @param callback 実行するメソッド
 * @param parameter パラメーター
 */
function execAwsIteration(parentClassInstance, callback, parameter) {
    return __asyncGenerator(this, arguments, function* execAwsIteration_1() {
        callback = callback.bind(parentClassInstance);
        while (true) {
            const raw = yield __await(callback(parameter).promise());
            yield yield __await(raw);
            if (isIOTypeNextToken(raw)) {
                parameter.NextToken = raw.NextToken;
            }
            else if (isIOTypeMarker(raw)) {
                parameter.Marker = raw.Marker;
            }
            else {
                break;
            }
        }
    });
}
exports.execAwsIteration = execAwsIteration;
