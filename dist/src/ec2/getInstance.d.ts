import * as AWS from "aws-sdk";
import * as Types from "./types";
/**
 * すべてのEC2インスタンスを取得する
 * @param ec2
 */
export declare const getAllInstances: (ec2: AWS.EC2) => Promise<Types.Instance[]>;
/**
 * EC2インスタンスを取得する。インスタンスが見つからなかった場合はnullを返す。
 * それ以外のエラーが発生した場合は例外をそのままスローする
 * @param ec2
 * @param instanceId
 */
export declare const getInstanceById: (ec2: AWS.EC2, instanceId: string) => Promise<Types.Instance | null>;
/**
 * EC2インスタンスを取得する。インスタンスが見つからない場合も含め、何かエラーが発生した場合は例外をスローする
 * @param ec2
 * @param instanceId
 */
export declare const getInstanceById2: (ec2: AWS.EC2, instanceId: string) => Promise<Types.Instance>;
