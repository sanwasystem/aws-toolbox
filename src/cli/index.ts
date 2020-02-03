import * as AWS from "aws-sdk";
import * as toolbox from "../index";
const ec2 = new AWS.EC2({ region: "ap-northeast-1" });

(async () => {
  console.log("hello world");
})();
