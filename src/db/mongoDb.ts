import {MongoClient, WithId} from 'mongodb'
import dotenv from 'dotenv'
import {Blog} from "../allTypes/blogTypes";
import {Post} from "../allTypes/postTypes";
import { User} from "../allTypes/userTypes";
import {Comment} from "../allTypes/commentTypes";
import {Visit} from "../allTypes/visitTypes";
import {UsersDevices} from "../allTypes/usersDevicesTypes";
//снизу одна строка  для подключенин mongoose к базе данных
import mongoose from 'mongoose'


dotenv.config()


const mongoUri = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';

/*MONGO_URL -- представляет URL для подключения к MongoDB, используя MongoDB Atlas

'mongodb://0.0.0.0:27017'-предполагает, что MongoDB запущен локально на вашем компьютере. Вы можете использовать эту строку, если у вас есть локально установленный и запущенный сервер MongoDB.*/



if(!mongoUri){

    throw new Error('URL not find(file mongoDb.ts:14')
}




const client = new MongoClient(mongoUri)

const db = client.db('projectHW')

//снизу одна строка  для подключенин mongoose к базе данных
const dbName = 'projectHW'

export const postsCollection = db.collection<Post>('posts')

export const blogsCollection = db.collection<Blog>('blogs')

export const usersCollection = db.collection<User>('users')

export const commentsCollection = db.collection<Comment>('comments')

export const visitsCollection = db.collection<Visit>('visits')

export const usersDevicesCollection = db.collection<UsersDevices>('usersDevices')


//снизу Scheme  для подключенин mongoose к базе данных
const userScheme = new mongoose.Schema<User>({
    passwordHash: String,
    login: String,
    email: String,
    createdAt: Date,
    emailConfirmation:{
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed:Boolean
    },
    blackListRefreshToken:[String]
})

//снизу userOutputModel  для  mongoose к базе данных
    //export const userOutputModel=mongoose.model('users',userScheme)
export const userOutputModel = mongoose.model<User>('User', userScheme, 'users');
    //'users'   в базе данных будет подраздел под таким названием

export async function runDb() {
    try {

        //await client.connect()

        //снизу одна строка  для подключенин mongoose к базе данных
        await mongoose.connect(mongoUri ,{ dbName });

        /*  ---MONGO_URL -- представляет URL для подключения к MongoDB, используя MongoDB Atlas
          ---dbName- устанавливаю  имя базе данных*/

        console.log('Connected successful with mongoDB')
    } catch (e) {
        console.log(e + 'Connected ERROR with mongoDB')
        await client.close()
        //снизу одна строка  для подключенин mongoose к базе данных
        await mongoose.disconnect()
    }
}