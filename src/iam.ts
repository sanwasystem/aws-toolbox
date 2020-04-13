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
  const result: AWS.IAM.Policy[][] = [];
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

  const iterator = internal.execAwsIteration<AWS.IAM.ListPoliciesResponse>(
    iam,
    iam.listPolicies,
    params
  );

  for await (const chunk of iterator) {
    result.push(chunk.Policies ?? []);
  }

  return result.flat();
};
