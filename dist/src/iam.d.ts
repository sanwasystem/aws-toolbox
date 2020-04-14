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
declare type ListEntitiesForPolicyResultType = {
    policyGroups: Required<AWS.IAM.PolicyGroup>[];
    policyRoles: Required<AWS.IAM.PolicyRole>[];
    policyUsers: Required<AWS.IAM.PolicyUser>[];
};
/**
 * 特定のロールがアタッチされているグループ・ロール・ユーザーを返す
 * @param iam
 * @param policyArn
 * @param options
 */
export declare const listEntitiesForPolicy: (iam: AWS.IAM, policyArn: string, options?: {
    EntityFilter?: string | undefined;
    PathPrefix?: string | undefined;
    PolicyUsageFilter?: string | undefined;
} | undefined) => Promise<ListEntitiesForPolicyResultType>;
/**
 * 特定のポリシーをグループ・ロール・ユーザーからデタッチする
 * @param iam
 * @param policyArn
 * @param from デタッチする対象を指定する。ALLを指定すると全て
 */
export declare const detachPolicyFrom: (iam: AWS.IAM, policyArn: string, from?: ("ALL" | "GROUP" | "ROLE" | "USER")[]) => Promise<ListEntitiesForPolicyResultType>;
export {};
