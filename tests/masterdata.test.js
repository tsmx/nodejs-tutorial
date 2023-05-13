const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
const testUtils = require('./testutils');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

var mongoServer = null;

describe('masterdata test suite', () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        return testUtils.beforeAll(mongoServer, 'testdb', mongoose);
    });

    afterAll(async () => {
        return testUtils.afterAll(mongoServer, mongoose);
    });

    beforeEach(async () => {
        return testUtils.beforeEach();
    });

    afterEach(async () => {
        return testUtils.afterEach();
    });

    it('tests a successful query of all available masterdata', async () => {
        const response = await request
            .get('/masterdata');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(8);
    });

    it('tests a successful query of an existing contract', async () => {
        const response = await request
            .get('/masterdata/contract-1');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.name).toBe('Contract 1');
        expect(response.body.description).toBe("Test-Contract Nr. 1");
    });

    it('tests a successful query of a non existing contract', async () => {
        const response = await request
            .get('/masterdata/contract-3');
        expect(response.status).toBe(200);
        expect(response.body).toBeNull();
    });

    it('tests a successful query of the children for an existing contract', async () => {
        const response = await request
            .get('/masterdata/contract-1/children');
        expect(response.status).toBe(200);
        expect(response.body.children).toBeDefined();
        expect(response.body.children.length).toBe(2);
        expect(response.body.children.filter(item => item.name === 'Booking 1-1').length).toBe(1);
        expect(response.body.children.filter(item => item.name === 'Booking 1-2').length).toBe(1);
    });

});