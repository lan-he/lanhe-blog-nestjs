import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common'
import { ArticleService } from './article.service'
import { Article } from './article.entity'

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    async findAll(): Promise<Article[]> {
        return this.articleService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Article> {
        return this.articleService.findOne(id)
    }

    @Post()
    async create(@Body() article: Partial<Article>): Promise<Article> {
        return this.articleService.create(article)
    }

    @Put(':id/view')
    async incrementViews(@Param('id') id: number): Promise<Article> {
        return this.articleService.incrementViews(id)
    }

    @Put(':id/like')
    async incrementLikes(@Param('id') id: number): Promise<Article> {
        return this.articleService.incrementLikes(id)
    }
}
