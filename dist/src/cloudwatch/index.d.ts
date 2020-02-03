import * as AWS from "aws-sdk";
import * as types from "./types";
import * as dTypes from "./dynamicTypes";
export declare type MetricAlarm = types.MetricAlarm;
export declare type NamespaceAndMetricName = dTypes.NamespaceAndMetricName;
export declare const isNamespaceAndMetricNames: (arg: any) => arg is dTypes.NamespaceAndMetricName;
export declare type Namespace = dTypes.Namespace;
export declare const _Namespace: Readonly<{
    "AWS/EC2": string;
    "AWS/ELB": string;
    "AWS/RDS": string;
    "AWS/DynamoDB": string;
}>;
export declare const isNamespace: (arg: string) => arg is "AWS/EC2" | "AWS/ELB" | "AWS/RDS" | "AWS/DynamoDB";
export declare type MetricName = dTypes.MetricName;
export declare const _MetricNames: Readonly<{
    "CPUCreditBalance": string;
    "CPUCreditUsage": string;
    "CPUSurplusCreditBalance": string;
    "CPUSurplusCreditsCharged": string;
    "CPUUtilization": string;
    "DiskReadBytes": string;
    "DiskReadOps": string;
    "DiskWriteBytes": string;
    "DiskWriteOps": string;
    "NetworkIn": string;
    "NetworkOut": string;
    "NetworkPacketsIn": string;
    "NetworkPacketsOut": string;
    "StatusCheckFailed": string;
    "StatusCheckFailed_Instance": string;
    "StatusCheckFailed_System": string;
    "HealthyHostCount": string;
    "FreeStorageSpace": string;
    "DiskQueueDepth": string;
    "ConsumedReadCapacityUnits": string;
    "ConsumedWriteCapacityUnits": string;
}>;
export declare const isMetricName: (arg: string) => arg is "CPUUtilization" | "NetworkIn" | "NetworkOut" | "StatusCheckFailed" | "StatusCheckFailed_Instance" | "StatusCheckFailed_System" | "HealthyHostCount" | "DiskQueueDepth" | "FreeStorageSpace" | "CPUCreditBalance" | "CPUCreditUsage" | "CPUSurplusCreditBalance" | "CPUSurplusCreditsCharged" | "DiskReadBytes" | "DiskReadOps" | "DiskWriteBytes" | "DiskWriteOps" | "NetworkPacketsIn" | "NetworkPacketsOut" | "ConsumedReadCapacityUnits" | "ConsumedWriteCapacityUnits";
export declare const getAllAlarms: (cw: AWS.CloudWatch) => Promise<types.MetricAlarm[]>;
