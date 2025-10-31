// import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
// import type { MicroserviceOptions } from '@nestjs/microservices';
// import { Transport } from '@nestjs/microservices';
// import { AllRpcExceptionsFilter } from '@shared/core/httpClient/rpcExceptionFillter';

import { AppModule } from './app.module';

async function bootstrap() {
  // const appContext = await NestFactory.createApplicationContext(AppModule);
  // const configService = appContext.get(ConfigService);

  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);

  // const port = configService.get<number>('http.port', 8081);
  const port = '9091';
  // const host = '0.0.0.0';
  const host = 'localhost';
  // const host = configService.get<string>('http.host', '0.0.0.0');

  // app.useGlobalFilters(new AllRpcExceptionsFilter());

  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();
