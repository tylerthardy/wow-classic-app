import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { Environment } from './common/environment';
import path = require('path');

export class WcaUiStack extends Stack {
  constructor(scope: Construct, id: string, deployEnvironment: Environment, props?: StackProps) {
    super(scope, id, props);

    const websiteBucket = new Bucket(this, `${deployEnvironment}-wca-ui`, {
      bucketName: `${deployEnvironment}-wca-ui`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: {
        restrictPublicBuckets: false,
        blockPublicAcls: false,
        ignorePublicAcls: false,
        blockPublicPolicy: false
      }
    });

    new BucketDeployment(this, `${deployEnvironment}-wca-ui-deployment`, {
      sources: [Source.asset(path.resolve(__dirname, '../ui/dist/classic-companion'))],
      destinationBucket: websiteBucket
    });
  }
}
