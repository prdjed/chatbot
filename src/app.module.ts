import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatgptApiModule } from './chatgpt-api/chatgpt-api.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [ChatgptApiModule, ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO,{dbName:"chatbot"})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
