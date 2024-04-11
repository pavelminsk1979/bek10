import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import * as dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config()

const  req = supertest(app)

describe('/auth',()=>{



    beforeAll(async ()=>{

        const mongoUri = process.env.MONGO_URL ;

        if(!mongoUri){
            throw new Error('URL not find(file mongoDb/1')
        }

        await mongoose.connect(mongoUri
            ,{ dbName:process.env.DB_NAME });


        await req
            .delete ('/testing/all-data')
    })

    afterAll(async () => {
        await mongoose.disconnect()
    });



    const loginPasswordBasic64='YWRtaW46cXdlcnR5'
    const loginNewUser ='2222222'
    const passwordNewUser ='222222pasw'
    const emailNewUser ='pavelminsk1979@mail.ru'

    it('POST create newUsers',async ()=>{
        const res =await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ login: loginNewUser,
                password: passwordNewUser,
                email:emailNewUser})
            .expect(STATUS_CODE.CREATED_201)

        expect(res.body.login).toEqual(loginNewUser)
        expect(res.body.email).toEqual(emailNewUser)
    })


    it(' send letter by  pavelminsk1979@mail.ru with new code ',async ()=>{
        const res =await req
            .post('/auth/password-recovery')
            .send({email:emailNewUser})
            .expect(STATUS_CODE.NO_CONTENT_204)

    })




})