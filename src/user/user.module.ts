import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UserService } from './user.service'
import { GithubController } from './github.controller'
import { GoogleController } from './google.controller'
import { AuthModule } from '../auth/auth.module' // 确保路径正确

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), // 注册 User 实体
        forwardRef(() => AuthModule), // 使用 forwardRef 解决循环依赖
    ],
    controllers: [GithubController, GoogleController],
    providers: [UserService],
    exports: [TypeOrmModule.forFeature([User])], // 导出 UserRepository
})
export class UserModule {}
