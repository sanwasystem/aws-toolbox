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
 * 名前でRDSインスタンスを1個取得する
 * @param rds
 * @param identifier
 */
export declare const getInstanceByIdentifier: (rds: AWS.RDS, identifier: string) => Promise<DBInstance | null>;
/**
 * すべてのDBインスタンスを取得する。エラー時はnullを返す
 * @param rds
 */
export declare const getAllInstances: (rds: AWS.RDS) => Promise<DBInstance[] | null>;
/**
 * RDSインスタンスを停止する
 * @param rds
 * @param identifier
 */
export declare const stopInstance: (rds: AWS.RDS, identifier: string) => Promise<{
    result: boolean;
    reason: string;
}>;
/**
 * RDSインスタンスを起動する
 * @param rds
 * @param identifier
 */
export declare const startInstance: (rds: AWS.RDS, identifier: string) => Promise<{
    result: boolean;
    reason: string;
}>;
