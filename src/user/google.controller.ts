import { Controller, Get, Query, Res } from '@nestjs/common'
import { AuthService } from '../auth/auth.service'
import { UserService } from './user.service'
import { Response } from 'express'

@Controller('auth/google')
export class GoogleController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Get('redirect')
    async googleCallback(@Query('code') code: string, @Res() res: Response) {
        try {
            const googleUser = await this.userService.getGoogleUser(code)
            const user = await this.userService.findOrCreate('google', {
                id: googleUser.id,
                username: googleUser.email,
                nickname: googleUser.name || googleUser.email,
                email: googleUser.email,
                avatar: googleUser.picture,
            })

            const token = await this.authService.login(user)
            return token
            // res.redirect(`http://your-frontend.com?token=${token.access_token}`)
        } catch (error) {
            res.status(500).json({
                message: 'Failed to authenticate with Google',
            })
        }
    }
}
