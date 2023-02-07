import { Test, TestingModule } from '@nestjs/testing';
import { WarcraftLogsController } from './warcraft-logs.controller';

describe('WarcraftLogsController', () => {
  let controller: WarcraftLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarcraftLogsController],
    }).compile();

    controller = module.get<WarcraftLogsController>(WarcraftLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
