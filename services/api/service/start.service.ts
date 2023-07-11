import { Document, Types } from "mongoose"
import { Role, RoleModel, TreeModel, UserModel } from "../models"
import { SecurityUtils } from "../utils"

export class StartService{
    static userRoles = async () => {
        const countRoles = await RoleModel.count().exec()
        if(countRoles !== 0 ){
            return 
        }
    
        const rolesNames: string[] = ["admin", "guest"]
        const rolesRequest = rolesNames.map((name) => {
            RoleModel.create({
                name
            })
        })
        await Promise.all(rolesRequest)
    }

    static createUsers = async ():Promise<void> => {
        const countUsers = await UserModel.count().exec()
        if(countUsers !== 0 ){
            return 
        }
    
        const roles = await RoleModel.find().exec()
        
        const usersNames: string[] = ["admin@mail.com", "guest@mail.com"]

        
        const usersRequest = usersNames.map(async (login) => {
            const tree = await TreeModel.create({
                name: "First tree of " + login.split("@")[0],
                size : 0
            })
            let userRoles:(Document<unknown, {}, Role> & Omit<Role & {_id: Types.ObjectId;}, never>)[] = []
            if (login.includes("admin")){
                userRoles = roles.map((role) => {if(role.name === "admin"){return role} else {return null}}).filter((role) => {if(role){return role} else {return null}}) as (Document<unknown, {}, Role> & Omit<Role & {_id: Types.ObjectId;}, never>)[]
            }else{
                userRoles = roles.map((role) => {if(role.name === "guest"){return role} else {return null}}).filter((role) => {if(role){return role} else {return null}}) as (Document<unknown, {}, Role> & Omit<Role & {_id: Types.ObjectId;}, never>)[]
            }
            UserModel.create({
                login,
                password: SecurityUtils.toSHA512("password"),
                roles: userRoles,
                tree,
                posts: []
            })
        })
        await Promise.all(usersRequest)
    } 
}