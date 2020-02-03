const __Namespace = {
    "AWS/EC2": "AWS/EC2",
    "AWS/ELB": "AWS/ELB",
    "AWS/RDS": "AWS/RDS",
    "AWS/DynamoDB": "AWS/DynamoDB"
};
export const _Namespace: Readonly<typeof __Namespace> = __Namespace;
export type Namespace = keyof (typeof _Namespace);
export const isNamespace = (arg: string): arg is Namespace => {
    return Object.keys(_Namespace).indexOf(arg) !== -1;
}

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
export const _MetricName: Readonly<typeof __MetricName> = __MetricName;
export type MetricName = keyof (typeof _MetricName);
export const isMetricName = (arg: string): arg is MetricName => {
    return Object.keys(_MetricName).indexOf(arg) !== -1;
}

/**
 * 許容されるNamespaceとMetricNameの組を定義する
 */
export type NamespaceAndMetricName =
    {Namespace: "AWS/EC2", MetricName: "CPUCreditBalance" | "CPUCreditUsage" | "CPUSurplusCreditBalance" | "CPUSurplusCreditsCharged" | "CPUUtilization" | "DiskReadBytes" | "DiskReadOps" | "DiskWriteBytes" | "DiskWriteOps" | "NetworkIn" | "NetworkOut" | "NetworkPacketsIn" | "NetworkPacketsOut" | "StatusCheckFailed" | "StatusCheckFailed_Instance" | "StatusCheckFailed_System"} |
    {Namespace: "AWS/ELB", MetricName: "HealthyHostCount"} |
    {Namespace: "AWS/RDS", MetricName: "CPUUtilization" | "FreeStorageSpace" | "DiskQueueDepth"} |
    {Namespace: "AWS/DynamoDB", MetricName: "ConsumedReadCapacityUnits" | "ConsumedWriteCapacityUnits"};

export const isNamespaceAndMetricNames = (arg: any): arg is NamespaceAndMetricName => {
    if (typeof(arg) !== "object") { return false; }
    if (arg.Namespace === "AWS/EC2" && ["CPUCreditBalance", "CPUCreditUsage", "CPUSurplusCreditBalance", "CPUSurplusCreditsCharged", "CPUUtilization", "DiskReadBytes", "DiskReadOps", "DiskWriteBytes", "DiskWriteOps", "NetworkIn", "NetworkOut", "NetworkPacketsIn", "NetworkPacketsOut", "StatusCheckFailed", "StatusCheckFailed_Instance", "StatusCheckFailed_System"].indexOf(arg.MetricName) !== -1) { return true; }
    if (arg.Namespace === "AWS/ELB" && ["HealthyHostCount"].indexOf(arg.MetricName) !== -1) { return true; }
    if (arg.Namespace === "AWS/RDS" && ["CPUUtilization", "FreeStorageSpace", "DiskQueueDepth"].indexOf(arg.MetricName) !== -1) { return true; }
    if (arg.Namespace === "AWS/DynamoDB" && ["ConsumedReadCapacityUnits", "ConsumedWriteCapacityUnits"].indexOf(arg.MetricName) !== -1) { return true; }
    return false;
};

