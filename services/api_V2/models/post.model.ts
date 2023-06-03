import mongoose, { Schema, Model } from "mongoose";
import { User } from "./user.model";

const postShemma = new Schema<Post>({
    title: {
        type: Schema.Types.String, 
        required: true
    },
    description:{
        type: Schema.Types.String,
        required: true
    },
    like: [{
        type: Schema.Types.String,
        def: "User"  
    }]
}, {
    versionKey: false,
    collection: "Posts"
})

export interface Post{
    _id: string
    title: string 
    description: string
    like: User[]
}


export const PostModel: Model<Post> = mongoose.model("Post", postShemma)