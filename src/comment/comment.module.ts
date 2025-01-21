import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from './comment.entity'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { Article } from '../article/article.entity'
import { User } from '../user/user.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Article, User])],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
