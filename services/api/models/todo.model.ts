import mongoose, { Schema, Model } from "mongoose";
import { Subtask } from "./subtask.model";

const todoShemma = new Schema<Todo>({
    isDone: {
        type: Schema.Types.Boolean,
        required: true
    },
    title: {
        type: Schema.Types.String,
        require: true
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
    deadline: {
        type: Schema.Types.Date,
        required: true
    },
    subtask: [{
        type: Schema.Types.ObjectId,
        ref: "Subtask",
        required: true
    }],
    isReview: {
        type: Schema.Types.Boolean,
        required: true
    },
    difficulty: {
        type: Schema.Types.Number,
        required: true
    },
    creationDate: {
        type: Schema.Types.Date,
        required: true
    }
}, {
    versionKey: false,
    collection: "Todos"
})

export interface Todo {
    _id: string,
    isDone: boolean,
    title: string,
    description: string,
    deadline: Date,
    subtask: Subtask[],
    isReview: boolean,
    difficulty: number,
    creationDate: Date
}

export const TodoModel: Model<Todo> = mongoose.model("Todo", todoShemma)