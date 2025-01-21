import {
    Controller,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Get,
} from '@nestjs/common'
import { CommentService } from './comment.service'
import { AuthGuard } from '@nestjs/passport'
import { User } from '../decorators/user.decorator'

@Controller('articles/:articleId/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createComment(
        @Param('articleId') articleId: number,
        @User() user: any,
        @Body('content') content: string,
        @Body('parentCommentId') parentCommentId?: number
    ) {
        return this.commentService.createComment(
            articleId,
            user.id,
            content,
            parentCommentId
        )
    }

    @Get()
    async getComments(@Param('articleId') articleId: number) {
        return this.commentService.getCommentsByArticleId(articleId)
    }

    @Delete(':commentId')
    @UseGuards(AuthGuard('jwt'))
    async deleteComment(
        @Param('commentId') commentId: number,
        @User() user: any
    ) {
        return this.commentService.deleteComment(commentId, user.id)
    }
}
