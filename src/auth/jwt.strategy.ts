import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '../user/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'default_secret',
        })
    }

    async validate(payload: any): Promise<User> {
        // 从数据库中查询完整的用户信息
        const user = await this.userRepository.findOne({
            where: { id: payload.sub },
            relations: ['comments'], // 加载 comments 关系
        })

        if (!user) {
            throw new Error('用户不存在')
        }

        return user
    }
}
