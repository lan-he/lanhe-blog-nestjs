import { Controller, Get, Query, Res } from '@nestjs/common'
import { AuthService } from '../auth/auth.service'
import { UserService } from './user.service'
import { Response } from 'express'

@Controller('auth/github')
export class GithubController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService // 注入 AuthService
    ) {}
    @Get()
    async githubCallback(@Query('code') code: string) {
        try {
            const githubUser = await this.userService.getGithubUser(code)
            const user = await this.userService.findOrCreate('github', {
                id: githubUser.id.toString(),
                username: githubUser.login,
                nickname: githubUser.name || githubUser.login,
                email: githubUser.email || '',
                avatar: githubUser.avatar_url,
            })
            const token = await this.authService.login(user)
            return {
                ...user,
                token,
            }
            // res.redirect(`http://your-frontend.com?token=${token.access_token}`)
        } catch (error) {
            throw new Error('Failed to authenticate with GitHub')
        }
    }
}
