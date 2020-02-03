interface Tag {
    Key?: String;
    Value?: String;
}
/**
 * AWSのリソースに付加されたタグの値を取得する。見つからない場合などは空文字を返す
 * @param tags タグの配列
 * @param tagName タグの名前
 */
declare const getTag: (tags: Tag[] | null | undefined, tagName: string | null | undefined) => string;
export default getTag;
