import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GomokuGateway } from './gomoku/gomoku.gateway'
import { UserModule } from './user/user.module'
import { ArticleModule } from './article/article.module'
import { CommentModule } from './comment/comment.module'
import { AuthModule } from './auth/auth.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 全局可用
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: 'postgres://neondb_owner:qzTOHanS2XW5@ep-square-block-a1gd3z16-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require', // Neon 数据库的连接 URL
            entities: [__dirname + '/**/*.entity{.ts,.js}'], // 自动加载所有实体
            synchronize: true, // 自动同步数据库结构，生产环境建议关闭
        }),
        UserModule, // 导入 UserModule
        ArticleModule, // 导入 ArticleModule
        CommentModule, // 导入 CommentModule
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, GomokuGateway],
})
export class AppModule {}
