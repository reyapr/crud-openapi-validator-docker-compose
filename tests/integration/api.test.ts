import supertest from 'supertest';
import express from 'express';

import { createApp } from '../../src';
import { dataSource } from '../../src/datasource';
import { seedUserData } from '../helpers/seed-data';
import { DataSource } from 'typeorm';

describe("API", () => {
  let server: express.Application;
  let dbConn: DataSource;
  
  beforeAll(async () => {
    server = await createApp();
    if (dataSource.isInitialized) {
      dbConn = dataSource;
    } else {
      dbConn = await dataSource.initialize();
    }
  });
  
  beforeEach(async () => {
    await dbConn.runMigrations();
    await seedUserData(dbConn);
  });
  
  afterEach(async () => {
    await dbConn.dropDatabase();
  });
  
  afterAll(async () => {
    await dbConn.destroy();
  }, 3000);
  
  it('should failed due to missing api key', async () => {
    const response = await supertest(server)
      .get('/users/v1')
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid API Key',
    });
  });
  
  it('should success find all active users', async () => {
    const response = await supertest(server)
      .get('/users/v1')
      .set('Content-Type', 'application/json')
      .set('api-key', 'test');
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        name: 'udin',
        email: 'udin@sedunia.com',
        role: 'admin',
      })
    ]));
  }, 3000)
  
  it('should success find user by id', async () => {
    const user = await dataSource.getRepository('user')
      .findOne({ where: { name: 'udin' } });
    
    
    const response = await supertest(server)
      .get(`/users/v1/${user!.id}`)
      .set('Content-Type', 'application/json')
      .set('api-key', 'test');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      id: user!.id,
      name: 'udin',
      email: 'udin@sedunia.com',
      role: 'admin',
    }));
    
  });
  
  it('should failed find user by id', async () => {
    const response = await supertest(server)
      .get('/users/v1/da8aec34-cdc6-42b1-b02a-0ac074d7335b')
      .set('Content-Type', 'application/json')
      .set('api-key', 'test');
    
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'User not found',
    });
  });
  
  it('should success create user', async () => {
    const response = await supertest(server)
      .post('/users/v1')
      .set('Content-Type', 'application/json')
      .set('api-key', 'test')
      .send({
        name: 'test',
        email: 'test@test.com',
        role: 'admin',
        password: 'password123',
      });
    console.log(response, '<=================== response ==================');
      
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(String),
      name: 'test',
      email: 'test@test.com',
      role: 'admin',
    }));
  });
  
  it('should failed create user due invalid request', async () => {
    const response = await supertest(server)
      .post('/users/v1')
      .set('Content-Type', 'application/json')
      .set('api-key', 'test')
      .send({
        email: 'email@random.com',
        role: 'haha',
        password: '123'
      });
      
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: expect.stringContaining('have required property \'name\''),
    });
    expect(response.body).toEqual({
      message: expect.stringContaining('password must NOT have fewer than 8 char'),
    });
    expect(response.body).toEqual({
      message: expect.stringContaining('role must be equal to one of the allowed values: user, admin'),
    });
  });
  
  it('should failed create user due to duplicate email', async () => {
    const response = await supertest(server)
      .post('/users/v1')
      .set('Content-Type', 'application/json')
      .set('api-key', 'test')
      .send({
        name: 'test',
        email: 'udin@sedunia.com',
        role: 'admin',
        password: 'password123',
      });
      
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'User already exists',
    });
  });
  
  it('should success update user', async () => {
    const repo = dataSource.getRepository('user');
    const user = await repo.findOne({ where: { name: 'udin' } });
    
    const response = await supertest(server)
      .put(`/users/v1/${user!.id}`)
      .set('Content-Type', 'application/json')
      .set('api-key', 'test')
      .send({
        name: 'test',
        email: 'udin@test.com',
        role: 'user',
      });
      
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      affected: 1,
    }));
    
    const updatedUser = await repo.findOne({ where: { name: 'test' } });
    expect(updatedUser).toEqual(expect.objectContaining({
      name: 'test',
      email: 'udin@test.com',
      role: 'user',
    }));
  });
  
  it('should failed update user due to invalid request', async () => {
    const repo = dataSource.getRepository('user');
    const user = await repo.findOne({ where: { name: 'udin' } });
    
    const response = await supertest(server)
      .put(`/users/v1/${user!.id}`)
      .set('Content-Type', 'application/json')
      .set('api-key', 'test')
      .send({
        name: '',
        email: 'emailrandom.com',
        role: 'haha',
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: expect.stringContaining('role must be equal to one of the allowed values: user, admin'),
    });
    expect(response.body).toEqual({
      message: expect.stringContaining('name must NOT have fewer than 1 char'),
    });
    expect(response.body).toEqual({
      message: expect.stringContaining('email must match pattern'),
    });
  });
  
  it('should failed update user due to not found', async () => {
    const response = await supertest(server)
      .put('/users/v1/da8aec34-cdc6-42b1-b02a-0ac074d7335b')
      .set('Content-Type', 'application/json')
      .set('api-key', 'test')
      .send({
        name: 'test',
        email: 'haha@gmail.com',
        role: 'user',
      });
      
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'User not found',
    });
  });
  
  it('should success soft delete user', async () => {
    const repo = dataSource.getRepository('user');
    const user = await repo.findOne({ where: { name: 'udin' } });
    
    const response = await supertest(server)
      .delete(`/users/v1/${user!.id}`)
      .set('Content-Type', 'application/json')
      .set('api-key', 'test');
      
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      affected: 1,
    }));
    
    const updatedUser = await repo.findOne({ where: { name: 'udin' } });
    expect(updatedUser).toEqual(expect.objectContaining({
      deleted_at: expect.any(Date),
    }));
  });
});