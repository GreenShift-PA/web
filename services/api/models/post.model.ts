import mongoose, { Schema, Model } from "mongoose";
import { User } from "./user.model";
import { Comment } from "./comment.model";
import { Tree } from "./tree.model";

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
        type: Schema.Types.ObjectId,
        def: "User",
        required: true
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    }],
    whoValidates: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    treeLinked: {
        type: Schema.Types.ObjectId,
        ref: "Tree",
        required: true
    },
    creationDate: {
        type: Schema.Types.Date,
        required: true
    },
    userId: {
        type: Schema.Types.String,
        required: true
    }
}, {
    versionKey: false,
    collection: "Posts"
})

export interface Post{
    _id: string
    title: string |undefined
    description: string
    like: User[]
    comments: Comment[]
    whoValidates: User[]
    treeLinked : Tree
    creationDate : Date
    userId: string
}


export const PostModel: Model<Post> = mongoose.model("Post", postShemma)