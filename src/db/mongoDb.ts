import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {Blog} from "../allTypes/blogTypes";
import {Post} from "../allTypes/postTypes";
import { User} from "../allTypes/userTypes";
import {Comment} from "../allTypes/commentTypes";
import {Visit} from "../allTypes/visitTypes";
import {UsersDevices} from "../allTypes/usersDevicesTypes";
import mongoose from 'mongoose'


dotenv.config()


const mongoUri = process.env.MONGO_URL ;

/*MONGO_URL -- представляет URL для подключения к MongoDB, использую MongoDB Atlas
*/


if(!mongoUri){
    throw new Error('URL not find(file mongoDb/1')
}


const client = new MongoClient(mongoUri)


const db = client.db('projectHW')




export const postsCollection = db.collection<Post>('posts')

export const blogsCollection = db.collection<Blog>('blogs')

export const usersCollection = db.collection<User>('users')

export const commentsCollection = db.collection<Comment>('comments')

export const visitsCollection = db.collection<Visit>('visits')

export const usersDevicesCollection = db.collection<UsersDevices>('usersDevices')


//снизу Scheme  для  mongoose
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


//снизу userOutputModel  для  mongoose

export const usersModel = mongoose.model<User>('User', userScheme, 'users');
    //'users'   в базе данных будет подраздел под таким названием

////////////////////////////////////////////////////////////////

const postScheme = new mongoose.Schema<Post>({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})
export const postssModel = mongoose.model<Post>('Post', postScheme, 'posts');



const blogScheme = new mongoose.Schema<Blog>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
})
export const blogsModel = mongoose.model<Blog>('Blog', blogScheme, 'blogs');



const commentScheme = new mongoose.Schema<Comment>({
    content: String,
    createdAt: String,
    commentatorInfo: {
        userId:String,
        userLogin:String
    },
    postId: String,

})
export const commentsModel = mongoose.model<Comment>('Comment', commentScheme, 'comments');


const visitScheme = new mongoose.Schema<Visit>({
    IP: String,
    URL: String,
    date: Date,

})
export const visitsModel = mongoose.model<Visit>('Visit', visitScheme, 'visits');



export async function runDb() {
    try {
        await client.connect()

        //снизу  для  mongoose
        if(!mongoUri){
            throw new Error('URL not find(file mongoDb/2')
        }
        await mongoose.connect(mongoUri ,{ dbName:process.env.DB_NAME });

        /*  ---MONGO_URL -- представляет URL для подключения к MongoDB, используя MongoDB Atlas
          ---dbName- устанавливаю  имя базе данных*/

        console.log('Connected successful with mongoDB')
    } catch (e) {
        console.log(e + 'Connected ERROR with mongoDB')
        await client.close()
        //снизу  для mongoose
        await mongoose.disconnect()
    }
}