import { PromiseResult } from "aws-sdk/lib/request";
export declare type EC2DescribeInstancesResult = PromiseResult<AWS.EC2.DescribeInstancesResult, AWS.AWSError>;
export declare type EbsInstanceBlockDevice = Required<AWS.EC2.EbsInstanceBlockDevice>;
export declare type InstanceBlockDeviceMapping = {
    /**
     * The device name (for example, /dev/sdh or xvdh).
     */
    DeviceName: string;
    /**
     * Parameters used to automatically set up EBS volumes when the instance is launched.
     */
    Ebs: EbsInstanceBlockDevice;
};
/**
 * AWS SDKのAWS.EC2.Instanceを少し使いやすくしたもの
 */
export interface Instance extends AWS.EC2.Instance {
    InstanceId: string;
    InstanceType: string;
    State: Required<AWS.EC2.InstanceState>;
    VpcId: string;
    BlockDeviceMappings: Required<InstanceBlockDeviceMapping>[];
    SecurityGroups: AWS.EC2.GroupIdentifierList;
    SubnetId: string;
    Tags: Required<AWS.EC2.Tag>[];
    Tag: {
        [key: string]: string;
    };
    NameTag: string;
    DescriptionTag: string;
    isDetailedMonitoringEnabled: boolean;
    IsRunning: boolean;
    IpAddress: string;
}
