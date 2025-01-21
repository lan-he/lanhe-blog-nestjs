import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm'
import { Article } from '../article/article.entity'
import { User } from '../user/user.entity'

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string

    @ManyToOne(() => Article, (article) => article.comments)
    @JoinColumn({ name: 'article_id' })
    article: Article

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User

    @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
    @JoinColumn({ name: 'parent_comment_id' }) // 显式指定列名
    parentComment: Comment

    @OneToMany(() => Comment, (comment) => comment.parentComment)
    replies: Comment[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date
}
