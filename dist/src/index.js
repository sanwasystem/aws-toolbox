"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = __importStar(require("./ec2"));
exports.ec2 = ec2;
const cloudwatch = __importStar(require("./cloudwatch"));
exports.cloudwatch = cloudwatch;
const dynamo = __importStar(require("./dynamo"));
exports.dynamo = dynamo;
const lambda = __importStar(require("./lambda"));
exports.lambda = lambda;
const kms = __importStar(require("./kms"));
exports.kms = kms;
const sts = __importStar(require("./sts"));
exports.sts = sts;
const rds = __importStar(require("./rds"));
exports.rds = rds;
const getTag_1 = __importDefault(require("./getTag"));
exports.getTag = getTag_1.default;
