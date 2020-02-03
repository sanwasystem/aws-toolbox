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
const assert = __importStar(require("assert"));
const tool = __importStar(require("../src/index"));
const fs = __importStar(require("fs"));
describe("lambda", () => {
    describe("isAPIGatewayProxyEvent()", () => {
        before(() => __awaiter(void 0, void 0, void 0, function* () {
        }));
        it("test1", () => {
            const contentStr = fs.readFileSync("./test/lambda/fixtures/sample1.json").toString("utf-8");
            const content = JSON.parse(contentStr);
            const result = tool.lambda.isAPIGatewayProxyEvent(content);
            assert.equal(result, true);
        });
    });
    describe("generateLambdaContextSample()", () => {
        it("test1", () => {
            const context = tool.lambda.generateLambdaContextSample("MyFunction", "VERSION", "ap-northeast-1", "123456789012");
            assert.notEqual(context, null);
            assert.equal(context.functionName, "MyFunction");
            assert.equal(context.functionVersion, "VERSION");
            assert.equal(context.invokedFunctionArn, "arn:aws:lambda:ap-northeast-1:123456789012:function:MyFunction");
            assert.equal(context.logGroupName, "/aws/lambda/MyFunction");
            console.log(context.logStreamName);
            const pattern = /^\d{4}\/\d{2}\/\d{2}\/\[VERSION\][0-9a-f]{32}$/;
            assert.equal(pattern.test(context.logStreamName), true);
        });
    });
});
