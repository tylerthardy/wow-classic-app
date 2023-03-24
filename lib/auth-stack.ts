import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AccountRecovery, DateTimeAttribute, UserPool, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import path = require('path');

export class ClassicCompanionAuthStack extends Stack {
  public userpool: UserPool;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.validateEnvironmentVariables();

    this.userpool = new UserPool(this, 'users', {
      userPoolName: 'users',
      signInAliases: {
        email: true
      },
      selfSignUpEnabled: true,
      autoVerify: {
        email: false
      },
      userVerification: {
        // emailSubject: 'You need to verify your email',
        // emailBody: 'Thanks for signing up. Your verification code is {####}',
        emailStyle: VerificationEmailStyle.LINK
      },
      standardAttributes: {},
      customAttributes: {
        createdTimestamp: new DateTimeAttribute()
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY
    });

    this.userpool.addClient('users-app-client', {
      userPoolClientName: 'users-app-client',
      authFlows: {
        userPassword: true
      }
    });
  }

  private validateEnvironmentVariables(): void {}
}
