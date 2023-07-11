import mongoose, { Schema, Model } from "mongoose";
import { User } from "./user.model";

const messageShemma = new Schema<Message>({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: Schema.Types.String,
        required: true
    },
    date: {
        type: Schema.Types.Date,
        required: true
    }
}, {
    versionKey: false,
    collection: "Messages"
})

export interface Message{
    from: User,
    to: User,
    message: string,
    date: Date
}

export const MessageModel: Model<Message> = mongoose.model("Message", messageShemma)