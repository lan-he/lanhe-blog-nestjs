import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Comment } from '../comment/comment.entity'

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    content: string

    @Column({ default: 0 })
    views: number

    @Column({ default: 0 })
    likes: number

    @OneToMany(() => Comment, (comment) => comment.article)
    comments: Comment[]
}
