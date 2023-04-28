
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
}