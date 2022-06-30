const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const BASE_URL = 'localhost:8080';
let jwtToken;
let todo_id;
let rn = Math.floor(1000 + Math.random() * 9000);

describe('check auth APIs', () => {
    it('check register user', () => {
        return new Promise(async function (resolve, reject){
            try{
                chai.request(BASE_URL)
                    .post('/auth/register')
                    .send({"name":"ajay","email":`ajayvekariya${rn}@gmail.com`,"password":"pass@123"})
                    .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body.status).to.equal(1);
                    resolve();
                });
            }catch(error){
                console.log('error >> ', error);
                resolve();
            }
        })
    });

    it('check login user', () => {
        return new Promise(async function (resolve, reject){
            try{
                chai.request(BASE_URL)
                    .post('/auth/login')
                    .send({"email":`ajayvekariya${rn}@gmail.com`,"password":"pass@123"})
                    .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body.status).to.equal(1);
                    jwtToken = response.body.data.token;
                    resolve();
                });
            }catch(error){
                console.log('error >> ', error);
                resolve();
            }
        })
    });

    it('check change password api', () => {
        return new Promise(async function (resolve, reject){
            try{
                chai.request(BASE_URL)
                    .post('/auth/change_password')
                    .set('Authorization', 'bearer '+jwtToken)
                    .send({"oldPassword":"pass@123", "newPassword":"pass@1234"})
                    .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body.status).to.equal(1);
                    resolve();
                });
            }catch(error){
                console.log('error >> ', error);
                resolve();
            }
        })
    });
});

describe('check todo APIs', () => {
    it('check add ToDo', () => {
        return new Promise(async function (resolve, reject){
            try{
                chai.request(BASE_URL)
                    .post('/todo')
                    .set('Authorization', 'bearer '+jwtToken)
                    .send({"date":"2022-03-30","title":"my first todo","status":"Pending"})
                    .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body.status).to.equal(1);
                    expect(response.body.data.id).to.be.an('number');
                    todo_id = response.body.data.id;
                    resolve();
                });
            }catch(error){
                console.log('error >> ', error);
                resolve();
            }
        })
    });

    it('check get ToDo', () => {
        return new Promise(async function (resolve, reject){
            try{
                chai.request(BASE_URL)
                    .get('/todo')
                    .set('Authorization', 'bearer '+jwtToken)
                    .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body.status).to.equal(1);
                    resolve();
                });
            }catch(error){
                console.log('error >> ', error);
                resolve();
            }
        })
    });

    it('check update ToDo', () => {
        return new Promise(async function (resolve, reject){
            try{
                chai.request(BASE_URL)
                    .put('/todo')
                    .set('Authorization', 'bearer '+jwtToken)
                    .send({"todo_id":todo_id,"date":"2022-06-30","title":"this is test todo","status":"Completed"})
                    .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body.status).to.equal(1);
                    resolve();
                });
            }catch(error){
                console.log('error >> ', error);
                resolve();
            }
        })
    });
    
    it('check delete ToDo', () => {
        return new Promise(async function (resolve, reject){
            try{
                chai.request(BASE_URL)
                    .delete('/todo')
                    .set('Authorization', 'bearer '+jwtToken)
                    .send({"todo_id":todo_id})
                    .end((error, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body.status).to.equal(1);
                    resolve();
                });
            }catch(error){
                console.log('error >> ', error);
                resolve();
            }
        })
    });
});
