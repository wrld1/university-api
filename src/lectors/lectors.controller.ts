import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { LectorsService } from './lectors.service';
import { CreateLectorDto } from './dto/create-lector.dto';
import { UpdateLectorDto } from './dto/update-lector.dto';
import { ApiTags, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Lector } from './entities/lector.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current.user.decorator';
import { LectorsControllerService } from './lectors.controller.service';

@UseGuards(AuthGuard)
@ApiBearerAuth('jwt')
@ApiTags('Lectors')
@Controller('lectors')
export class LectorsController {
  constructor(
    private readonly lectorsService: LectorsService,
    private readonly lectorsControllerService: LectorsControllerService,
  ) {}

  @Get('me')
  public async findMe(@CurrentUser() loggedLector: Lector) {
    console.log(`This is logged lector${loggedLector.id}`);
    const response = await this.lectorsControllerService.findCurrentLector(
      loggedLector.id,
    );
    console.log(`This is kirilla response : ${response}`);
    return response;
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all lectors',
    type: Lector,
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getAllLectors() {
    return this.lectorsService.getAllLectors();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Lector ID' })
  @ApiResponse({
    status: 200,
    description: 'Get a lector by ID',
    type: Lector,
  })
  @ApiResponse({
    status: 404,
    description: 'Lector not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getLectorById(@Param('id') id: string) {
    const lector = await this.lectorsService.getLectorById(id);
    if (!lector) {
      throw new NotFoundException('Lector not found');
    }
    return lector;
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create a new lector',
    type: Lector,
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async createLector(@Body() lectorCreateSchema: CreateLectorDto) {
    try {
      return this.lectorsService.createLector(lectorCreateSchema);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String, description: 'Lector ID' })
  @ApiResponse({
    status: 204,
    description: 'Update a lector by ID',
    type: Lector,
  })
  @ApiResponse({
    status: 404,
    description: 'Lector not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async updateLectorById(
    @Param('id') id: string,
    @Body() lectorUpdateSchema: UpdateLectorDto,
  ) {
    const updatedLector = await this.lectorsService.updateLectorById(
      id,
      lectorUpdateSchema,
    );
    if (!updatedLector) {
      throw new NotFoundException('Lector not found');
    }
    return updatedLector;
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'Lector ID' })
  @ApiResponse({
    status: 204,
    description: 'Delete a lector by ID',
    type: Lector,
  })
  @ApiResponse({
    status: 404,
    description: 'Lector not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async deleteLectorById(@Param('id') id: string) {
    const deletedLector = await this.lectorsService.deleteLectorById(id);
    if (!deletedLector) {
      throw new NotFoundException('Lector not found');
    }
    return deletedLector;
  }
}
