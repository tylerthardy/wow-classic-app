import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path = require('path');

export class ClassicCompanionUiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const websiteBucket = new Bucket(this, 'ui-bucket', {
      bucketName: 'wowclassicapp-ui',
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

    new BucketDeployment(this, 'wowclassicapp-ui-bucket-deployment', {
      sources: [Source.asset(path.resolve(__dirname, '../ui/dist/classic-companion'))],
      destinationBucket: websiteBucket
    });

    new CfnOutput(this, 'url', {
      value: websiteBucket.bucketWebsiteUrl,
      description: 'url for the bucket deployed ui',
      exportName: 'uiUrl'
    });
  }
}
