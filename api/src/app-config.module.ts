import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, validateConfig } from './app-config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateConfig,
      isGlobal: true
    })
  ],
  providers: [
    {
      provide: AppConfig,
      useClass: AppConfig,
      inject: [ConfigService]
    }
  ],
  exports: [AppConfig]
})
export class AppConfigModule {}
