interface Parameter {
    Marker?: string;
}
interface CallbackResult {
    Marker?: string;
}
interface CallbackPromise<T> {
    promise: () => Promise<T>;
}
declare type Callback<T> = (parameter: Parameter) => CallbackPromise<T>;
/**
 * パラメーターと戻り値にMarker(stringまたはundefined)を含むリストアップ関数を繰り返し実行する。
 * for await構文でイテレートできる
 * @param parentClassInstance AWS SDKクラスのインスタンス
 * @param callback 実行するメソッド
 * @param parameter パラメーター
 */
export declare function execAwsIteration<T extends CallbackResult>(parentClassInstance: unknown, callback: Callback<T>, parameter: Parameter): AsyncGenerator<T, void, unknown>;
export {};
