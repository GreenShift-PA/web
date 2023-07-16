import mongoose, { Schema, Model } from "mongoose";
import { Subtask } from "./subtask.model";
import { Post } from "./post.model";

const adminTodoShemma = new Schema<AdminTodo>({
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
    difficulty: {
        type: Schema.Types.Number,
        required: true
    },

}, {
    versionKey: false,
    collection: "AdminTodos"
})

export interface AdminTodo {
    _id: string,
    title: string,
    description: string,
    deadline: Date,
    difficulty: number,
}

export const AdminTodoModel: Model<AdminTodo> = mongoose.model("AdminTodo", adminTodoShemma)