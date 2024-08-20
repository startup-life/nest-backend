import {Injectable, NotFoundException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {Repository} from "typeorm";
import {Post} from "./post.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {FileService} from "../file/file.service";
import {User} from "../user/user.entity";
import {File} from "../file/file.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        private readonly userService: UserService,
        private readonly fileService: FileService,
    ) {}

    async getAllPosts() {
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
            profileImagePath: post.user.files[0]?.filePath || '/public/image/profile/default.jpg', // 프로필 이미지 경로
            filePath: post.files[0]?.filePath || null, // 게시글에 첨부된 파일 경로
            commentsCount: post.commentCount // 댓글 수
        }));
    }





    async getPostById(postId: number) {

    }

    async addPost(
        requestBody: {
            userId: number;
            postTitle: string;
            postContent: string;
            attachFilePath?: string;
        }
    ) {
        const { userId, postTitle, postContent, attachFilePath } = requestBody;

        const writerNickname = await this.userService.getNickname(userId);

        if (!writerNickname) {
            throw new NotFoundException('User not found');
        }

        // 새 Post 객체를 생성합니다.
        let newPost = this.postRepository.create({
            userId,
            nickname: writerNickname,
            postTitle,
            postContent,
        });

        // 새 Post를 먼저 저장하여 postId를 생성합니다.
        newPost = await this.postRepository.save(newPost);

        // 파일이 있는 경우 fileId를 설정하고 다시 저장합니다.
        if (attachFilePath) {
            const postFile = await this.fileService.createPostImage(userId, newPost.postId, attachFilePath);
            newPost.fileId = postFile.fileId;
            await this.postRepository.save(newPost);
        }

        return newPost;
    }

    async updatePost(postId: number, postTitle: string, postContent: string) {

    }

    async deletePost(postId: number) {

    }
}
