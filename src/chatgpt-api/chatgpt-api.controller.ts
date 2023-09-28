import { Body, Controller, Get, Post, UseInterceptors, UploadedFile, Delete, Param } from '@nestjs/common';
import { ChatgptApiService } from './chatgpt-api.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from "fs"
import { diskStorage } from 'multer';

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `trainMe.jsonl`);
    },
});

@Controller('chatgpt-api')
export class ChatgptApiController {
    constructor(private readonly service: ChatgptApiService) {
    }

    @Post('/train')
    @UseInterceptors(FileInterceptor('file', { storage }))
    uploadTrainingFileAndTrain(@UploadedFile() file: Express.Multer.File) {
        // fs.readFile(file.buffer, "utf8", function(err, data) {console.log(data)});
        return this.service.uploadTrainingFileAndTrain()
    }

    @Get('/message')
    getAnswer(@Body() data) {
        // console.log(this.service.getAnswer(data.question))
        return this.service.getAnswer(data.question)
    }

    @Get('/getJobs')
    train() {
        return this.service.getJobs()
    }

    @Post('/question')
    addQuestion(@Body() body) {
        return this.service.createModel(body.question, body.answer);
    }

    @Get("/question")
    getQuestion() {
        return this.service.getModel()
    }

    @Delete('/question')
    public delete(@Body() body): void {
        this.service.deleteModel(body.question);
    }

}
