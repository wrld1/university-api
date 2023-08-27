import { Test, TestingModule } from '@nestjs/testing';
import { LectorsService } from './lectors.service';

describe('LectorsService', () => {
  let service: LectorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectorsService],
    }).compile();

    service = module.get<LectorsService>(LectorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
