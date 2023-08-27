import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
  ) {}

  async getAllGroupsWithStudents(): Promise<Group[]> {
    return this.groupsRepository.find({ relations: ['students'] });
  }

  async getStudentsByGroupId(id: string): Promise<Group> {
    const group = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.students', 'students')
      .where('group.id = :id', { id })
      .getOne();

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async createGroup(groupCreateSchema: CreateGroupDto): Promise<Group> {
    const group = await this.groupsRepository.findOne({
      where: {
        name: groupCreateSchema.name,
      },
    });

    if (group) {
      throw new ConflictException('Group with this name already exists');
    }

    return this.groupsRepository.save(groupCreateSchema);
  }

  async updateGroupById(
    id: string,
    groupUpdateSchema: UpdateGroupDto,
  ): Promise<void> {
    const result = await this.groupsRepository.update(id, groupUpdateSchema);

    if (result.affected === 0) {
      throw new NotFoundException('Group not found');
    }
  }

  async deleteGroupById(id: string): Promise<void> {
    const result = await this.groupsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Group not found');
    }
  }
}
