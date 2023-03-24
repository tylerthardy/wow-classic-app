#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { config } from 'dotenv';
import 'source-map-support/register';
import { ClassicCompanionApiStack } from '../lib/api-stack';
import { ClassicCompanionAuthStack } from '../lib/auth-stack';
import { ClassicCompanionUiStack } from '../lib/ui-stack';

config();

const app = new cdk.App();
const authStack = new ClassicCompanionAuthStack(app, 'classic-companion-auth', {});
new ClassicCompanionApiStack(app, 'classic-companion-api', authStack.userpool, {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
new ClassicCompanionUiStack(app, 'classic-companion-ui', {});
