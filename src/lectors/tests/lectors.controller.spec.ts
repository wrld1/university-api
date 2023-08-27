import { Test, TestingModule } from '@nestjs/testing';
import { LectorsController } from './lectors.controller';
import { LectorsService } from './lectors.service';

describe('LectorsController', () => {
  let controller: LectorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectorsController],
      providers: [LectorsService],
    }).compile();

    controller = module.get<LectorsController>(LectorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
