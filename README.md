ssc-aws-toolbox
===============

### これは何か
aws-sdkをラップするもの。
同じようなことを何度も書くのに飽きたので作った。

### 使い方
```js
import * as AWS from "aws-sdk";
import * as toolbox from "aws-toolbox";
const ec2 = new AWS.EC2({ region: "ap-northeast-1" }); // リージョンはこちらの方で指定

// ec2インスタンスを渡して処理を行う
const instances: toolbox.ec2.Instance[] = await toolbox.ec2.getAllInstances(ec2);

// 一部のプロパティからはundefinedを排除している
const ebsIds: string[] = instances[0].BlockDeviceMappings.map(x => x.Ebs.VolumeId);
```
