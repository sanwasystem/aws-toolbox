import * as dTypes from "./dynamicTypes";

export interface MetricAlarm extends AWS.CloudWatch.MetricAlarm {
  /**
   * The name of the alarm.
   */
  AlarmName: string;
  /**
   * The Amazon Resource Name (ARN) of the alarm.
   */
  AlarmArn: string;
  /**
   * The description of the alarm.
   */
  AlarmDescription: string;
  /**
   * Indicates whether actions should be executed during any changes to the alarm state.
   */
  ActionsEnabled: boolean;
  /**
   * The dimensions for the metric associated with the alarm.
   */
  Dimensions: AWS.CloudWatch.Dimension[];
  /**
   * The actions to execute when this alarm transitions to the OK state from any other state. Each action is specified as an Amazon Resource Name (ARN).
   */
  OKActions: string[];
  /**
   * The actions to execute when this alarm transitions to the ALARM state from any other state. Each action is specified as an Amazon Resource Name (ARN).
   */
  AlarmActions: string[];
  /**
   * The actions to execute when this alarm transitions to the INSUFFICIENT_DATA state from any other state. Each action is specified as an Amazon Resource Name (ARN).
   */
  InsufficientDataActions: string[];

  /**
   * The namespace of the metric associated with the alarm.
   */
  Namespace: string;

  /**
   * The namespace of the metric associated with the alarm.
   */
  _Namespace: dTypes.Namespace | string;
}
