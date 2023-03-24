// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  discordUrl: 'https://discord.gg/dJ8YvKn8AR',
  addonDownloadUrl: 'https://wowclassicapp-addon.s3.amazonaws.com/GroupMembersExporter.zip',
  maintenance: true,
  cognito: {
    userPoolId: 'us-east-1_ilRzncdYc',
    userPoolWebClientId: '2q9p3t2iljp1b9oslcs2cbd9p5'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
