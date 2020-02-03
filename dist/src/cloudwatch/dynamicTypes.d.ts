declare const __Namespace: {
    "AWS/EC2": string;
    "AWS/ELB": string;
    "AWS/RDS": string;
    "AWS/DynamoDB": string;
};
export declare const _Namespace: Readonly<typeof __Namespace>;
export declare type Namespace = keyof (typeof _Namespace);
export declare const isNamespace: (arg: string) => arg is "AWS/EC2" | "AWS/ELB" | "AWS/RDS" | "AWS/DynamoDB";
declare const __MetricName: {
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
};
export declare const _MetricName: Readonly<typeof __MetricName>;
export declare type MetricName = keyof (typeof _MetricName);
export declare const isMetricName: (arg: string) => arg is "CPUUtilization" | "NetworkIn" | "NetworkOut" | "StatusCheckFailed" | "StatusCheckFailed_Instance" | "StatusCheckFailed_System" | "HealthyHostCount" | "DiskQueueDepth" | "FreeStorageSpace" | "CPUCreditBalance" | "CPUCreditUsage" | "CPUSurplusCreditBalance" | "CPUSurplusCreditsCharged" | "DiskReadBytes" | "DiskReadOps" | "DiskWriteBytes" | "DiskWriteOps" | "NetworkPacketsIn" | "NetworkPacketsOut" | "ConsumedReadCapacityUnits" | "ConsumedWriteCapacityUnits";
/**
 * 許容されるNamespaceとMetricNameの組を定義する
 */
export declare type NamespaceAndMetricName = {
    Namespace: "AWS/EC2";
    MetricName: "CPUCreditBalance" | "CPUCreditUsage" | "CPUSurplusCreditBalance" | "CPUSurplusCreditsCharged" | "CPUUtilization" | "DiskReadBytes" | "DiskReadOps" | "DiskWriteBytes" | "DiskWriteOps" | "NetworkIn" | "NetworkOut" | "NetworkPacketsIn" | "NetworkPacketsOut" | "StatusCheckFailed" | "StatusCheckFailed_Instance" | "StatusCheckFailed_System";
} | {
    Namespace: "AWS/ELB";
    MetricName: "HealthyHostCount";
} | {
    Namespace: "AWS/RDS";
    MetricName: "CPUUtilization" | "FreeStorageSpace" | "DiskQueueDepth";
} | {
    Namespace: "AWS/DynamoDB";
    MetricName: "ConsumedReadCapacityUnits" | "ConsumedWriteCapacityUnits";
};
export declare const isNamespaceAndMetricNames: (arg: any) => arg is NamespaceAndMetricName;
export {};
