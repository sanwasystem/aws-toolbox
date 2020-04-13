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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const internal = __importStar(require("./internal"));
/**
 * 存在する全てのポリシーを返す
 */
exports.describeAllPolicies = (iam, options) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    var _b;
    const result = [];
    const params = {
        MaxItems: 100,
        OnlyAttached: !!(options === null || options === void 0 ? void 0 : options.OnlyAttached),
    };
    if (options === null || options === void 0 ? void 0 : options.PathPrefix) {
        options.PathPrefix = options.PathPrefix;
    }
    if (options === null || options === void 0 ? void 0 : options.PolicyUsageFilter) {
        options.PolicyUsageFilter = options.PolicyUsageFilter;
    }
    if (options === null || options === void 0 ? void 0 : options.Scope) {
        options.Scope = options.Scope;
    }
    const iterator = internal.execAwsIteration(iam, iam.listPolicies, params);
    try {
        for (var iterator_1 = __asyncValues(iterator), iterator_1_1; iterator_1_1 = yield iterator_1.next(), !iterator_1_1.done;) {
            const chunk = iterator_1_1.value;
            result.push((_b = chunk.Policies) !== null && _b !== void 0 ? _b : []);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (iterator_1_1 && !iterator_1_1.done && (_a = iterator_1.return)) yield _a.call(iterator_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result.flat();
});
