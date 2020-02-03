"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __Namespace = {
    "AWS/EC2": "AWS/EC2",
    "AWS/ELB": "AWS/ELB",
    "AWS/RDS": "AWS/RDS",
    "AWS/DynamoDB": "AWS/DynamoDB"
};
exports._Namespace = __Namespace;
exports.isNamespace = (arg) => {
    return Object.keys(exports._Namespace).indexOf(arg) !== -1;
};
const __MetricName = {
    "CPUCreditBalance": "CPUCreditBalance",
    "CPUCreditUsage": "CPUCreditUsage",
    "CPUSurplusCreditBalance": "CPUSurplusCreditBalance",
    "CPUSurplusCreditsCharged": "CPUSurplusCreditsCharged",
    "CPUUtilization": "CPUUtilization",
    "DiskReadBytes": "DiskReadBytes",
    "DiskReadOps": "DiskReadOps",
    "DiskWriteBytes": "DiskWriteBytes",
    "DiskWriteOps": "DiskWriteOps",
    "NetworkIn": "NetworkIn",
    "NetworkOut": "NetworkOut",
    "NetworkPacketsIn": "NetworkPacketsIn",
    "NetworkPacketsOut": "NetworkPacketsOut",
    "StatusCheckFailed": "StatusCheckFailed",
    "StatusCheckFailed_Instance": "StatusCheckFailed_Instance",
    "StatusCheckFailed_System": "StatusCheckFailed_System",
    "HealthyHostCount": "HealthyHostCount",
    "FreeStorageSpace": "FreeStorageSpace",
    "DiskQueueDepth": "DiskQueueDepth",
    "ConsumedReadCapacityUnits": "ConsumedReadCapacityUnits",
    "ConsumedWriteCapacityUnits": "ConsumedWriteCapacityUnits"
};
exports._MetricName = __MetricName;
exports.isMetricName = (arg) => {
    return Object.keys(exports._MetricName).indexOf(arg) !== -1;
};
exports.isNamespaceAndMetricNames = (arg) => {
    if (typeof (arg) !== "object") {
        return false;
    }
    if (arg.Namespace === "AWS/EC2" && ["CPUCreditBalance", "CPUCreditUsage", "CPUSurplusCreditBalance", "CPUSurplusCreditsCharged", "CPUUtilization", "DiskReadBytes", "DiskReadOps", "DiskWriteBytes", "DiskWriteOps", "NetworkIn", "NetworkOut", "NetworkPacketsIn", "NetworkPacketsOut", "StatusCheckFailed", "StatusCheckFailed_Instance", "StatusCheckFailed_System"].indexOf(arg.MetricName) !== -1) {
        return true;
    }
    if (arg.Namespace === "AWS/ELB" && ["HealthyHostCount"].indexOf(arg.MetricName) !== -1) {
        return true;
    }
    if (arg.Namespace === "AWS/RDS" && ["CPUUtilization", "FreeStorageSpace", "DiskQueueDepth"].indexOf(arg.MetricName) !== -1) {
        return true;
    }
    if (arg.Namespace === "AWS/DynamoDB" && ["ConsumedReadCapacityUnits", "ConsumedWriteCapacityUnits"].indexOf(arg.MetricName) !== -1) {
        return true;
    }
    return false;
};
