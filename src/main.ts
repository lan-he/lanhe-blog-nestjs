import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.enableCors({
        origin: true, // 允许所有域名访问，或者指定前端域名，例如 ['https://your-frontend.com']
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的 HTTP 方法
        credentials: true, // 允许发送 Cookie
    })
    app.useGlobalInterceptors(new ResponseInterceptor()) // 全局注册拦截器
    app.useGlobalFilters(new HttpExceptionFilter()) // 全局注册异常过滤器
    // 监听动态端口
    const port = process.env.PORT || 3000
    // 日志输出，检查是否正常执行
    console.log(`Server is starting on port ${port}`)
    await app.listen(port)
}
bootstrap()
