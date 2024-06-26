import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";


const  req = supertest(app)

describe.skip('/videos',()=>{

    beforeAll(async ()=>{
        await req
            .delete ('/testing/all-data')
    })
    afterAll(async ()=>{

    })
    it('get content',async ()=>{
        const res = await req
            .get('/videos')
            .expect(STATUS_CODE.SUCCESS_200)

        expect(res.body).toEqual([])
        //console.log(res.body)
    })


    it('- POST does not create the video with incorrect data (no title, no author)', async ()=> {
        const res =await req
            .post('/videos')
            .send({ title: '', author: '' })
            .expect(STATUS_CODE.BAD_REQUEST_400)

        expect(res.body).toEqual({  errors: [
                { msg: 'Incorrect title', value: '', type: 'field', path: 'title', location: 'body' },
                { msg: 'Incorrect author', value: '', type: 'field', path: 'author', location: 'body' },
            ]})


        const getRes = await req.get('/videos/')
        expect(getRes.body).toEqual([])
    })

    let idVideo:number
    it('POST create video',async ()=>{
        const res =await req
            .post('/videos')
            .send({ title: 'TTTTT', author: 'AAuthor' })
            .expect(STATUS_CODE.CREATED_201)
        idVideo=res.body.id
        expect(res.body.author).toEqual('AAuthor')
        expect(res.body.title).toEqual('TTTTT')
    })

    it('Get video bu incorrect id',async ()=>{
        const res =await req
            .get('/videos/' + idVideo)
            .expect(STATUS_CODE.SUCCESS_200)
        expect(res.body.author).toEqual('AAuthor')
    })

    it('Get video bu correct id',async ()=>{
        await req
            .get('/videos/' + 555)
            .expect(STATUS_CODE.NOT_FOUND_404)
    })


    it('- PUT videos by incorrect ID ', async () => {

        await req
            .put('/videos/' + 1223)
            .send({ title: 'title', author: 'title' })
            .expect(STATUS_CODE.NOT_FOUND_404)

        const getRes =await req
            .get('/videos/')
        expect(getRes.body.length).toBe(1)
        expect(getRes.body[0].author).toEqual('AAuthor')
        expect(getRes.body[0].id).toEqual(idVideo)
    })

    it('+ PUT videos by ID with correct data', async () => {
        await req
            .put('/videos/' + idVideo)
            .send({
                title: 'hello title',
                author: 'hello author',
            })
            .expect(STATUS_CODE.NO_CONTENT_204)

        const getRes =await req
            .get('/videos/')
        expect(getRes.body[0].title).toEqual('hello title')
        expect(getRes.body[0].author).toEqual('hello author')
        expect(getRes.body[0].id).toEqual(idVideo)

    })

    it('- PUT videos by ID  with incorrect data', async () => {
        const res=await req
            .put('/videos/' + idVideo)
            .send({
                author: 'hello author2',
            })
            .expect(STATUS_CODE.BAD_REQUEST_400)
        expect(res.body).toEqual({  errors: [
                { msg: 'Incorrect title', value: '', type: 'field', path: 'title', location: 'body' }
            ]})

        const getRes =await req
            .get('/videos/')
        expect(getRes.body[0].title).toEqual('hello title')
        expect(getRes.body[0].author).toEqual('hello author')
        expect(getRes.body[0].id).toEqual(idVideo)

    })


    it('- DELETE video by incorrect ID', async () => {
        await req
            .delete('/videos/' + 888)
            .expect(STATUS_CODE.NOT_FOUND_404)

        const getRes =  await req
            .get('/videos')

        //console.log(getRes.body)

        expect(getRes.body.length).toBe(1)
        expect(getRes.body[0].author).toEqual('hello author')
        expect(getRes.body[0].id).toEqual(idVideo)

    })

    it('+ DELETE video by correct ID', async () => {
        await req
            .delete('/videos/' + idVideo)
            .expect(STATUS_CODE.NO_CONTENT_204)

        const getRes =  await req
            .get('/videos')
        expect(getRes.body.length).toBe(0)
    })
})


