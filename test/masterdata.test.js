const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
const testUtils = require('./testutils');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

var mongoServer = null;

describe('masterdata test suite', () => {

    beforeAll(async (done) => {
        mongoServer = new MongoMemoryServer();
        testUtils.beforeAll(mongoServer, 'testdb', mongoose).then(() => { done(); });
    });

    afterAll(async (done) => {
        testUtils.afterAll(mongoServer, mongoose).then(() => { done(); });
    });

    beforeEach(async (done) => {
        testUtils.beforeEach().then(() => { done(); });
    });

    afterEach(async (done) => {
        testUtils.afterEach().then(() => { done(); });
    });

    it('tests a successful query of all available masterdata', async (done) => {
        const response = await request
            .get('/masterdata');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(8);
        done();
    });

    it('tests a successful query of an existing contract', async (done) => {
        const response = await request
            .get('/masterdata/contract-1');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.name).toBe('Contract 1');
        expect(response.body.description).toBe("Test-Contract Nr. 1");
        done();
    });

    it('tests a successful query of a non existing contract', async (done) => {
        const response = await request
            .get('/masterdata/contract-3');
        expect(response.status).toBe(200);
        expect(response.body).toBeNull();
        done();
    });

    it('tests a successful query of the children for an existing contract', async (done) => {
        const response = await request
            .get('/masterdata/contract-1/children');
        expect(response.status).toBe(200);
        expect(response.body.children).toBeDefined();
        expect(response.body.children.length).toBe(2);
        expect(response.body.children.filter(item => item.name === 'Booking 1-1').length).toBe(1);
        expect(response.body.children.filter(item => item.name === 'Booking 1-2').length).toBe(1);
        done();
    });

});