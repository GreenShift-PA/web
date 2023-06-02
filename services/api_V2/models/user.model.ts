import mongoose, { Schema, Model } from "mongoose";
import { Role } from "./role.model";

const userShemma = new Schema<User>({
    login: {
        type: Schema.Types.String,
        index: true,
        unique: true,
        required : true
    },
    password:{
        type: Schema.Types.String,
        require: true
    },
    roles:[{
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    }]
}, {
    versionKey: false,
    collection: "Users"
})

export interface User{
    _id: string,
    login: string,
    password: string,
    roles: string[] | Role[]
}

export const UserModel: Model<User> = mongoose.model("User", userShemma)