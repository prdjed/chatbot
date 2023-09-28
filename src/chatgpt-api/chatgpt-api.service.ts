import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenAI } from "openai";
import * as fs from "fs";
import { buffer } from 'stream/consumers';
import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'model';
import { IModel } from 'model.interface';
import { Model } from 'mongoose';

@Injectable()
export class ChatgptApiService {
    private readonly openAiApi: OpenAI;
    constructor(@InjectModel('model') private model:Model<IModel>) {
        this.openAiApi = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        });
    }

    async uploadTrainingFileAndTrain() {
        try {
            const filesThatExist = (await this.openAiApi.files.list()).data

            filesThatExist.map((file) => {
                console.log(file.id)
                this.openAiApi.files.del(file.id)
                // this.openAiApi.fineTuning.jobs.cancel(file.id)
            })

            const file = await this.openAiApi.files.create({ file: fs.createReadStream("uploads/trainMe.jsonl"), purpose: 'fine-tune' });
            // console.log(file)
            // return await this.openAiApi.files.list()
            const fineTune = await this.openAiApi.fineTuning.jobs.create({ training_file: file.id, model: 'gpt-3.5-turbo-0613' })
            console.log(fineTune)
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async getAnswer(question: string) {
        try {
            return await this.openAiApi.chat.completions.create({
                model: 'ft:gpt-3.5-turbo-0613:personal::83iwkjky',
                messages: [{ "role": "user", "content": question }],
            });

            // const completion = await this.openAiApi.chat.completions.create({
            //     messages: [{ role: "system", content: "You are a helpful assistant." }],
            //     model: "ft:gpt-3.5-turbo:my-org:custom_suffix:id",
            //   });
        } catch (error) {
            console.log(error)
        }
    }

    // async train(){
    //     return await this.openAiApi
    // }

    async getJobs() {
        const list = await this.openAiApi.fineTuning.jobs.list();

        for await (const fineTune of list) {
            console.log(fineTune);
        }
    }

    async createModel(question, answer): Promise<IModel> {
        const doc = {question, answer}
        const newModel = await new this.model(doc);
        return newModel.save();
     }

     async getModel(){
        const allData = await this.model.find();
        if (!allData || allData.length == 0) {
            throw new NotFoundException('Students data not found!');
        }
        return allData;
     }

     async deleteModel(question:string){
        return await this.model.deleteMany({question:question})
     }
}
