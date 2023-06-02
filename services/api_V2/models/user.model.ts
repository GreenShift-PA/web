import mongoose, { Schema, Model } from "mongoose";
import { Role } from "./role.model";
import { Tree } from "./tree.model";

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
    }],
    tree: {
        type: Schema.Types.ObjectId,
        ref: "Tree",
        required: true 
    }
}, {
    versionKey: false,
    collection: "Users"
})

export interface User{
    _id: string,
    login: string,
    password: string,
    roles: string[] | Role[]
    tree: Tree
}

export const UserModel: Model<User> = mongoose.model("User", userShemma)