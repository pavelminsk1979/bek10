import { usersCollection} from "../../db/mongoDb";
import { User} from "../../allTypes/userTypes";
import {ObjectId} from "mongodb";


export const usersRepository={

    async createUser(newUser: User) {

        const result = await usersCollection.insertOne(newUser)
        return result
    },

    async deleteUserById(id:string):Promise<boolean> {

        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})

        return !!result.deletedCount
    },

    async findUserByConfirmationCode (code:string){
        return await usersCollection.findOne({
            "emailConfirmation.confirmationCode":code
        })
    },

    async findUserByEmail (email:string){
        return await usersCollection.findOne({email})
    },

    async updateFlagIsConfirmedForUser(code:string){

        const result = await usersCollection.updateOne({"emailConfirmation.confirmationCode": code}, {
            $set: {"emailConfirmation.isConfirmed":true}
        })

        return !!result.matchedCount
    },



    async updateCodeConfirmationAndExpirationDate(email:string,newCode:string,newDate:Date){

        const result = await usersCollection.updateOne({email}, {
            $set: {"emailConfirmation.confirmationCode":newCode,"emailConfirmation.expirationDate":newDate}
        })

        return !!result.matchedCount
    },


    async findUserWithAllPropetiesById(id: string) {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        if (!user) return null

        return user
    },

    async updateBlackListRefreshTokenForUser(email:string,token: string){

        const result = await usersCollection.updateOne({email},
            {$push: { blackListRefreshToken: token }})

        return !!result.matchedCount
    },

}