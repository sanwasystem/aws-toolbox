interface Parameter {
    Marker?: string;
}
interface CallbackResult {
    Marker?: string;
}
interface CallbackPromise<T> {
    promise: () => Promise<T>;
}
declare type Callback<T, P> = (parameter: P) => CallbackPromise<T>;
/**
 * パラメーターと戻り値にMarker(stringまたはundefined)を含むリストアップ関数を繰り返し実行する。
 * for await構文でイテレートできる
 * @param parentClassInstance AWS SDKクラスのインスタンス
 * @param callback 実行するメソッド
 * @param parameter パラメーター
 */
export declare function execAwsIteration<T extends CallbackResult, P extends Parameter>(parentClassInstance: unknown, callback: Callback<T, P>, parameter: P): AsyncGenerator<T, void, unknown>;
export {};
