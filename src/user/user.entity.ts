import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Comment } from '../comment/comment.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    githubId: string

    @Column({ nullable: true })
    googleId: string

    @Column()
    username: string

    @Column({ nullable: true })
    nickname: string

    @Column({ nullable: true })
    email: string

    @Column({ nullable: true })
    avatar: string

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]
}
