import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  AccountRecovery,
  DateTimeAttribute,
  OAuthScope,
  ProviderAttribute,
  ResourceServerScope,
  UserPool,
  UserPoolClientIdentityProvider,
  UserPoolIdentityProviderGoogle,
  VerificationEmailStyle
} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import path = require('path');

export class ClassicCompanionAuthStack extends Stack {
  public userpool: UserPool;
  public apiOauthScope: OAuthScope;

  constructor(scope: Construct, id: string, callbackUrls: string[], props?: StackProps) {
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

    this.userpool.registerIdentityProvider(this.getGoogleIdp(this.userpool));

    this.userpool.addDomain('cognito-domain', {
      cognitoDomain: {
        domainPrefix: 'wowclassicapp'
      }
    });

    const apiScope = new ResourceServerScope({
      scopeName: 'api',
      scopeDescription: 'api access'
    });
    const resourceServer = this.userpool.addResourceServer('api', {
      identifier: 'api-resource-server',
      userPoolResourceServerName: 'api-resource-server',
      scopes: [apiScope]
    });

    this.apiOauthScope = OAuthScope.resourceServer(resourceServer, apiScope);
    this.userpool.addClient('users-app-client', {
      userPoolClientName: 'users-app-client',
      authFlows: {
        userSrp: true
      },
      oAuth: {
        scopes: [this.apiOauthScope, OAuthScope.OPENID, OAuthScope.PROFILE],
        callbackUrls: callbackUrls
      },
      supportedIdentityProviders: [UserPoolClientIdentityProvider.GOOGLE, UserPoolClientIdentityProvider.COGNITO],
      accessTokenValidity: Duration.minutes(60),
      idTokenValidity: Duration.minutes(60),
      refreshTokenValidity: Duration.days(30)
    });
  }

  private getGoogleIdp(userPool: UserPool): UserPoolIdentityProviderGoogle {
    return new UserPoolIdentityProviderGoogle(this, 'google-idp', {
      userPool,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      // Email scope is required, because the default is 'profile' and that doesn't allow Cognito
      // to fetch the user's email from his Google account after the user does an SSO with Google
      scopes: ['email'],

      // Map fields from the user's Google profile to Cognito user fields, when the user is auto-provisioned
      attributeMapping: {
        email: ProviderAttribute.GOOGLE_EMAIL
      }
    });
  }

  private validateEnvironmentVariables(): void {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID missing');
    }
    if (!process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('GOOGLE_CLIENT_SECRET missing');
    }
  }
}
