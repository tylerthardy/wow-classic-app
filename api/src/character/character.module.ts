import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from '../common/request-logger-middleware';
import { WarcraftLogsModule } from '../warcraft-logs/warcraft-logs.module';
import { WarcraftLogsService } from '../warcraft-logs/warcraft-logs.service';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

@Module({
  imports: [WarcraftLogsModule],
  providers: [CharacterService, WarcraftLogsService],
  controllers: [CharacterController]
})
export class CharacterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
