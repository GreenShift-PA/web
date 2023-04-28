import { TreeService } from "./tree.service"

export class UserService {


    static getUser = async (user_id: number, pool: any):Promise<Array<string> | Boolean> => {
        const [user] =  await pool.query("SELECT * FROM User WHERE ID = ? ", [user_id])
            if(user.length === 0){ 
                return false
            }
        return user
    }

    static isUser = async (user_id: number, pool: any):Promise<boolean> => {
        const [user] =  await pool.query("SELECT * FROM User WHERE ID = ? ", [user_id])
            if(user.length === 0){ 
                return false
            }
        return true
    }

    static getAllUsers = async (pool:any): Promise<Array<string> | boolean> => {
        const [users] =  await pool.query("SELECT * FROM User")
            if(users.length === 0){ 
                return false
            }

        return users
    }

    static deleteUserById = async (user_id: number, pool: any): Promise<boolean> => {
        await pool.query("DELETE FROM User WHERE ID = ? ", [user_id])
        
        return true
    }

    static createUser = async (user_name: string, user_firstname: string, user_email: string, user_phone: string, user_country: string, pool:any):Promise<boolean> => {
        const [user] =  await pool.query(`
        INSERT INTO User (
            name, 
            firstname, 
            email, 
            phone, 
            country
        ) VALUES (
            ?, ?, ?, ?, ?)
        `, [user_name, user_firstname, user_email, user_phone, user_country])

        const tree_answer = await TreeService.createTree(user.insertId, pool)
        
        if (user.affectedRows > 0 && tree_answer){
            return true
        }
        
        return false
    }
}