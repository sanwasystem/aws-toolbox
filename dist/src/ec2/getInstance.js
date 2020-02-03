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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getTag_1 = __importDefault(require("../getTag"));
const nativeEc2IntoMyEC2Instance = (instance) => {
    var _a, _b;
    // タグを扱いやすくする
    const tagDic = {};
    const tags = [];
    if (instance.Tags) {
        for (const tag of instance.Tags) {
            const Key = (_a = tag.Key, (_a !== null && _a !== void 0 ? _a : ""));
            const Value = (_b = tag.Value, (_b !== null && _b !== void 0 ? _b : ""));
            tagDic[Key] = Value;
            tags.push({ Key, Value });
        }
    }
    // stateを扱いやすくする
    const state = {
        Code: !instance.State || instance.State.Code === undefined ? -1 : instance.State.Code,
        Name: !instance.State || instance.State.Name === undefined ? "unknown" : instance.State.Name
    };
    // BlockDeviceMappingsを扱いやすくする
    const blockDeviceMapping = (instance.BlockDeviceMappings || []).map(x => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            DeviceName: (_a = x.DeviceName, (_a !== null && _a !== void 0 ? _a : "")),
            Ebs: {
                AttachTime: (_c = (_b = x.Ebs) === null || _b === void 0 ? void 0 : _b.AttachTime, (_c !== null && _c !== void 0 ? _c : new Date("2000-01-01"))),
                DeleteOnTermination: (_e = (_d = x.Ebs) === null || _d === void 0 ? void 0 : _d.DeleteOnTermination, (_e !== null && _e !== void 0 ? _e : true)),
                Status: (_g = (_f = x.Ebs) === null || _f === void 0 ? void 0 : _f.Status, (_g !== null && _g !== void 0 ? _g : "")),
                VolumeId: (_j = (_h = x.Ebs) === null || _h === void 0 ? void 0 : _h.VolumeId, (_j !== null && _j !== void 0 ? _j : ""))
            }
        };
    });
    const result = {
        InstanceId: instance.InstanceId || "?",
        InstanceType: instance.InstanceType || "",
        State: state,
        VpcId: instance.VpcId || "",
        BlockDeviceMappings: blockDeviceMapping,
        SecurityGroups: instance.SecurityGroups || [],
        SubnetId: instance.SubnetId || "",
        Tags: tags,
        Tag: tagDic,
        NameTag: getTag_1.default(instance.Tags, "Name"),
        DescriptionTag: getTag_1.default(instance.Tags, "Description"),
        isDetailedMonitoringEnabled: !!instance.Monitoring && instance.Monitoring.State === "enabled",
        IsRunning: !!instance.State && instance.State.Name === "running",
        IpAddress: instance.PublicIpAddress || instance.PrivateIpAddress || ""
    };
    return Object.assign(Object.assign({}, instance), result);
};
/**
 * すべてのEC2インスタンスを取得する
 * @param ec2
 */
exports.getAllInstances = (ec2) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    let nextToken = undefined;
    // tslint:disable-next-line: no-constant-condition
    while (true) {
        const raw = yield ec2
            .describeInstances({ MaxResults: 10, NextToken: nextToken })
            .promise();
        if (Array.isArray(raw.Reservations)) {
            for (const reservation of raw.Reservations) {
                if (Array.isArray(reservation.Instances)) {
                    for (const instance of reservation.Instances) {
                        result.push(nativeEc2IntoMyEC2Instance(instance));
                    }
                }
            }
        }
        if (raw.NextToken) {
            nextToken = raw.NextToken;
        }
        else {
            break;
        }
    }
    return result;
});
/**
 * EC2インスタンスを取得する。インスタンスが見つからなかった場合はnullを返す。
 * それ以外のエラーが発生した場合は例外をそのままスローする
 * @param ec2
 * @param instanceId
 */
exports.getInstanceById = (ec2, instanceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const raw = yield ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
        if (!Array.isArray(raw.Reservations) ||
            raw.Reservations.length === 0 ||
            !Array.isArray(raw.Reservations[0].Instances) ||
            raw.Reservations[0].Instances.length === 0) {
            // こういうことは普通ない
            return null;
        }
        const result = raw.Reservations[0].Instances[0];
        return nativeEc2IntoMyEC2Instance(result);
    }
    catch (e) {
        if (e.toString().indexOf("InvalidInstanceID.NotFound:") >= 0) {
            console.log("インスタンスが見つかりませんでした");
            return null;
        }
        throw e;
    }
});
/**
 * EC2インスタンスを取得する。インスタンスが見つからない場合も含め、何かエラーが発生した場合は例外をスローする
 * @param ec2
 * @param instanceId
 */
exports.getInstanceById2 = (ec2, instanceId) => __awaiter(void 0, void 0, void 0, function* () {
    const instance = yield exports.getInstanceById(ec2, instanceId);
    if (!instance) {
        throw new Error(`Instance ${instanceId} not found`);
    }
    return instance;
});
