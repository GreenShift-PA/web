export class PostService {

    // Get all post from a user ( by user id )
    static getAllPosts = async (user_id: number , pool: any): Promise<Array<string> | Boolean> => {
        const [posts] = await pool.query(
            `SELECT Post.ID, Post.user_id, Post.tree_id, Post.title, Post.description, Post.likes, Post.is_valid, Post.date FROM Post 
            INNER JOIN User ON User.ID = Post.user_id
            WHERE User.ID = ?
            ORDER BY date DESC
            `, [user_id])

        if(posts.length === 0){ 
            return false
        }
        return posts
    }

}