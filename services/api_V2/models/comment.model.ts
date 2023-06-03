import mongoose, { Schema, Model } from "mongoose";
import { User } from "./user.model";

const commentShemma = new Schema<Comment>({
    description: {
        type: Schema.Types.String,
        required : true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    versionKey: false,
    collection: "Comments"
})

export interface Comment{
    description: string,
    author: User
}

export const CommentModel: Model<Comment> = mongoose.model("Comment", commentShemma)