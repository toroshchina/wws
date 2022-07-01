import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getUser', () => {
    it('should return user', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getUser({user: 'name'})).toEqual('name');
    });
  });
});
