import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Article } from './article.entity'

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>
    ) {}

    async findAll(): Promise<Article[]> {
        return this.articleRepository.find()
    }

    async findOne(id: number): Promise<Article> {
        return this.articleRepository.findOne({ where: { id } })
    }

    async create(article: Partial<Article>): Promise<Article> {
        const newArticle = this.articleRepository.create(article)
        return this.articleRepository.save(newArticle)
    }

    async incrementViews(id: number): Promise<Article> {
        const article = await this.articleRepository.findOne({ where: { id } })
        article.views += 1
        return this.articleRepository.save(article)
    }

    async incrementLikes(id: number): Promise<Article> {
        const article = await this.articleRepository.findOne({ where: { id } })
        article.likes += 1
        return this.articleRepository.save(article)
    }
}
