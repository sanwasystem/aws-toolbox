interface IOTypeMarker {
    Marker?: string;
}
interface IOTypeNextToken {
    NextToken?: string;
}
declare type IOType = IOTypeMarker | IOTypeNextToken;
interface CallbackPromise<T> {
    promise: () => Promise<T>;
}
declare type Callback<T, P> = (parameter: P) => CallbackPromise<T>;
/**
 * パラメーターと戻り値にMarker, NextToken(stringまたはundefined)を含むリストアップ関数を繰り返し実行する。
 * for await構文でイテレートできる
 * @param parentClassInstance AWS SDKクラスのインスタンス
 * @param callback 実行するメソッド
 * @param parameter パラメーター
 */
export declare function execAwsIteration<T extends IOType, P extends IOType>(parentClassInstance: unknown, callback: Callback<T, P>, parameter: P): AsyncGenerator<T, void, unknown>;
export {};
