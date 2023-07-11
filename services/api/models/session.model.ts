import mongoose, { Schema, Model } from "mongoose";
import { User } from "./user.model";

const sessionShemma = new Schema<Session>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    platform:{
        type: Schema.Types.String
    },
}, {
    versionKey: false,
    collection: "Sessions"
})

export interface Session{
    _id: string
    user: string | User
    platform? : string
}


export const SessionModel: Model<Session> = mongoose.model("Session", sessionShemma)