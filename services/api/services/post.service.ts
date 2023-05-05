import { UserService } from "./user.service"

export class PostService {

    static getPost = async (post_id: number, pool:any): Promise<Array<string>> => {
        const [post] = await pool.query(
            `SELECT * FROM Post
            WHERE Post.ID = ?
            ORDER BY date DESC
            `, [post_id])
        if(post.length <= 0){ 
            return []
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

    static postExist = async (post_id: number, pool:any): Promise<Boolean> => {

        const [post] = await pool.query(
            `SELECT * FROM Post
            WHERE Post.ID = ?
            ORDER BY date DESC
            `, [post_id])
        if(post.length <= 0){ 
            return false
        }
        return true
    }

    static deletePost = async (post_id: number, pool:any): Promise<Boolean> => {

        const [answer] = await pool.query(`DELETE FROM Post WHERE Post.ID = ? `, [post_id])

        if (answer.affectedRows > 0){
            return true
        }
        return false
    }

    static getAllComments = async (post_id: number, pool:any): Promise<Array<String> | boolean > => {

        const [comments] = await pool.query(`
        SELECT Comment.ID, Comment.post_id, Comment.user_id, Comment.Description, Comment.likes FROM Comment
        INNER JOIN Post ON Post.ID = Comment.post_id
        WHERE Comment.post_id = ?`, [post_id])

        if(comments.length <= 0){ 
            return false
        }
        return comments

    }

    static getNbrValidation = async (post_id: number, pool:any): Promise<number> => {
        const [nbrValidation] = await pool.query(`SELECT Post.is_valid from Post WHERE Post.ID = ?`, [post_id])

        return nbrValidation[0].is_valid
    }
}