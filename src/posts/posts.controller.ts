import {
    Controller,
    Req,
    Body,
    Post,
    UseGuards,
    Get,
    Param,
    ParseIntPipe,
    Delete,
} from '@nestjs/common';
import {
    ApiUseTags,
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiImplicitParam,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { Post as PostEntity } from './post.entity';
import { PostDto } from './dto/post.dto';
import { Request } from 'express';

@Controller('posts')
@ApiUseTags('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    @ApiOkResponse({ type: [PostDto] })
    findAll(): Promise<PostDto[]> {
        return this.postsService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ type: PostDto })
    @ApiImplicitParam({ name: 'id', required: true })
    findOne(@Param('id', new ParseIntPipe()) id: number): Promise<PostDto> {
        return this.postsService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: PostEntity })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    create(
        @Body() createPostDto: CreatePostDto,
        @Req() request,
    ): Promise<PostEntity> {
        return this.postsService.create(request.user.id, createPostDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: PostEntity })
    @ApiImplicitParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    delete(
        @Param('id', new ParseIntPipe()) id: number,
        @Req() request: Request,
    ): Promise<PostEntity> {
        return this.postsService.delete(id, request.user.id);
    }
}