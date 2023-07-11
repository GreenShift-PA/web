import mongoose, { Schema, Model } from "mongoose";
import { Role } from "./role.model";
import { Tree } from "./tree.model";
import { Post } from "./post.model";
import { Todo } from "./todo.model";

const subtaskShemma = new Schema<Subtask>({
    isDone: {
        type: Schema.Types.Boolean,
        required : true
    },
    title:{
        type: Schema.Types.String,
        require: true
    },
    description:{
        type: Schema.Types.String,
        required: true
    },
    masterTask: {
        type: Schema.Types.ObjectId,
        ref: "Todo",
        required: true 
    }
}, {
    versionKey: false,
    collection: "Subtasks"
})

export interface Subtask{
    _id: string,
    isDone: boolean,
    title: string,
    description: string,
    masterTask: Todo
}

export const SubtaskModel: Model<Subtask> = mongoose.model("Subtask", subtaskShemma)