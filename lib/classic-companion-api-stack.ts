import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Code, Function, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path = require("path");

export class ClassicCompanionApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaLayer = new LayerVersion(this, "node-module-layer", {
      code: Code.fromAsset(
        path.resolve(__dirname, "../api/node-modules-layer")
      ),
      compatibleRuntimes: [Runtime.NODEJS_16_X],
      description: "Api Handler Dependencies",
    });

    // add handler to respond to all our api requests
    const handler = new Function(this, "nestjs-handler", {
      code: Code.fromAsset(path.resolve(__dirname, "../api/dist")),
      handler: "lambda.handler",
      runtime: Runtime.NODEJS_16_X,
      layers: [lambdaLayer],
      timeout: Duration.seconds(30),
    });

    new LambdaRestApi(this, "nestjs-api-gateway", {
      handler: handler,
    });
  }
}
