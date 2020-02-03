import * as assert from "assert";
import * as mocha from "mocha";
import * as tool from "../src/index";
import * as fs from "fs";

describe("lambda", () => {
  describe("isAPIGatewayProxyEvent()", () => {
    before(async() => {
    });

    it("test1", () => {
      const contentStr = fs.readFileSync("./test/lambda/fixtures/sample1.json").toString("utf-8")
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
      const pattern = /^\d{4}\/\d{2}\/\d{2}\/\[VERSION\][0-9a-f]{32}$/
      assert.equal(pattern.test(context.logStreamName), true);
    });
  });
});
