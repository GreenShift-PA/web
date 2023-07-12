import { Document } from "mongoose";
import { Tree } from "../models";

export class TreeService {
    static async treeAddScore(tree: (Document<unknown, {}, Tree> & Omit<Tree & Required<{_id: string;}>, never>), score:number):Promise<boolean> {
        // Updates tree score by adding score to tree.size
        tree.size = tree.size + score
        tree.save()
        
        return false
    }
}