import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';
import { CreateLectorDto } from './dto/create-lector.dto';
import { UpdateLectorDto } from './dto/update-lector.dto';
import { Lector } from './entities/lector.entity';

@Injectable()
export class LectorsService {
  constructor(
    @InjectRepository(Lector)
    private readonly lectorsRepository: Repository<Lector>,
  ) {}

  async getAllLectors(): Promise<Lector[]> {
    return await this.lectorsRepository.find({
      relations: ['courses'],
    });
  }

  async getLectorById(id: string): Promise<Lector> {
    const lector = await this.lectorsRepository.findOne({
      where: { id: id },
      relations: ['courses'],
    });

    if (!lector) {
      throw new NotFoundException('Lector not found');
    }

    return lector;
  }

  async createLector(lectorCreateSchema: CreateLectorDto): Promise<Lector> {
    const { name } = lectorCreateSchema;

    const existingLector = await this.lectorsRepository.findOne({
      where: { name },
    });

    if (existingLector) {
      throw new BadRequestException('Lector with this name already exists');
    }

    return this.lectorsRepository.save(lectorCreateSchema);
  }

  async updateLectorById(
    id: string,
    lectorUpdateSchema: UpdateLectorDto,
  ): Promise<UpdateResult> {
    const result = await this.lectorsRepository.update(id, lectorUpdateSchema);

    if (!result.affected) {
      throw new NotFoundException('Lector not found');
    }

    return result;
  }

  async deleteLectorById(id: string): Promise<DeleteResult> {
    const result = await this.lectorsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Lector not found');
    }

    return result;
  }
}
