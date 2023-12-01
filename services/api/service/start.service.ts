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
            let userRoles: (Document<unknown, {}, Role> & Omit<Role & {_id: string;}, never>)[] = [];
            const adminRole = roles.find((role) => role.name === "admin");
            const guestRole = roles.find((role) => role.name === "guest");

            if (login.includes("admin")) {
                if (adminRole && guestRole) {
                    userRoles = [adminRole, guestRole];
                }
            } else {
                if (guestRole) {
                    userRoles = [guestRole];
                }
            }
            UserModel.create({
                login,
                password: SecurityUtils.toSHA512("password"),
                firstname : "Michel",
                lastname : "Dupont",
                roles: userRoles,
                tree,
                posts: [],
                todoTask: [],
                image: "IMAGE",
                address : "C'est un utilisateur de test",
                city : "C'est la ville",
                country : "C'est le pays",
                skills : "C'est un utilisateur de test",
                hobbies : "C'est un utilisateur de test",
                job : "C'est un utilisateur de test",
                aboutMe : "C'est un utilisateur de test",
                joinDate : new Date(),
                birthday : new Date(),
                follow: []
            })
        })
        await Promise.all(usersRequest)
    } 
}