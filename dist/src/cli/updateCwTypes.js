"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
/*
 * namespaceAndMetricsNames.csv から dynamicTypes.ts を生成する
 */
const SOURCE_FILE_NAME = "./src/cloudwatch/namespaceAndMetricsNames.csv";
const DEST_FILE_NAME = "./src/cloudwatch/dynamicTypes.ts";
/**
 * ファイル読み書き関数など
 */
var util;
(function (util) {
    /**
     * CSVファイルを読み込んでLineTypeの配列（1行1個）として返す
     * @param sourceFilename
     */
    // tslint:disable non-literal-fs-path
    util.readFile = (sourceFilename) => {
        return fs
            .readFileSync(sourceFilename)
            .toString("utf-8")
            .split(/[\r\n]+/)
            .map(x => x.replace(/^ +/, "").replace(/ +$/, ""))
            .filter(x => x !== "")
            .map(x => {
            const s = x.split(",");
            return {
                Namespace: s[0],
                MetricNames: s.slice(1)
            };
        });
    };
    /**
     * 書き込む
     * @param lines
     */
    // tslint:disable non-literal-fs-path
    util.writeFile = (destFilename, linesChunks) => {
        fs.writeFileSync(destFilename, "");
        for (const lines of linesChunks) {
            fs.writeFileSync(destFilename, lines.join("\n"), { flag: "a" });
            fs.writeFileSync(destFilename, "\n\n", { flag: "a" });
        }
    };
    /**
     * 文字列の配列の配列に対してflat()とuniq()をまとめてやる
     * @param arrays
     */
    util.flatAndUniq = (arrays) => {
        const result = [];
        for (const arr of arrays) {
            for (const element of arr) {
                result.push(element);
            }
        }
        return Array.from(new Set(result));
    };
})(util || (util = {}));
/**
 * 次のようなテキストを作る（第1引数に "Namespace" を与えた場合）
 * const __Namespace = {
 *     "AWS/EC2": "AWS/EC2",
 *     "AWS/ELB": "AWS/ELB",
 *     ...
 * };
 * export const _Namespace: Readonly<typeof __Namespace> = __Namespace;
 * export type Namespace = keyof (typeof _Namespace);
 * export const isNamespace = (arg: string): arg is Namespace => {
 *     return Object.keys(_Namespace).indexOf(arg) !== -1;
 * }
 * @param variableName 変数名
 * @param names 名前の一覧
 */
const generateConstantValuePart = (variableName, names) => {
    const result = [];
    result.push(`const __${variableName} = {`);
    for (let i = 0; i < names.length; i++) {
        const trail = i === names.length - 1 ? "" : ",";
        result.push(`    "${names[i]}": "${names[i]}"${trail}`);
    }
    result.push("};");
    result.push(`export const _${variableName}: Readonly<typeof __${variableName}> = __${variableName};`);
    result.push(`export type ${variableName} = keyof (typeof _${variableName});`);
    result.push(`export const is${variableName} = (arg: string): arg is ${variableName} => {`);
    result.push(`    return Object.keys(_${variableName}).indexOf(arg) !== -1;`);
    result.push(`}`);
    return result;
};
const generateNamespaceAndMetricName = (lines) => {
    /**
     * {Namespace: "AWS/EC2", MetricName: "StatusCheckFailed" | "CPUUtilization"} のような文字列を作る
     */
    const generateLine = (line) => {
        const metricNames = line.MetricNames.map(x => `"${x}"`).join(" | ");
        return `    {Namespace: "${line.Namespace}", MetricName: ${metricNames}}`;
    };
    const result = [
        "/**",
        " * 許容されるNamespaceとMetricNameの組を定義する",
        " */",
        "export type NamespaceAndMetricName ="
    ];
    for (const line of lines.slice(0, lines.length - 1)) {
        result.push(generateLine(line) + " |");
    }
    result.push(generateLine(lines[lines.length - 1]) + ";");
    return result;
};
const generateTypeGuardMethod = (lines) => {
    const generateLine = (line) => {
        const metricNames = line.MetricNames.map(x => `"${x}"`).join(", ");
        return `    if (arg.Namespace === "${line.Namespace}" && [${metricNames}].indexOf(arg.MetricName) !== -1) { return true; }`;
    };
    const result = [
        "export const isNamespaceAndMetricNames = (arg: any): arg is NamespaceAndMetricName => {",
        '    if (typeof(arg) !== "object") { return false; }'
    ];
    for (const line of lines) {
        result.push(generateLine(line));
    }
    result.push("    return false;");
    result.push("};");
    return result;
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const lines = util.readFile(SOURCE_FILE_NAME);
    const names = lines.map(x => x.Namespace);
    const matricNames = util.flatAndUniq(lines.map(x => x.MetricNames));
    // 定数宣言部分
    const const1 = generateConstantValuePart("Namespace", names);
    const const2 = generateConstantValuePart("MetricName", matricNames);
    // 許容されるパターン定義＆判定部分
    const part1 = generateNamespaceAndMetricName(lines);
    const part2 = generateTypeGuardMethod(lines);
    util.writeFile(DEST_FILE_NAME, [const1, const2, part1, part2]);
}))();
