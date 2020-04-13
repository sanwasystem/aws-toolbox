import * as AWS from "aws-sdk";
/**
 * 存在する全てのポリシーを返す
 */
export declare const describeAllPolicies: (iam: AWS.IAM, options?: {
    OnlyAttached?: boolean | undefined;
    PathPrefix?: string | undefined;
    PolicyUsageFilter?: string | undefined;
    Scope?: string | undefined;
} | undefined) => Promise<AWS.IAM.Policy[]>;
