import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return await this.postsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getPostById(id: string): Promise<Post | null> {
    const post = await this.postsRepository.findOne({ where: { id: id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async createPost(createPostSchema: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostSchema);
    return await this.postsRepository.save(post);
  }

  async updatePostById(
    id: string,
    postUpdateSchema: UpdatePostDto,
  ): Promise<UpdateResult> {
    const result = await this.postsRepository.update(id, postUpdateSchema);

    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }

    return result;
  }

  async deletePostById(id: number): Promise<DeleteResult> {
    const result = await this.postsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }

    return result;
  }
}
