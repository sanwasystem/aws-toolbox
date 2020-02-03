import * as AWS from "aws-sdk";

/**
 * AWS.RDS.DBInstanceを使いやすくしたもの
 */
export interface DBInstance extends AWS.RDS.DBInstance {
  DBInstanceIdentifier: string;
  DBInstanceClass: string;
  DBInstanceArn: string;
  Tags: {
    Key: string;
    Value: string;
  }[];

  Tag: {
    [name: string]: string;
  };
}

/**
 * タグ情報を取得する
 * @param rds
 * @param arn RDSインスタンスのARN
 */
const getTag = async (rds: AWS.RDS, arn: string) => {
  try {
    const tagData = await rds.listTagsForResource({ ResourceName: arn }).promise();

    const tagArray: { Key: string; Value: string }[] = [];
    const tagDic: { [name: string]: string } = {};

    if (Array.isArray(tagData.TagList)) {
      for (const item of tagData.TagList) {
        tagDic[item.Key || ""] = item.Value || "";
        tagArray.push({ Key: item.Key || "", Value: item.Value || "" });
      }
    }
    return {
      Tags: tagArray,
      Tag: tagDic
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * 名前でRDSインスタンスを1個取得する
 * @param rds
 * @param identifier
 */
export const getInstanceByIdentifier = async (rds: AWS.RDS, identifier: string): Promise<DBInstance | null> => {
  try {
    const data = await rds.describeDBInstances({ DBInstanceIdentifier: identifier }).promise();
    if (!data.DBInstances) {
      return null;
    }

    const instance = data.DBInstances[0];
    const required = {
      DBInstanceIdentifier: instance.DBInstanceIdentifier || "",
      DBInstanceArn: instance.DBInstanceArn || "",
      DBInstanceClass: instance.DBInstanceClass || ""
    };

    const tag = await getTag(rds, instance.DBInstanceArn || "");
    if (tag === null) {
      return null;
    }

    return { ...instance, ...required, ...tag };
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * すべてのDBインスタンスを取得する。エラー時はnullを返す
 * @param rds
 */
export const getAllInstances = async (rds: AWS.RDS): Promise<DBInstance[] | null> => {
  const data = await rds.describeDBInstances().promise();
  if (!Array.isArray(data.DBInstances)) {
    return null;
  }

  const result: DBInstance[] = [];
  for (const instance of data.DBInstances) {
    const required = {
      DBInstanceIdentifier: instance.DBInstanceIdentifier || "",
      DBInstanceArn: instance.DBInstanceArn || "",
      DBInstanceClass: instance.DBInstanceClass || ""
    };

    const tag = await getTag(rds, instance.DBInstanceArn || "");
    if (tag === null) {
      return null;
    }
    result.push({
      ...instance,
      ...required,
      ...tag
    });
  }

  return result;
};

/**
 * RDSインスタンスを停止する
 * @param rds
 * @param identifier
 */
export const stopInstance = async (rds: AWS.RDS, identifier: string): Promise<{ result: boolean; reason: string }> => {
  const instance = await getInstanceByIdentifier(rds, name);
  if (instance === null) {
    return { result: false, reason: "DBインスタンスが見つからないか取得に失敗" };
  }

  if (instance.DBInstanceStatus === "stopped") {
    return { result: true, reason: "既に停止中" };
  }

  if (instance.DBInstanceStatus !== "available") {
    return { result: false, reason: "利用可能(available)以外の状態" };
  }

  try {
    await rds.stopDBInstance({ DBInstanceIdentifier: identifier }).promise();
    return { result: true, reason: "OK" };
  } catch (e) {
    return { result: false, reason: e };
  }
};

/**
 * RDSインスタンスを起動する
 * @param rds
 * @param identifier
 */
export const startInstance = async (rds: AWS.RDS, identifier: string): Promise<{ result: boolean; reason: string }> => {
  const instance = await getInstanceByIdentifier(rds, name);
  if (instance === null) {
    return { result: false, reason: "DBインスタンスが見つからないか取得に失敗" };
  }

  if (instance.DBInstanceStatus === "available") {
    return { result: true, reason: "既に起動中" };
  }

  if (instance.DBInstanceStatus !== "stopped") {
    return { result: false, reason: "停止中(stopped)以外の状態" };
  }

  try {
    await rds.startDBInstance({ DBInstanceIdentifier: identifier }).promise();
    return { result: true, reason: "OK" };
  } catch (e) {
    return { result: false, reason: e };
  }
};
