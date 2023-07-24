import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import {
  AccessLogField,
  AccessLogFormat,
  AuthorizationType,
  CfnMethod,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaRestApi,
  LogGroupLogDestination
} from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Code, Function, ILayerVersion, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import path = require('path');

export class ClassicCompanionApiStack extends Stack {
  public playerTable: Table;
  private playerTableName: string = 'player-1679377599';

  constructor(scope: Construct, id: string, userpool: UserPool, apiScopeName: string, props?: StackProps) {
    super(scope, id, props);
    this.validateEnvironmentVariables();

    this.playerTable = new Table(this, this.playerTableName, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'regionServerCharacterName', type: AttributeType.STRING },
      sortKey: { name: 'zoneAndSize', type: AttributeType.STRING }
    });

    const lambdaLayer = this.createLambdaLayer();
    const insightsLayer = LayerVersion.fromLayerVersionArn(this, `lambda-insights-layer`, this.getLambdaInsightsArn());
    const handlerLambda = this.createHandlerLambda([lambdaLayer, insightsLayer]);
    if (!handlerLambda.role) {
      throw new Error('no implicit role for handler lambda');
    }
    handlerLambda.role!.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
    );
    handlerLambda.addEnvironment('DYNAMO_PLAYER_TABLE_NAME', this.playerTable.tableName);
    // Allow API to write to player table
    this.playerTable.grantReadWriteData(handlerLambda);

    const apiGatewayId: string = 'nestjs-api-gateway';
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'api-authorizer', {
      cognitoUserPools: [userpool]
    });
    const logGroup = new LogGroup(this, apiGatewayId + '_access-logs');
    const apiGateway = new LambdaRestApi(this, apiGatewayId, {
      handler: handlerLambda,
      defaultMethodOptions: {
        authorizationType: AuthorizationType.COGNITO,
        authorizer,
        authorizationScopes: [apiScopeName]
      },
      defaultCorsPreflightOptions: { allowOrigins: Cors.ALL_ORIGINS },
      deployOptions: {
        accessLogDestination: new LogGroupLogDestination(logGroup),
        accessLogFormat: this.getCustomAccessLogFormat()
      }
    });

    // Hack to get around preflight + authorizer
    // https://github.com/aws/aws-cdk/issues/8615
    apiGateway.methods
      .filter((method) => method.httpMethod === 'OPTIONS')
      .forEach((method) => {
        const methodCfn = method.node.defaultChild as CfnMethod;
        methodCfn.authorizationType = AuthorizationType.NONE;
        methodCfn.authorizerId = undefined;
        methodCfn.authorizationScopes = undefined;
        methodCfn.apiKeyRequired = false;
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

  private getCustomAccessLogFormat(): AccessLogFormat {
    const formatJson: object = {
      requestTime: AccessLogField.contextRequestTime(),
      requestId: AccessLogField.contextRequestId(),
      httpMethod: AccessLogField.contextHttpMethod(),
      path: AccessLogField.contextPath(),
      resourcePath: AccessLogField.contextResourcePath(),
      status: AccessLogField.contextRequestTime(),
      responseLatency: AccessLogField.contextResponseLatency(),
      userAgent: AccessLogField.contextIdentityUserAgent(),
      identity: {
        sub: AccessLogField.contextAuthorizer('claims.sub')
      }
    };
    const format = JSON.stringify(formatJson);
    return AccessLogFormat.custom(format);
  }
}
