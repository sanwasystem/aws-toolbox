import * as AWS from "aws-sdk";
import * as Types from "./types";
import * as get from "./getInstance";

/**
 * EC2インスタンスの状態コード
 */
enum StatusCode {
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

type WaitInstanceStateTransitionType = ["ok" | "timeout", Types.Instance] | ["error", null];

/**
 * 指定したインスタンスの状態が指定した値になるまで待つ。
 * インスタンスの状態チェックに失敗した場合、指定した回数チェックしても指定した状態にならなかったら失敗。
 * @param ec2
 * @param instanceId インスタンスID
 * @param desiredStates 目的とするステータスコード
 * @param intervalInSec 何秒おきにチェックするか
 * @param maxWaitTimeInSec 待つ最大時間
 */
const waitInstanceStateTransition = async (
  ec2: AWS.EC2,
  instanceId: string,
  desiredStates: number | number[],
  intervalInSec = 2,
  maxWaitTimeInSec = 10
): Promise<WaitInstanceStateTransitionType> => {
  try {
    console.log(`${instanceId}の状態を${intervalInSec}秒ごと、最大${maxWaitTimeInSec}秒までチェックします`);
    const until = new Date().getTime() + maxWaitTimeInSec * 1000;
    if (typeof desiredStates === "number") {
      desiredStates = [desiredStates];
    }

    const maxCount = Math.max(Math.floor(maxWaitTimeInSec / intervalInSec), 1);
    const sleep = async (sec: number) => new Promise(resolve => setTimeout(resolve, sec * 1000));
    let instance = await get.getInstanceById2(ec2, instanceId);
    for (let i = 1; i <= maxCount; i++) {
      console.log(`チェック${i}回目...`);
      console.log(`current state: ${instance.State.Code}, desired state(s): ${desiredStates.join("|")}`);
      if (desiredStates.includes(instance.State.Code)) {
        return ["ok", instance];
      }
      if (new Date().getTime() < until) {
        await sleep(intervalInSec);
      }
      instance = await get.getInstanceById2(ec2, instanceId);
    }

    console.log("指定した時間内に状態は変わりませんでした");
    return ["timeout", instance];
  } catch (e) {
    return ["error", null];
  }
};

type StartStopResultType = [
  /**
   * ok: 起動・停止処理が正常に完了した
   * error: インスタンス取得処理に失敗した
   * timeout: 一定時間が過ぎても状態が変わらなかった
   * nothingToDo: 既に起動・停止していたため何もしなかった
   * skip: 他の操作と競合する可能性があるため何もしなかった
   */
  "ok" | "error" | "timeout" | "nothingToDo" | "skip",
  string
];

/**
 * インスタンスを起動または停止して、状態が変わるのを待つ。
 * 事前に状態のチェックを行っていて起動・停止処理を進めて良いことが分かっていることが前提。
 * @param ec2
 * @param instanceId
 * @param startStop
 * @param intervalInSec
 * @param maxWaitTimeInSec
 */
const _startStop = async (
  ec2: AWS.EC2,
  instanceId: string,
  startStop: "START" | "STOP",
  intervalInSec = 2,
  maxWaitTimeInSec = 10
): Promise<StartStopResultType> => {
  let desiredState: number[] = [];
  if (startStop === "START") {
    await ec2.startInstances({ InstanceIds: [instanceId] }).promise();
    desiredState = [StatusCode.RUNNING, StatusCode.PENDING];
  } else {
    await ec2.stopInstances({ InstanceIds: [instanceId] }).promise();
    desiredState = [StatusCode.STOPPED, StatusCode.STOPPING];
  }

  const result = await waitInstanceStateTransition(ec2, instanceId, desiredState, intervalInSec, maxWaitTimeInSec);

  switch (result[0]) {
    case "error":
      return ["error", "Instance state check failed"];
    case "ok":
      return ["ok", "ok"];
    case "timeout":
      return ["timeout", `state is ${result[1].State.Code} after ${maxWaitTimeInSec} seconds`];
    default:
      throw new Error();
  }
};

/**
 * EC2インスタンスを起動または停止し、状態が変わるのを待つ。
 * @param ec2 
 * @param instanceId 
 * @param startStop 
 * @param intervalInSec 
 * @param maxWaitTimeInSec 
 */
export const startStopInstance = async (
  ec2: AWS.EC2,
  instanceId: string,
  startStop: "START" | "STOP",
  intervalInSec = 2,
  maxWaitTimeInSec = 10
): Promise<StartStopResultType> => {
  console.log(`EC2ID: ${instanceId}, action: ${startStop}, interval: ${intervalInSec}sec, maxWaitTime: ${maxWaitTimeInSec}sec`);
  try {
    const instance = await get.getInstanceById(ec2, instanceId);
    if (!instance) {
      return ["error", `instance ${instanceId} not found`];
    }

    if (startStop === "START") {
      // 「起動」が指定された場合、「停止」のときだけ処理を行う
      switch (instance.State.Code) {
        case StatusCode.STOPPED:
          return _startStop(ec2, instanceId, startStop, intervalInSec, maxWaitTimeInSec);

        case StatusCode.PENDING:
          return ["nothingToDo", "already pending"];

        case StatusCode.RUNNING:
          return ["nothingToDo", "already running"];

        default:
          return ["skip", `state is not ${StatusCode.RUNNING} nor ${StatusCode.STOPPED}`];
      }
    } else {
      // 「停止」が指定された場合、「起動中」のときだけ処理を行う
      switch (instance.State.Code) {
        case StatusCode.RUNNING:
          return _startStop(ec2, instanceId, startStop, intervalInSec, maxWaitTimeInSec);

        case StatusCode.STOPPED:
          return ["nothingToDo", "already stopped"];

        case StatusCode.STOPPING:
          return ["nothingToDo", "already stopping"];
  
        default:
          return ["skip", `state is not ${StatusCode.RUNNING}, ${StatusCode.STOPPING} nor ${StatusCode.STOPPED}`];
      }
    }
  } catch (e) {
    return ["error", e.toString()];
  }
};


/**
 * EC2インスタンスを起動し、状態が変わるのを待つ。
 * @param ec2 
 * @param instanceId 
 * @param startStop 
 * @param intervalInSec 
 * @param maxWaitTimeInSec 
 */
export const startInstance = async (
  ec2: AWS.EC2,
  instanceId: string,
  intervalInSec = 2,
  maxWaitTimeInSec = 10
): Promise<StartStopResultType> => {
  return startStopInstance(ec2, instanceId, "START", intervalInSec, maxWaitTimeInSec);
}

/**
 * EC2インスタンスを起動し、状態が変わるのを待つ。
 * @param ec2 
 * @param instanceId 
 * @param startStop 
 * @param intervalInSec 
 * @param maxWaitTimeInSec 
 */
export const stopInstance = async (
  ec2: AWS.EC2,
  instanceId: string,
  intervalInSec = 2,
  maxWaitTimeInSec = 10
): Promise<StartStopResultType> => {
  return startStopInstance(ec2, instanceId, "STOP", intervalInSec, maxWaitTimeInSec);
}

