import * as AWS from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import * as types from "./types";
import * as dTypes from "./dynamicTypes";

type CloudWatchDescribeAlarmsResult = PromiseResult<
  AWS.CloudWatch.DescribeAlarmsOutput,
  AWS.AWSError
>;

export type MetricAlarm = types.MetricAlarm;

export type NamespaceAndMetricName = dTypes.NamespaceAndMetricName;
export const isNamespaceAndMetricNames = dTypes.isNamespaceAndMetricNames;

export type Namespace = dTypes.Namespace;
export const _Namespace = dTypes._Namespace;
export const isNamespace = dTypes.isNamespace;


export type MetricName = dTypes.MetricName;
export const _MetricNames = dTypes._MetricName;
export const isMetricName = dTypes.isMetricName;

const nativeAlarmToAlarm = (
  alarm: AWS.CloudWatch.MetricAlarm
): types.MetricAlarm => {
  const result = {
    AlarmName: alarm.AlarmName || "",
    AlarmArn: alarm.AlarmArn || "",
    AlarmDescription: alarm.AlarmDescription || "",
    ActionsEnabled: !!alarm.ActionsEnabled,
    OKActions: alarm.OKActions || [],
    AlarmActions: alarm.AlarmActions || [],
    InsufficientDataActions: alarm.InsufficientDataActions || [],

    Dimensions: alarm.Dimensions || [],
    Namespace: alarm.Namespace || "",
    // tslint:disable-next-line: prefer-type-cast
    _Namespace: alarm.Namespace as Namespace | string
  };

  return { ...alarm, ...result };
};

export const getAllAlarms = async (
  cw: AWS.CloudWatch
): Promise<types.MetricAlarm[]> => {
  const result: types.MetricAlarm[] = [];
  let nextToken: string | undefined = undefined;

  // tslint:disable-next-line: no-constant-condition
  while (true) {
    const alarms: CloudWatchDescribeAlarmsResult = await cw
      .describeAlarms({ MaxRecords: 10, NextToken: nextToken })
      .promise();
    if (Array.isArray(alarms.MetricAlarms)) {
      for (const alarm of alarms.MetricAlarms) {
        result.push(nativeAlarmToAlarm(alarm));
      }
    }
    if (alarms.NextToken) {
      nextToken = alarms.NextToken;
    } else {
      break;
    }
  }

  return result;
};
