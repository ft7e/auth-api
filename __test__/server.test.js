'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const mockRequest = supertest(app);
const { sequelize } = require('../src/models/index.model');
const { response } = require('express');

let userData = {
  testUserAdmin: { username: 'admin', password: 'test', role: 'admin' },
  testUserUser: { username: 'user', password: 'test', role: 'user' },
};
let accessToken = null;
beforeAll(async () => {
  await sequelize.sync();
});
describe('Auth API', () => {
  it('must give 404 for wrong route', async () => {
    const response = await mockRequest.get('/xyz');
    expect(response.status).toBe(404);
  });
  it('must give 404 for wrong method', async () => {
    const response = await mockRequest.patch('/article');
    expect(response.status).toBe(404);
  });
  it('it should create a new user, admin role', async () => {
    const response = await mockRequest
      .post('/signup')
      .send(userData.testUserAdmin);
    expect(response.status).toBe(201);
  });
  it('it should create a new user, user role', async () => {
    const response = await mockRequest
      .post('/signup')
      .send(userData.testUserUser);
    expect(response.status).toBe(201);
  });
  it('Can signin with basic auth string', async () => {
    let { username, password } = userData.testUserAdmin;

    const response = await mockRequest.post('/signin').auth(username, password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.username).toBe(username);
    expect(userObject.actions).toEqual(['read', 'create', 'update', 'delete']);
    expect(userObject.role).toBe('admin');
  });
  it('Can signin with bearer auth token', async () => {
    let { username, password } = userData.testUserAdmin;
    const response = await mockRequest.post('/signin').auth(username, password);
    accessToken = response.body.token;
    const bearerResponse = await mockRequest
      .get('/secret')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(bearerResponse.status).toBe(200);
  });
  it('basic fails with known user and wrong password ', async () => {
    const response = await mockRequest
      .post('/signin')
      .auth(userData.testUserAdmin.username, 'xyz');
    const { user, token } = response.body;

    expect(response.status).toBe(503);
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });
  it('basic fails with unknown user', async () => {
    const response = await mockRequest.post('/signin').auth('nobody', 'xyz');
    const { user, token } = response.body;

    expect(response.status).toBe(503);
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });
  it('Secret Route fails with invalid token', async () => {
    let { username, password } = userData.testUserAdmin;
    const login = await mockRequest.post('/signin').auth(username, password);
    const response = await mockRequest
      .get('/secret')
      .set('Authorization', `bearer accessgranted`);

    expect(response.status).toBe(404);
  });
  it('Non admins cant reach /users', async () => {
    let { username, password } = userData.testUserUser;
    const login = await mockRequest.post('/signin').auth(username, password);
    const userObject = login.body;
    accessToken = userObject.token;
    const bearerResponse = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(bearerResponse.status).toBe(404);
    expect(userObject.role).toBe('user');
  });
  it('Admins can reach /users', async () => {
    let { username, password } = userData.testUserAdmin;
    const login = await mockRequest.post('/signin').auth(username, password);
    const userObject = login.body;
    accessToken = userObject.token;
    const bearerResponse = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(bearerResponse.status).toBe(200);
    expect(userObject.role).toBe('admin');
  });
  it('can add an article as an admin ', async () => {
    let { username, password } = userData.testUserAdmin;
    const login = await mockRequest.post('/signin').auth(username, password);
    const userObject = login.body;
    accessToken = userObject.token;
    const response = await mockRequest.post('/article').send({
      name: 'Wonders-of-Land',
      catigory: 'Science',
    });
    expect(response.status).toBe(201);
    expect(userObject.name).toBe('Wonders-of-Land');
  });

  //   it('can get all food items', async () => {
  //     const response = await mockRequest.get('/food');
  //     expect(response.status).toBe(200);
  //   });

  //   it('can get one record', async () => {
  //     const response = await mockRequest.get('/food/1');
  //     expect(response.status).toBe(200);
  //   });

  //   it('can update a record', async () => {
  //     const response = await mockRequest.put('/food/1');
  //     expect(response.status).toBe(201);
  //   });

  //   it('can delete a record', async () => {
  //     const response = await mockRequest.delete('/food/1');
  //     expect(response.status).toBe(204);
  //   });
});

afterAll(async () => {
  await sequelize.drop();
});
