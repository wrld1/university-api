import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Mark } from './entities/mark.entity';
import { MarksService } from './marks.service';
import { CreateMarkDto } from './dto/create-mark.dto';

@ApiTags('Marks')
@Controller('marks')
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all marks' })
  @ApiResponse({
    status: 200,
    description: 'The list of marks',
    type: [Mark],
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getAllMarks() {
    const marks = await this.marksService.getAllMarks();
    return marks;
  }

  @Post()
  @ApiOperation({ summary: 'Create mark' })
  @ApiResponse({
    status: 201,
    description: 'Return the mark after creation',
    type: Mark,
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async addMark(@Body() createMarkDto: CreateMarkDto) {
    const markEntity = await this.marksService.addMark(createMarkDto);
    return markEntity;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete mark' })
  @ApiParam({ name: 'id', type: String, description: 'The mark id' })
  @ApiResponse({ status: 204, description: 'Mark was deleted' })
  @ApiResponse({
    status: 404,
    description: 'Mark was not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async deleteMark(@Param('id') id: string) {
    const markEntity = await this.marksService.deleteMark(id);
    if (!markEntity) {
      throw new NotFoundException('Mark not found');
    }
  }
}
