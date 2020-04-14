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

  const policyGroups: Required<AWS.IAM.PolicyGroup>[][] = [];
  const policyRoles: Required<AWS.IAM.PolicyRole>[][] = [];
  const policyUsers: Required<AWS.IAM.PolicyUser>[][] = [];

  for await (const chunk of iterator) {
    policyGroups.push(
      (chunk.PolicyGroups ?? []).map((x) => {
        return {
          GroupId: x.GroupId ?? "",
          GroupName: x.GroupName ?? "",
        };
      })
    );

    policyRoles.push(
      (chunk.PolicyRoles ?? []).map((x) => {
        return {
          RoleId: x.RoleId ?? "",
          RoleName: x.RoleName ?? "",
        };
      })
    );

    policyUsers.push(
      (chunk.PolicyUsers ?? []).map((x) => {
        return {
          UserId: x.UserId ?? "",
          UserName: x.UserName ?? "",
        };
      })
    );
  }

  return {
    policyGroups: policyGroups.flat(),
    policyRoles: policyRoles.flat(),
    policyUsers: policyUsers.flat(),
  };
};

/**
 * 特定のポリシーをグループ・ロール・ユーザーからデタッチする
 * @param iam
 * @param policyArn
 * @param from デタッチする対象を指定する。ALLを指定すると全て
 */
export const detachPolicyFrom = async (
  iam: AWS.IAM,
  policyArn: string,
  from: ("ALL" | "GROUP" | "ROLE" | "USER")[] = ["ALL"]
): Promise<ListEntitiesForPolicyResultType> => {
  const result: ListEntitiesForPolicyResultType = {
    policyGroups: [],
    policyRoles: [],
    policyUsers: [],
  };

  try {
    const attachments = await listEntitiesForPolicy(iam, policyArn);

    if (from.includes("ALL") || from.includes("GROUP")) {
      for (const group of attachments.policyGroups) {
        await iam
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
        await iam
          .detachRolePolicy({ PolicyArn: policyArn, RoleName: role.RoleName })
          .promise();
        result.policyRoles.push(role);
      }
    }

    if (from.includes("ALL") || from.includes("USER")) {
      for (const user of attachments.policyUsers) {
        await iam
          .detachUserPolicy({ PolicyArn: policyArn, UserName: user.UserName })
          .promise();
        result.policyUsers.push(user);
      }
    }

    return result;
  } catch (e) {
    console.error(e);
    console.error("detached:");
    console.error(result);
    throw e;
  }
};
