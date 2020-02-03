import * as AWS from "aws-sdk";
declare type StartStopResultType = [
/**
 * ok: 起動・停止処理が正常に完了した
 * error: インスタンス取得処理に失敗した
 * timeout: 一定時間が過ぎても状態が変わらなかった
 * nothingToDo: 既に起動・停止していたため何もしなかった
 * skip: 他の操作と競合する可能性があるため何もしなかった
 */
"ok" | "error" | "timeout" | "nothingToDo" | "skip", string];
/**
 * EC2インスタンスを起動または停止し、状態が変わるのを待つ。
 * @param ec2
 * @param instanceId
 * @param startStop
 * @param intervalInSec
 * @param maxWaitTimeInSec
 */
export declare const startStopInstance: (ec2: AWS.EC2, instanceId: string, startStop: "START" | "STOP", intervalInSec?: number, maxWaitTimeInSec?: number) => Promise<StartStopResultType>;
/**
 * EC2インスタンスを起動し、状態が変わるのを待つ。
 * @param ec2
 * @param instanceId
 * @param startStop
 * @param intervalInSec
 * @param maxWaitTimeInSec
 */
export declare const startInstance: (ec2: AWS.EC2, instanceId: string, intervalInSec?: number, maxWaitTimeInSec?: number) => Promise<StartStopResultType>;
/**
 * EC2インスタンスを起動し、状態が変わるのを待つ。
 * @param ec2
 * @param instanceId
 * @param startStop
 * @param intervalInSec
 * @param maxWaitTimeInSec
 */
export declare const stopInstance: (ec2: AWS.EC2, instanceId: string, intervalInSec?: number, maxWaitTimeInSec?: number) => Promise<StartStopResultType>;
export {};
