import mongoose, { Schema, Model } from "mongoose";
import { User } from "./user.model";
import { Comment } from "./comment.model";

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
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true
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
    comments: Comment[]
}


export const PostModel: Model<Post> = mongoose.model("Post", postShemma)