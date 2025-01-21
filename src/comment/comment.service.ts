import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Comment } from './comment.entity'
import { Article } from '../article/article.entity'
import { User } from '../user/user.entity'

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async createComment(
        articleId: number,
        userId: number,
        content: string,
        parentCommentId?: number
    ): Promise<Comment> {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
        })
        if (!article) {
            throw new NotFoundException('文章不存在')
        }

        const user = await this.userRepository.findOne({
            where: { id: userId },
        })
        if (!user) {
            throw new NotFoundException('用户不存在')
        }

        const comment = this.commentRepository.create({
            content,
            article,
            user,
            parentComment: parentCommentId ? { id: parentCommentId } : null, // 关联父评论
        })

        return this.commentRepository.save(comment)
    }
    async getCommentsByArticleId(articleId: number): Promise<Comment[]> {
        // 查询顶级评论
        const comments = await this.commentRepository.query(
            `
          SELECT 
            c.id,
            c.content,
            c.created_at,
            c.updated_at,
            u.id AS user_id,
            u.username AS user_username,
            u.nickname AS user_nickname,
            u.avatar AS user_avatar
          FROM comment c
          LEFT JOIN "user" u ON c.user_id = u.id
          WHERE c.article_id = $1 AND c.parent_comment_id IS NULL
          ORDER BY c.created_at DESC
          `,
            [articleId]
        )

        // 查询每条顶级评论的回复评论
        for (const comment of comments) {
            const replies = await this.commentRepository.query(
                `
            SELECT 
              r.id,
              r.content,
              r.created_at,
              r.updated_at,
              u.id AS user_id,
              u.username AS user_username,
              u.nickname AS user_nickname,
              u.avatar AS user_avatar
            FROM comment r
            LEFT JOIN "user" u ON r.user_id = u.id
            WHERE r.parent_comment_id = $1
            ORDER BY r.created_at ASC
            `,
                [comment.id]
            )

            // 将回复评论附加到顶级评论中
            comment.replies = replies
        }

        console.log('查询结果:', comments) // 打印查询结果
        return comments
    }
    // async getCommentsByArticleId(articleId: number): Promise<Comment[]> {
    //     const comments = await this.commentRepository.query(
    //         `
    //       SELECT * FROM comment
    //       WHERE article_id = $1 AND parent_comment_id IS NULL
    //       ORDER BY created_at DESC
    //     `,
    //         [articleId]
    //     )

    //     console.log('查询结果:', comments) // 打印查询结果
    //     return comments
    // }
    async deleteComment(commentId: number, userId: number): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId, user: { id: userId } },
        })
        if (!comment) {
            throw new NotFoundException('评论不存在或无权删除')
        }

        await this.commentRepository.remove(comment)
    }
}
