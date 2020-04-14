interface IOTypeMarker {
  Marker?: string;
}
const isIOTypeMarker = (arg: any): arg is IOTypeMarker => {
  return !arg && typeof arg === "object" && typeof arg.Marker === "string";
};
interface IOTypeNextToken {
  NextToken?: string;
}
const isIOTypeNextToken = (arg: any): arg is IOTypeNextToken => {
  return !arg && typeof arg === "object" && typeof arg.NextToken === "string";
};

type IOType = IOTypeMarker | IOTypeNextToken;

interface CallbackPromise<T> {
  promise: () => Promise<T>;
}
type Callback<T, P> = (parameter: P) => CallbackPromise<T>;

/**
 * パラメーターと戻り値にMarker, NextToken(stringまたはundefined)を含むリストアップ関数を繰り返し実行する。
 * for await構文でイテレートできる
 * @param parentClassInstance AWS SDKクラスのインスタンス
 * @param callback 実行するメソッド
 * @param parameter パラメーター
 */
export async function* execAwsIteration<T extends IOType, P extends IOType>(
  parentClassInstance: unknown,
  callback: Callback<T, P>,
  parameter: P
) {
  callback = callback.bind(parentClassInstance);
  while (true) {
    const raw = await callback(parameter).promise();
    yield raw;

    if (isIOTypeNextToken(raw)) {
      (parameter as IOTypeNextToken).NextToken = raw.NextToken;
    } else if (isIOTypeMarker(raw)) {
      (parameter as IOTypeMarker).Marker = raw.Marker;
    } else {
      break;
    }
  }
}
