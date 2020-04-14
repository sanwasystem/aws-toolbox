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
    const result = [];
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
/**
 * 特定のロールがアタッチされているグループ・ロール・ユーザーを返す
 * @param iam
 * @param policyArn
 * @param options
 */
exports.listEntitiesForPolicy = (iam, policyArn, options) => __awaiter(void 0, void 0, void 0, function* () {
    var e_2, _c;
    var _d, _e, _f;
    const params = {
        PolicyArn: policyArn,
        MaxItems: 100,
    };
    if (options === null || options === void 0 ? void 0 : options.EntityFilter) {
        params.EntityFilter = options.EntityFilter;
    }
    if (options === null || options === void 0 ? void 0 : options.PathPrefix) {
        params.PathPrefix = options.PathPrefix;
    }
    if (options === null || options === void 0 ? void 0 : options.PolicyUsageFilter) {
        params.PolicyUsageFilter = options.PolicyUsageFilter;
    }
    const iterator = internal.execAwsIteration(iam, iam.listEntitiesForPolicy, params);
    const policyGroups = [];
    const policyRoles = [];
    const policyUsers = [];
    try {
        for (var iterator_2 = __asyncValues(iterator), iterator_2_1; iterator_2_1 = yield iterator_2.next(), !iterator_2_1.done;) {
            const chunk = iterator_2_1.value;
            policyGroups.push(((_d = chunk.PolicyGroups) !== null && _d !== void 0 ? _d : []).map((x) => {
                var _a, _b;
                return {
                    GroupId: (_a = x.GroupId) !== null && _a !== void 0 ? _a : "",
                    GroupName: (_b = x.GroupName) !== null && _b !== void 0 ? _b : "",
                };
            }));
            policyRoles.push(((_e = chunk.PolicyRoles) !== null && _e !== void 0 ? _e : []).map((x) => {
                var _a, _b;
                return {
                    RoleId: (_a = x.RoleId) !== null && _a !== void 0 ? _a : "",
                    RoleName: (_b = x.RoleName) !== null && _b !== void 0 ? _b : "",
                };
            }));
            policyUsers.push(((_f = chunk.PolicyUsers) !== null && _f !== void 0 ? _f : []).map((x) => {
                var _a, _b;
                return {
                    UserId: (_a = x.UserId) !== null && _a !== void 0 ? _a : "",
                    UserName: (_b = x.UserName) !== null && _b !== void 0 ? _b : "",
                };
            }));
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (iterator_2_1 && !iterator_2_1.done && (_c = iterator_2.return)) yield _c.call(iterator_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return {
        policyGroups: policyGroups.flat(),
        policyRoles: policyRoles.flat(),
        policyUsers: policyUsers.flat(),
    };
});
/**
 * 特定のポリシーをグループ・ロール・ユーザーからデタッチする
 * @param iam
 * @param policyArn
 * @param from デタッチする対象を指定する。ALLを指定すると全て
 */
exports.detachPolicyFrom = (iam, policyArn, from = ["ALL"]) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {
        policyGroups: [],
        policyRoles: [],
        policyUsers: [],
    };
    try {
        const attachments = yield exports.listEntitiesForPolicy(iam, policyArn);
        if (from.includes("ALL") || from.includes("GROUP")) {
            for (const group of attachments.policyGroups) {
                yield iam
                    .detachGroupPolicy({
                    PolicyArn: policyArn,
                    GroupName: group.GroupName,
                })
                    .promise();
                result.policyGroups.push(group);
            }
        }
        if (from.includes("ALL") || from.includes("ROLE")) {
            for (const role of attachments.policyRoles) {
                yield iam
                    .detachRolePolicy({ PolicyArn: policyArn, RoleName: role.RoleName })
                    .promise();
                result.policyRoles.push(role);
            }
        }
        if (from.includes("ALL") || from.includes("USER")) {
            for (const user of attachments.policyUsers) {
                yield iam
                    .detachUserPolicy({ PolicyArn: policyArn, UserName: user.UserName })
                    .promise();
                result.policyUsers.push(user);
            }
        }
        return result;
    }
    catch (e) {
        console.error(e);
        console.error("detached:");
        console.error(result);
        throw e;
    }
});
