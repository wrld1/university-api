import {
  Controller,
  Get,
  Body,
  Patch,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return the list of students.',
    type: PostEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getAllPosts(): Promise<PostEntity[]> {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 404,
    description: 'post not found.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async getPostById(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<PostEntity> {
    return this.postsService.getPostById(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create post.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async createPost(
    @Body() createPostSchema: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.createPost(createPostSchema);
  }

  @Patch(':id')
  @ApiResponse({
    status: 204,
    description: 'Update the post',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async updatePostById(
    @Param('id', ParseIntPipe) id: string,
    @Body() postUpdateSchema: UpdatePostDto,
  ): Promise<PostEntity> {
    const updatedCourse = await this.postsService.updatePostById(
      id,
      postUpdateSchema,
    );
    if (!updatedCourse) {
      throw new NotFoundException('Course not found');
    }
    return await this.postsService.getPostById(id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Delete the post',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @ApiResponse({
    status: 505,
    description:
      'The HTTP version used in the request is not supported by the server.',
  })
  async deletePostById(@Param('id') id: number): Promise<void> {
    await this.postsService.deletePostById(id);
  }
}
