import {Comment} from "../../allTypes/commentTypes";
import { commentsModel} from "../../db/mongoDb";
import {ObjectId} from "mongodb";

export const commentsRepository = {

    async createComment(newComment: Comment) {

        const result = await commentsModel.create(newComment)

        return result
    },

    async deleteComentById(id:string){

        const result = await commentsModel.deleteOne({_id:new ObjectId(id)})

        return !!result.deletedCount

    },

    async updateComment(commentId:string,content:string){

        const result = await commentsModel.updateOne({_id: new ObjectId(commentId)},{
            $set:{content}
        })

        return !!result.matchedCount
    }

}