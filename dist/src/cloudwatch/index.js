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
const dTypes = __importStar(require("./dynamicTypes"));
exports.isNamespaceAndMetricNames = dTypes.isNamespaceAndMetricNames;
exports._Namespace = dTypes._Namespace;
exports.isNamespace = dTypes.isNamespace;
exports._MetricNames = dTypes._MetricName;
exports.isMetricName = dTypes.isMetricName;
const nativeAlarmToAlarm = (alarm) => {
    const result = {
        AlarmName: alarm.AlarmName || "",
        AlarmArn: alarm.AlarmArn || "",
        AlarmDescription: alarm.AlarmDescription || "",
        ActionsEnabled: !!alarm.ActionsEnabled,
        OKActions: alarm.OKActions || [],
        AlarmActions: alarm.AlarmActions || [],
        InsufficientDataActions: alarm.InsufficientDataActions || [],
        Dimensions: alarm.Dimensions || [],
        Namespace: alarm.Namespace || "",
        // tslint:disable-next-line: prefer-type-cast
        _Namespace: alarm.Namespace
    };
    return Object.assign(Object.assign({}, alarm), result);
};
exports.getAllAlarms = (cw) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    let nextToken = undefined;
    // tslint:disable-next-line: no-constant-condition
    while (true) {
        const alarms = yield cw
            .describeAlarms({ MaxRecords: 10, NextToken: nextToken })
            .promise();
        if (Array.isArray(alarms.MetricAlarms)) {
            for (const alarm of alarms.MetricAlarms) {
                result.push(nativeAlarmToAlarm(alarm));
            }
        }
        if (alarms.NextToken) {
            nextToken = alarms.NextToken;
        }
        else {
            break;
        }
    }
    return result;
});
