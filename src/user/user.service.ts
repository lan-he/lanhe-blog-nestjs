import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService
    ) {}

    async getGithubUser(code: string): Promise<any> {
        const clientId = this.configService.get<string>('GITHUB_CLIENT_ID')
        const clientSecret = this.configService.get<string>(
            'GITHUB_CLIENT_SECRET'
        )
        console.log(code, clientId, clientSecret, '111111111111111111')

        const { data } = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: clientId,
                client_secret: clientSecret,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )

        const accessToken = data.access_token
        console.log(accessToken, '22222222222222222222222222')

        const { data: githubUser } = await axios.get(
            'https://api.github.com/user',
            {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        console.log(githubUser, 'githubUser')

        return githubUser
    }

    async getGoogleUser(code: string): Promise<any> {
        const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID')
        const clientSecret = this.configService.get<string>(
            'GOOGLE_CLIENT_SECRET'
        )
        const redirectUri = this.configService.get<string>(
            'GOOGLE_CALLBACK_URL'
        )

        const { data: tokenData } = await axios.post(
            'https://oauth2.googleapis.com/token',
            {
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }
        )

        const accessToken = tokenData.access_token

        const { data: googleUser } = await axios.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        return googleUser
    }

    async findOrCreate(
        provider: 'github' | 'google',
        userData: any
    ): Promise<User> {
        const { id, username, nickname, email, avatar } = userData

        const where =
            provider === 'github' ? { githubId: id } : { googleId: id }
        let user = await this.userRepository.findOne({ where })

        if (!user) {
            user = this.userRepository.create({
                [provider === 'github' ? 'githubId' : 'googleId']: id,
                username,
                nickname,
                email,
                avatar,
            })
            await this.userRepository.save(user)
        }

        return user
    }
}
