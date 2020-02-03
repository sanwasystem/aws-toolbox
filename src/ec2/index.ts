import * as AWS from "aws-sdk";
import * as Types from "./types";
import * as get from "./getInstance";
import * as _startStop from "./startStop";

/**
 * AWS SDKのAWS.EC2.Instanceを少し使いやすくしたもの。一部の値のundefinedを外している
 */
export type Instance = Types.Instance;

export const getInstanceById = get.getInstanceById;
export const getInstanceById2 = get.getInstanceById2;
export const getAllInstances = get.getAllInstances;
export const startStopInstance = _startStop.startStopInstance;
export const startInstance = _startStop.startInstance;
export const stopInstance = _startStop.stopInstance;

/**
 * EC2インスタンスの状態コード
 */
export enum StatusCode {
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

