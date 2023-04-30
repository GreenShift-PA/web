export class CommentService{

    static getComment = async (comment_id: number, pool:any): Promise<Array<string> | boolean > => {

        const [comment] = await pool.query(`
            SELECT * FROM Comment
            WHERE Comment.ID = ?
        `, [comment_id])

        if(comment.length === 0){ 
            return false
        }
        return comment
    }

    static deleteComment = async (comment_id: number, pool:any): Promise<boolean> => {

        const [comment] = await pool.query(`
        DELETE FROM Comment WHERE Comment.ID = ?
        `, [comment_id])

        if (comment.affectedRows > 0){
            return true
        }
        return false
    }
}