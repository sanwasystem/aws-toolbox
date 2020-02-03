"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * AWSのリソースに付加されたタグの値を取得する。見つからない場合などは空文字を返す
 * @param tags タグの配列
 * @param tagName タグの名前
 */
const getTag = (tags, tagName) => {
    if (!tags || !tagName) {
        return "";
    }
    const found = tags.filter(x => x.Key === tagName);
    if (found.length > 0) {
        return (found[0].Value || "").toString();
    }
    else {
        return "";
    }
};
exports.default = getTag;
