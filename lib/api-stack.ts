import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Code, Function, ILayerVersion, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Environment } from './common/environment';
import path = require('path');

export class WcaApiStack extends Stack {
  private deployEnvironment: Environment;
  constructor(scope: Construct, id: string, deployEnvironment: Environment, props?: StackProps) {
    super(scope, id, props);

    this.deployEnvironment = deployEnvironment;

    this.validateEnvironmentVariables();

    const lambdaLayer = this.createLambdaLayer();
    const insightsLayer = LayerVersion.fromLayerVersionArn(this, 'lambda-insights-layer', this.getLambdaInsightsArn());
    const handlerLambda = this.createHandlerLambda([lambdaLayer, insightsLayer]);
    if (!handlerLambda.role) {
      throw new Error('no implicit role for handler lambda');
    }
    handlerLambda.role!.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
    );
    const playerTable = new Table(this, 'player', {
      partitionKey: { name: 'regionServer', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      sortKey: { name: 'characterName', type: AttributeType.STRING }
    });
    handlerLambda.addEnvironment('DYNAMO_PLAYER_TABLE_NAME', playerTable.tableName);

    const apiGateway = new LambdaRestApi(this, 'nestjs-api-gateway', {
      handler: handlerLambda
    });

    // Allow API to write to player table
    playerTable.grantReadWriteData(handlerLambda);
  }

  private validateEnvironmentVariables(): void {
    if (!process.env.WARCRAFT_LOGS_CLIENT_ID) {
      throw new Error('WARCRAFT_LOGS_CLIENT_ID missing');
    }
    if (!process.env.WARCRAFT_LOGS_CLIENT_SECRET) {
      throw new Error('WARCRAFT_LOGS_CLIENT_SECRET missing');
    }
  }

  private createHandlerLambda(layers: ILayerVersion[]): Function {
    const lambda = new Function(this, 'nestjs-handler', {
      code: Code.fromAsset(path.resolve(__dirname, '../api/dist')),
      handler: 'lambda.handler',
      runtime: Runtime.NODEJS_16_X,
      layers: layers,
      timeout: Duration.seconds(30),
      memorySize: 512,
      environment: {
        WARCRAFT_LOGS_CLIENT_ID: process.env.WARCRAFT_LOGS_CLIENT_ID!,
        WARCRAFT_LOGS_CLIENT_SECRET: process.env.WARCRAFT_LOGS_CLIENT_SECRET!
      }
    });
    return lambda;
  }

  private createLambdaLayer(): LayerVersion {
    return new LayerVersion(this, 'node-module-layer', {
      code: Code.fromAsset(path.resolve(__dirname, '../api/node-modules-layer')),
      compatibleRuntimes: [Runtime.NODEJS_16_X],
      description: 'Api Handler Dependencies'
    });
  }

  private getLambdaInsightsArn(region: string = 'us-east-1', version: number = 21): string {
    const insightsLayerArn = `arn:aws:lambda:${region}:580247275435:layer:LambdaInsightsExtension:${version}`;
    return insightsLayerArn;
  }
}
