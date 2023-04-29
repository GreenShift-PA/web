import { UserService } from "./user.service"

export class PostService {

    static getPost = async (post_id: number, pool:any): Promise<Array<string> | Boolean> => {
        const [post] = await pool.query(
            `SELECT * FROM Post
            WHERE Post.ID = ?
            ORDER BY date DESC
            `, [post_id])
        if(post.length === 0){ 
            return false
        }
        return post
    }

    static newPost = async (user_id: number, title: string, description: string, pool:any): Promise<Boolean> => {
        // Get user's tree id 
        const [user_tree_id] = await UserService.getUserTreeInfo(user_id, pool)
        
        const [post] = await pool.query(`
        INSERT INTO Post (
            user_id, tree_id, title, description, likes, is_valid) 
        VALUES (
            ?, ?, ?, ?, '0', '0')
        `, [user_id, user_tree_id.ID, title, description ])
        
        if (post.affectedRows > 0){
            return true
        }
        return false
    }
}