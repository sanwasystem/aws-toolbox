import * as Types from "./types";
/**
 * AWS SDKのAWS.EC2.Instanceを少し使いやすくしたもの。一部の値のundefinedを外している
 */
export declare type Instance = Types.Instance;
export declare const getInstanceById: (ec2: import("aws-sdk/clients/ec2"), instanceId: string) => Promise<Types.Instance | null>;
export declare const getInstanceById2: (ec2: import("aws-sdk/clients/ec2"), instanceId: string) => Promise<Types.Instance>;
export declare const getAllInstances: (ec2: import("aws-sdk/clients/ec2")) => Promise<Types.Instance[]>;
export declare const startStopInstance: (ec2: import("aws-sdk/clients/ec2"), instanceId: string, startStop: "START" | "STOP", intervalInSec?: number, maxWaitTimeInSec?: number) => Promise<["error" | "ok" | "timeout" | "nothingToDo" | "skip", string]>;
export declare const startInstance: (ec2: import("aws-sdk/clients/ec2"), instanceId: string, intervalInSec?: number, maxWaitTimeInSec?: number) => Promise<["error" | "ok" | "timeout" | "nothingToDo" | "skip", string]>;
export declare const stopInstance: (ec2: import("aws-sdk/clients/ec2"), instanceId: string, intervalInSec?: number, maxWaitTimeInSec?: number) => Promise<["error" | "ok" | "timeout" | "nothingToDo" | "skip", string]>;
/**
 * EC2で起動しているとき、そのインスタンスIDを返す。それ以外の環境の場合はundefinedを返す
 */
export declare const getRunningEc2Instance: () => string | undefined;
/**
 * EC2インスタンスの状態コード
 */
export declare enum StatusCode {
    /**
     * 起動している状態
     */
    RUNNING = 16,
    /**
     * 停止している状態
     */
    STOPPED = 80,
    /**
     * 起動処理が進んでいる状態
     */
    PENDING = 0,
    /**
     * 終了（削除）処理が進んでいる状態
     */
    SHUTTINGDOWN = 32,
    /**
     * 停止処理が進んでいる段階
     */
    STOPPING = 64
}
