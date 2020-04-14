import * as AWS from "aws-sdk";
import * as internal from "./internal";

/**
 * 存在する全てのポリシーを返す
 */
export const describeAllPolicies = async (
  iam: AWS.IAM,
  options?: {
    OnlyAttached?: boolean;
    PathPrefix?: string;
    PolicyUsageFilter?: string;
    Scope?: string;
  }
): Promise<AWS.IAM.Policy[]> => {
  const params: AWS.IAM.ListPoliciesRequest = {
    MaxItems: 100,
    OnlyAttached: !!options?.OnlyAttached,
  };
  if (options?.PathPrefix) {
    options.PathPrefix = options.PathPrefix;
  }
  if (options?.PolicyUsageFilter) {
    options.PolicyUsageFilter = options.PolicyUsageFilter;
  }
  if (options?.Scope) {
    options.Scope = options.Scope;
  }

  const result: AWS.IAM.Policy[][] = [];
  const iterator = internal.execAwsIteration<
    AWS.IAM.ListPoliciesResponse,
    AWS.IAM.ListPoliciesRequest
  >(iam, iam.listPolicies, params);

  for await (const chunk of iterator) {
    result.push(chunk.Policies ?? []);
  }

  return result.flat();
};

type ListEntitiesForPolicyResultType = {
  policyGroups: AWS.IAM.PolicyGroup[];
  policyRoles: AWS.IAM.PolicyRole[];
  policyUsers: AWS.IAM.PolicyUser[];
};

/**
 * 特定のロールがアタッチされているグループ・ロール・ユーザーを返す
 * @param iam
 * @param policyArn
 * @param options
 */
export const listEntitiesForPolicy = async (
  iam: AWS.IAM,
  policyArn: string,
  options?: {
    EntityFilter?:
      | "User"
      | "Role"
      | "Group"
      | "LocalManagedPolicy"
      | "AWSManagedPolicy"
      | string;
    PathPrefix?: string;
    PolicyUsageFilter?: "PermissionsPolicy" | "PermissionsBoundary" | string;
  }
): Promise<ListEntitiesForPolicyResultType> => {
  const params: AWS.IAM.ListEntitiesForPolicyRequest = {
    PolicyArn: policyArn,
    MaxItems: 100,
  };
  if (options?.EntityFilter) {
    params.EntityFilter = options.EntityFilter;
  }
  if (options?.PathPrefix) {
    params.PathPrefix = options.PathPrefix;
  }
  if (options?.PolicyUsageFilter) {
    params.PolicyUsageFilter = options.PolicyUsageFilter;
  }

  const iterator = internal.execAwsIteration<
    AWS.IAM.ListEntitiesForPolicyResponse,
    AWS.IAM.ListEntitiesForPolicyRequest
  >(iam, iam.listEntitiesForPolicy, params);

  const policyGroups: AWS.IAM.PolicyGroup[][] = [];
  const policyRoles: AWS.IAM.PolicyRole[][] = [];
  const policyUsers: AWS.IAM.PolicyUser[][] = [];

  for await (const chunk of iterator) {
    policyGroups.push(chunk.PolicyGroups ?? []);
    policyRoles.push(chunk.PolicyRoles ?? []);
    policyUsers.push(chunk.PolicyUsers ?? []);
  }

  return {
    policyGroups: policyGroups.flat(),
    policyRoles: policyRoles.flat(),
    policyUsers: policyUsers.flat(),
  };
};
