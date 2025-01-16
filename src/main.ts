import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 支持跨域访问（如果需要）
  app.enableCors();

  // 监听动态端口
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
