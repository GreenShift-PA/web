
export class UserService {


    static getUser = async (user_id: number, pool: any) => {
        const [user] =  await pool.query("SELECT * FROM User WHERE ID = ? ", [user_id])
            if(user.length === 0){ 
                return false
            }
        return user
    }
}



