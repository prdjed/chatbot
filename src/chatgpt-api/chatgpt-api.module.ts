import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatgptApiController } from './chatgpt-api.controller';
import { ChatgptApiService } from './chatgpt-api.service';
import { ModelSchema } from 'model';

@Module({
  imports:[MongooseModule.forFeature([{name: "model",schema: ModelSchema}])],
  controllers: [ChatgptApiController],
  providers: [ChatgptApiService]
})
export class ChatgptApiModule {}
