import { Injectable, NotFoundException } from '@nestjs/common';
import { LectorsService } from './lectors.service';

@Injectable()
export class LectorsControllerService {
  constructor(private readonly lectorsService: LectorsService) {}

  public async findCurrentLector(id: string) {
    const lector = await this.lectorsService.getLectorById(id);
    delete lector.password;
    if (!lector) {
      throw new NotFoundException(`Lector is not found`);
    }
    return lector;
  }
}
