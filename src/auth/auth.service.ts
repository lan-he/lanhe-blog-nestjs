import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/user.entity'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(user: User) {
        console.log(user, 'user-------------')

        const payload = {
            sub: user.id,
            githubId: user.githubId,
            googleId: user.googleId,
            username: user.username,
            nickname: user.nickname,
            email: user.email,
            avatar: user.avatar,
        }
        console.log(
            this.jwtService.sign(payload),
            'sssssssssssssssssssssssssssss9999999999999'
        )
        return this.jwtService.sign(payload)
    }
}
