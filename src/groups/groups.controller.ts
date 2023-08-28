import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all groups with students',
    description:
      'Retrieve a list of all groups along with their associated students.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved groups.',
    type: Group,
    isArray: true,
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getAllGroups(): Promise<Group[]> {
    return this.groupsService.getAllGroupsWithStudents();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get group by ID',
    description:
      'Retrieve a group by its ID along with its associated students.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Group ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the group.',
    type: Group,
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getGroupById(@Param('id', ParseIntPipe) id: string): Promise<Group> {
    const groupWithStudents = await this.groupsService.getStudentsByGroupId(id);
    if (!groupWithStudents) {
      throw new NotFoundException('Group not found');
    }
    return groupWithStudents;
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new group',
    description: 'Create a new group with the provided details.',
  })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({
    status: 201,
    description: 'Group created successfully.',
    type: Group,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async createGroup(
    @Body() groupCreateRequest: CreateGroupDto,
  ): Promise<Group> {
    return this.groupsService.createGroup(groupCreateRequest);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update group by ID',
    description: 'Update a group by its ID with the provided details.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Group ID' })
  @ApiBody({ type: UpdateGroupDto })
  @ApiResponse({ status: 204, description: 'Group updated successfully.' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async updateGroupById(
    @Param('id', ParseIntPipe) id: string,
    @Body() groupUpdateRequest: UpdateGroupDto,
  ): Promise<void> {
    await this.groupsService.updateGroupById(id, groupUpdateRequest);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete group by ID',
    description: 'Delete a group by its ID.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Group ID' })
  @ApiResponse({
    status: 204,
    description: 'Group deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async deleteGroupById(@Param('id', ParseIntPipe) id: string): Promise<void> {
    await this.groupsService.deleteGroupById(id);
  }
}
