export class MessageService {

    static getAllConversations = async (user_id: number, pool: any) => {
        const [conv] =  await pool.query(
            `SELECT DISTINCT 
                CONCAT_WS('_', GREATEST(Message.from_user_id, Message.to_user_id), LEAST(Message.from_user_id, Message.to_user_id)) as conversation_id ,
                MAX(Message.date) AS last_message_date, 
                MAX(u1.ID) as sender_id,
                CONCAT_WS(' ', MAX(u1.name), MIN(u1.firstname)) as sender_fullname,
                MAX(u2.ID) as receiver_id,
                CONCAT_WS(' ', MIN(u2.name), MAX(u2.firstname)) as receiver_fullname
            FROM Message
            INNER JOIN User as u1 ON Message.from_user_id = u1.ID
            INNER JOIN User as u2 ON Message.to_user_id = u2.ID
            WHERE u1.ID = ?
            GROUP BY conversation_id
            ORDER BY last_message_date DESC;`
        ,[user_id])
        if(conv.length === 0){ 
            return false
        }
        return conv
    }

    static getConversation = async (user_id_From:number, user_id_To:number, pool: any) => {
        const params = {
            user_id_1: user_id_From, 
            user_id_2: user_id_To
        }
        // TODO: Changed parameter assignment to avoid injection  
        const [conv] =  await pool.query(
            `SELECT *
            FROM (
                SELECT 
                    Message.content,
                    u1.ID as sender_id,
                    CONCAT_WS(' ', u1.name, u1.firstname) as sender_fullname,
                    u2.ID as receiver_id,
                    CONCAT_WS(' ', u2.name, u2.firstname) as receiver_fullname,
                    Message.date
                FROM Message 
                INNER JOIN User as u1 ON Message.from_user_id = u1.id
                INNER JOIN User as u2 ON Message.to_user_id = u2.id
                WHERE (Message.from_user_id = ${user_id_From} AND Message.to_user_id = ${user_id_To}) 
                OR (Message.from_user_id = ${user_id_To} AND Message.to_user_id = ${user_id_From})
                ORDER BY Message.date DESC
                LIMIT 15 OFFSET 0
            ) subquery
            ORDER BY subquery.date DESC;`)
            if(conv.length === 0){ 
                return false
            }
            return conv
    }
}