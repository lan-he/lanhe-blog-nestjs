import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/user.entity'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}
    async login(user: User) {
        const payload = {
            sub: user.id,
            githubId: user.githubId,
            googleId: user.googleId,
            username: user.username,
            nickname: user.nickname,
            email: user.email,
            avatar: user.avatar,
        }
        return this.jwtService.sign(payload)
    }
}
