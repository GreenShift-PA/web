import mongoose, { Schema, Model } from "mongoose";

const roleShemma = new Schema<Role>({
    name: {
        type: Schema.Types.String,
        unique: true,
        required : true
    }
}, {
    versionKey: false,
    collection: "Roles"
})

export interface Role{
    name: string
}

export const RoleModel: Model<Role> = mongoose.model("Role", roleShemma)