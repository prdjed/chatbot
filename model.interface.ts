import { Document } from 'mongoose';
export interface IModel extends Document{
    readonly question: string;
    readonly answer: string;
}