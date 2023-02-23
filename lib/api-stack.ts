import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Code, Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

export class ClassicCompanionApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.validateEnvironmentVariables();

    const lambdaLayer = new LayerVersion(this, 'node-module-layer', {
      code: Code.fromAsset(path.resolve(__dirname, '../api/node-modules-layer')),
      compatibleRuntimes: [Runtime.NODEJS_16_X],
      description: 'Api Handler Dependencies'
    });

    const insightsLayer = LayerVersion.fromLayerVersionArn(this, `lambda-insights-layer`, this.getLambdaInsightsArn());

    // add handler to respond to all our api requests
    const handler = new Function(this, 'nestjs-handler', {
      code: Code.fromAsset(path.resolve(__dirname, '../api/dist')),
      handler: 'lambda.handler',
      runtime: Runtime.NODEJS_16_X,
      layers: [lambdaLayer, insightsLayer],
      timeout: Duration.seconds(30),
      memorySize: 512,
      environment: {
        WARCRAFT_LOGS_CLIENT_ID: process.env.WARCRAFT_LOGS_CLIENT_ID!,
        WARCRAFT_LOGS_CLIENT_SECRET: process.env.WARCRAFT_LOGS_CLIENT_SECRET!
      }
    });

    if (!handler.role) {
      throw new Error('no implicit role for handler lambda');
    }
    handler.role!.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
    );

    new LambdaRestApi(this, 'nestjs-api-gateway', {
      handler: handler
    });
  }

  private validateEnvironmentVariables(): void {
    if (!process.env.WARCRAFT_LOGS_CLIENT_ID) {
      throw new Error('WARCRAFT_LOGS_CLIENT_ID missing');
    }
    if (!process.env.WARCRAFT_LOGS_CLIENT_SECRET) {
      throw new Error('WARCRAFT_LOGS_CLIENT_SECRET missing');
    }
  }

  private getLambdaInsightsArn(region: string = 'us-east-1', version: number = 21): string {
    const insightsLayerArn = `arn:aws:lambda:${region}:580247275435:layer:LambdaInsightsExtension:${version}`;
    return insightsLayerArn;
  }
}
