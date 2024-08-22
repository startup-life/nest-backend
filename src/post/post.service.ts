import {Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {Repository} from "typeorm";
import {Post} from "./post.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {FileService} from "../file/file.service";
import {User} from "../user/user.entity";
import {File} from "../file/file.entity";
import {AddPostDto} from "./dto/add-post.dto";
import {UpdatePostDto} from "./dto/update-post.dto";
import {CreatePostImageDto} from "../file/dto/create-post-image.dto";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        private readonly fileService: FileService,
    ) {}

    async getAllPosts(): Promise<any[]> {
        const posts = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('user.files', 'userFile', 'userFile.fileCategory = :profileCategory', { profileCategory: 0 }) // 프로필 이미지 카테고리
            .leftJoinAndSelect('post.files', 'postFile', 'postFile.fileCategory = :postCategory', { postCategory: 1 }) // 포스트 파일 카테고리
            .addSelect([
                `CASE WHEN post.like >= 1000000 THEN CONCAT(ROUND(post.like / 1000000, 1), 'M') 
              WHEN post.like >= 1000 THEN CONCAT(ROUND(post.like / 1000, 1), 'K') 
              ELSE post.like END`,
                `CASE WHEN post.commentCount >= 1000000 THEN CONCAT(ROUND(post.commentCount / 1000000, 1), 'M') 
              WHEN post.commentCount >= 1000 THEN CONCAT(ROUND(post.commentCount / 1000, 1), 'K') 
              ELSE post.commentCount END`,
                `CASE WHEN post.hits >= 1000000 THEN CONCAT(ROUND(post.hits / 1000000, 1), 'M') 
              WHEN post.hits >= 1000 THEN CONCAT(ROUND(post.hits / 1000, 1), 'K') 
              ELSE post.hits END`,
                `COALESCE(userFile.filePath, '/public/image/profile/default.jpg')`
            ])
            .where('post.deletedAt IS NULL')
            .orderBy('post.createdAt', 'DESC')
            .getMany();

        // foreach로 로그
        /*posts.forEach(post => {
            console.log(post);
            console.log(post.user);
            console.log(post.user.files);
            console.log(post.files);
        });*/

        if (!posts) return [];

        return posts.map(post => ({
            postId: post.postId, // 게시글 ID
            postTitle: post.postTitle, // 게시글 제목
            postContent: post.postContent, // 게시글 내용
            fileId: post.fileId, // 파일 ID
            userId: post.userId, // 작성자 ID
            nickname: post.user.nickname, // 작성자 닉네임
            like: post.like, // 포맷팅된 좋아요 수
            commentCount: post.commentCount, // 포맷팅된 댓글 수
            hits: post.hits, // 포맷팅된 조회 수
            createdAt: post.createdAt, // 생성 날짜
            updatedAt: post.updatedAt, // 수정 날짜
            deletedAt: post.deletedAt, // 삭제 날짜
            profileImagePath: post.user.files?.[0]?.filePath || '/public/image/profile/default.jpg', // 프로필 이미지 경로
            filePath: post.files?.[0]?.filePath || null, // 게시글에 첨부된 파일 경로
            commentsCount: post.commentCount // 댓글 수
        }));
    }

    async getPostById(postId: number): Promise<any> {
        const post = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('user.files', 'userFile', 'userFile.fileCategory = :profileCategory', { profileCategory: 0 }) // 프로필 이미지 카테고리
            .leftJoinAndSelect('post.files', 'postFile', 'postFile.fileCategory = :postCategory', { postCategory: 1 }) // 포스트 파일 카테고리
            .addSelect([
                `CASE WHEN post.like >= 1000000 THEN CONCAT(ROUND(post.like / 1000000, 1), 'M') 
              WHEN post.like >= 1000 THEN CONCAT(ROUND(post.like / 1000, 1), 'K') 
              ELSE post.like END`,
                `CASE WHEN post.commentCount >= 1000000 THEN CONCAT(ROUND(post.commentCount / 1000000, 1), 'M') 
              WHEN post.commentCount >= 1000 THEN CONCAT(ROUND(post.commentCount / 1000, 1), 'K') 
              ELSE post.commentCount END`,
                `CASE WHEN post.hits >= 1000000 THEN CONCAT(ROUND(post.hits / 1000000, 1), 'M') 
              WHEN post.hits >= 1000 THEN CONCAT(ROUND(post.hits / 1000, 1), 'K') 
              ELSE post.hits END`,
                `COALESCE(userFile.filePath, '/public/image/profile/default.jpg')`
            ])
            .where('post.postId = :postId', { postId })
            .andWhere('post.deletedAt IS NULL')
            .getOne();

        if (!post) throw new NotFoundException('Post not found');

        return {
            postId: post.postId, // 게시글 ID
            postTitle: post.postTitle, // 게시글 제목
            postContent: post.postContent, // 게시글 내용
            fileId: post.fileId, // 파일 ID
            userId: post.userId, // 작성자 ID
            nickname: post.user.nickname, // 작성자 닉네임
            like: post.like, // 포맷팅된 좋아요 수
            commentCount: post.commentCount, // 포맷팅된 댓글 수
            hits: post.hits, // 포맷팅된 조회 수
            createdAt: post.createdAt, // 생성 날짜
            updatedAt: post.updatedAt, // 수정 날짜
            deletedAt: post.deletedAt, // 삭제 날짜
            profileImagePath: post.user.files?.[0]?.filePath || '/public/image/profile/default.jpg', // 프로필 이미지 경로
            filePath: post.files?.[0]?.filePath || null, // 게시글에 첨부된 파일 경로
            commentsCount: post.commentCount // 댓글 수
        };
    }

    async addPost(userId: number, nickname: string, addPostDto: AddPostDto): Promise<any> {
        const { postTitle, postContent, attachFilePath } = addPostDto;

        // 새로운 Post 객체 생성 및 저장
        let newPost = this.postRepository.create({
            userId,
            nickname,
            postTitle,
            postContent,
        });
        newPost = await this.postRepository.save(newPost);

        if (!newPost) throw new InternalServerErrorException('Failed create post');

        // 파일이 있는 경우 fileId를 설정하고 다시 저장
        if (attachFilePath) {
            newPost.fileId = await this.getNewPostFileId(userId, newPost.postId, attachFilePath);
            newPost = await this.postRepository.save(newPost);
        }

        return newPost;
    }

    async updatePost(postId: number, userId: number, nickname: string, updatePostDto: UpdatePostDto): Promise<any> {
        const { postTitle, postContent, attachFilePath } = updatePostDto;

        // 게시글 조회
        const post = await this.getPostById(postId);

        // 제목, 내용, 닉네임 업데이트
        const savedPost = await this.postRepository.update({ postId, userId }, { postTitle, postContent, nickname });
        if (!savedPost) throw new NotFoundException('Post not found');

        // 파일이 없는 경우
        if (!attachFilePath) {
            // file 테이블에서 postId 제거
            await Promise.all([
                this.fileRepository.update({ fileId: post.fileId }, { postId: null }),
                this.postRepository.update({ postId, userId }, { fileId: null })
            ]);
            return await this.getPostById(postId);
        }

        // 기존 파일과 같은 경우
        if (attachFilePath === post.filePath) return await this.getPostById(postId);

        // 새로운 파일 추가
        const postFileId = await this.getNewPostFileId(userId, postId, attachFilePath);
        await this.postRepository.update({ postId, userId }, { fileId: postFileId });

        return await this.getPostById(postId);
    }

    async softDeletePost(postId: number, userId: number): Promise<any> {
        const post = await this.getPostById(postId);
        if (!post) throw new NotFoundException('Post not found');

        const deletePost = await this.postRepository.softDelete({ postId, userId });
        if (!deletePost) throw new NotFoundException('Post not found');

        return deletePost;
    }

    // private method

    private async getNewPostFileId(userId: number, postId: number, filePath: string): Promise<any> {
        const createPostImageDto: CreatePostImageDto = {
            userId,
            postId,
            filePath,
        };
        const postFile = await this.fileService.createPostImage(createPostImageDto);
        return postFile.fileId;
    }
}
