import * as AWS from "aws-sdk";
import * as Types from "./types";
import getTag from "../getTag";

const nativeEc2IntoMyEC2Instance = (instance: AWS.EC2.Instance): Types.Instance => {
    // タグを扱いやすくする
    const tagDic: { [key: string]: string } = {};
    const tags: Required<AWS.EC2.Tag>[] = [];
    if (instance.Tags) {
      for (const tag of instance.Tags) {
        const Key = tag.Key ?? "";
        const Value = tag.Value ?? "";
        tagDic[Key] = Value;
        tags.push({ Key, Value });
      }
    }
  
    // stateを扱いやすくする
    const state: Required<AWS.EC2.InstanceState> = {
      Code: !instance.State || instance.State.Code === undefined ? -1 : instance.State.Code,
      Name: !instance.State || instance.State.Name === undefined ? "unknown" : instance.State.Name
    };
  
    // BlockDeviceMappingsを扱いやすくする
    const blockDeviceMapping: Types.InstanceBlockDeviceMapping[] = (instance.BlockDeviceMappings || []).map(x => {
      return {
        DeviceName: x.DeviceName ?? "",
        Ebs: {
          AttachTime: x.Ebs?.AttachTime ?? new Date("2000-01-01"),
          DeleteOnTermination: x.Ebs?.DeleteOnTermination ?? true,
          Status: x.Ebs?.Status ?? "",
          VolumeId: x.Ebs?.VolumeId ?? ""
        }
      };
    });
  
    const result = {
      InstanceId: instance.InstanceId || "?",
      InstanceType: instance.InstanceType || "",
      State: state,
      VpcId: instance.VpcId || "",
      BlockDeviceMappings: blockDeviceMapping,
      SecurityGroups: instance.SecurityGroups || [],
      SubnetId: instance.SubnetId || "",
      Tags: tags,
      Tag: tagDic,
      NameTag: getTag(instance.Tags, "Name"),
      DescriptionTag: getTag(instance.Tags, "Description"),
  
      isDetailedMonitoringEnabled: !!instance.Monitoring && instance.Monitoring.State === "enabled",
      IsRunning: !!instance.State && instance.State.Name === "running",
      IpAddress: instance.PublicIpAddress || instance.PrivateIpAddress || ""
    };
  
    return { ...instance, ...result };
  };
  
  /**
   * すべてのEC2インスタンスを取得する
   * @param ec2
   */
  export const getAllInstances = async (ec2: AWS.EC2) => {
    const result: Types.Instance[] = [];
    let nextToken: string | undefined = undefined;
  
    // tslint:disable-next-line: no-constant-condition
    while (true) {
      const raw: Types.EC2DescribeInstancesResult = await ec2
        .describeInstances({ MaxResults: 10, NextToken: nextToken })
        .promise();
      if (Array.isArray(raw.Reservations)) {
        for (const reservation of raw.Reservations) {
          if (Array.isArray(reservation.Instances)) {
            for (const instance of reservation.Instances) {
              result.push(nativeEc2IntoMyEC2Instance(instance));
            }
          }
        }
      }
      if (raw.NextToken) {
        nextToken = raw.NextToken;
      } else {
        break;
      }
    }
  
    return result;
  };
  
  /**
   * EC2インスタンスを取得する。インスタンスが見つからなかった場合はnullを返す。
   * それ以外のエラーが発生した場合は例外をそのままスローする
   * @param ec2
   * @param instanceId
   */
  export const getInstanceById = async (ec2: AWS.EC2, instanceId: string): Promise<Types.Instance | null> => {
    try {
      const raw: Types.EC2DescribeInstancesResult = await ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
  
      if (
        !Array.isArray(raw.Reservations) ||
        raw.Reservations.length === 0 ||
        !Array.isArray(raw.Reservations[0].Instances) ||
        raw.Reservations[0].Instances.length === 0
      ) {
        // こういうことは普通ない
        return null;
      }
      const result = raw.Reservations[0].Instances[0];
      return nativeEc2IntoMyEC2Instance(result);
    } catch (e) {
      if (e.toString().indexOf("InvalidInstanceID.NotFound:") >= 0) {
        console.log("インスタンスが見つかりませんでした");
        return null;
      }
      throw e;
    }
  };
  
  /**
   * EC2インスタンスを取得する。インスタンスが見つからない場合も含め、何かエラーが発生した場合は例外をスローする
   * @param ec2
   * @param instanceId
   */
  export const getInstanceById2 = async (ec2: AWS.EC2, instanceId: string): Promise<Types.Instance> => {
    const instance = await getInstanceById(ec2, instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }
    return instance;
  };
  