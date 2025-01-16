import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // 支持跨域访问（如果需要）
    app.enableCors()

    // 监听动态端口
    const port = process.env.PORT || 3000
    // 日志输出，检查是否正常执行
    console.log(`Server is starting on port ${port}`)
    await app.listen(port)
}
bootstrap()
