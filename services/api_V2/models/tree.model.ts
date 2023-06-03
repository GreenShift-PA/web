import mongoose, { Schema, Model } from "mongoose";

const treeShemma = new Schema<Tree>({
    name: {
        type:Schema.Types.String,
        unique: true,
        required: true
    },
    size: {
        type: Schema.Types.Number,
        index: true,
        required : true
    }
}, {
    versionKey: false,
    collection: "Trees"
})

export interface Tree{
    _id: string,
    name: string,
    size: number
}

export const TreeModel: Model<Tree> = mongoose.model("Tree", treeShemma)