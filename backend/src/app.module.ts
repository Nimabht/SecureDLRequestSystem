import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsModuleModule } from './requests-module/requests-module.module';

@Module({
  imports: [RequestsModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
