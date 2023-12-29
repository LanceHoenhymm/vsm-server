import request from 'supertest';
import express, { type Express } from 'express';
import { addGameData, addGameDataBatch } from './admin.controller';
import type {
  IAddGameDataDto,
  IAddGameDataBatchDto,
} from './admin.controller.dto';

describe('Admin Controller', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/addGameData', addGameData);
    app.post('/addGameDataBatch', addGameDataBatch);
  });

  it('should handle addGameData', async () => {
    const gameData: IAddGameDataDto = {
      roundNumber: 1,
      news: [
        {
          news: 'Desai Group owns an illegal drug operation',
          forInsider: false,
        },
        {
          news: 'Desai Group is thinking of stopping their complete drug operation',
          forInsider: true,
        },
      ],
      stocks: [
        {
          name: 'Chillar',
          bpc: 5.5,
        },
        {
          name: 'Desai',
          bpc: -5,
        },
      ],
    };
    const expectedResponse = {
      status: 'Successful',
    };
    const res = await request(app).post('/addGameData').send(gameData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expectedResponse);
  });

  it('should handle addGameDataBatch', async () => {
    const gameDataBatch: IAddGameDataBatchDto = {
      data: [
        {
          roundNumber: 3,
          news: [
            {
              news: 'Shetty group was getting settled in the drug market',
              forInsider: false,
            },
            {
              news: 'Rungta Group is looking for more partners to sell their weapons to',
              forInsider: true,
            },
          ],
          stocks: [
            {
              name: 'Chillar',
              bpc: 0,
            },
            {
              name: 'Desai',
              bpc: -1,
            },
          ],
        },
        {
          roundNumber: 2,
          news: [
            {
              news: 'The leaders of the Desai group are caught',
              forInsider: false,
            },
            {
              news: "Majority of security organizations are buying Rungta group's weapons",
              forInsider: true,
            },
          ],
          stocks: [
            {
              name: 'Chillar',
              bpc: -5,
            },
            {
              name: 'Desai',
              bpc: 2,
            },
          ],
        },
      ],
    };
    const expectedResponse = {
      status: 'Successful',
      data: {
        length: 2,
      },
    };
    const res = await request(app)
      .post('/addGameDataBatch')
      .send(gameDataBatch);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expectedResponse);
  });
});
