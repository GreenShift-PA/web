export class TreeService{

    static getAll = async (pool:any): Promise<Array<string> | boolean> => {
        const [trees] = await pool.query('SELECT * FROM Tree')
        if(trees.length === 0){ 
            return false
        }
        return trees
    }

    static getTreeById = async (tree_id: number, pool: any): Promise<Array<string> | boolean> => {
        const [tree] =  await pool.query("SELECT * FROM Tree WHERE ID = ? ", [tree_id])
        if(tree.length === 0){ 
            return false
        }
        return tree
    }

    static createTree = async (user_id: number, pool:any): Promise<boolean> => {
        await pool.query(`
        INSERT INTO Tree 
            (user_id, size) 
        VALUES (?, '0')
        `, [user_id])
        return true
    }
}