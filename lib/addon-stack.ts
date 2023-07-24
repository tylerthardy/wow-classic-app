import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Code, Function, ILayerVersion, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

export class ClassicCompanionAddonApiStack extends Stack {
  public restApi: LambdaRestApi;
  public insightsLayer: ILayerVersion;
  public helloLambda: Function;

  private apiGatewayId: string = 'addon-gateway';

  constructor(scope: Construct, id: string, playerTable: Table, props?: StackProps) {
    super(scope, id, props);

    this.insightsLayer = LayerVersion.fromLayerVersionArn(this, `lambda-insights-layer`, this.getLambdaInsightsArn());
    this.helloLambda = this.createHelloLambda(playerTable, [this.insightsLayer]);

    this.restApi = new LambdaRestApi(this, this.apiGatewayId, {
      handler: this.helloLambda,
      defaultCorsPreflightOptions: { allowOrigins: Cors.ALL_ORIGINS }
    });
  }

  private createHelloLambda(playerTable: Table, layers: ILayerVersion[]): Function {
    const lambda = new Function(this, 'addon-hello-handler', {
      code: Code.fromAsset(path.resolve(__dirname, '../addon/api')),
      handler: 'hello.handler',
      runtime: Runtime.PYTHON_3_9,
      layers: layers,
      timeout: Duration.seconds(30),
      memorySize: 512
    });

    if (!lambda.role) {
      throw new Error('no implicit role for handler lambda');
    }
    lambda.role!.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
    );

    lambda.addEnvironment('DYNAMO_PLAYER_TABLE_NAME', playerTable.tableName);
    playerTable.grantReadData(lambda);

    return lambda;
  }

  private getLambdaInsightsArn(region: string = 'us-east-1', version: number = 21): string {
    const insightsLayerArn = `arn:aws:lambda:${region}:580247275435:layer:LambdaInsightsExtension:${version}`;
    return insightsLayerArn;
  }
}
