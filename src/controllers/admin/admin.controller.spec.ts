import request from 'supertest';
import express from 'express';
import { addGameData, addGameDataBatch } from './admin.controller';
import type { IGameDataDto, IGameDataBatchDto } from './admin.controller.dto';

const app = express();
app.use(express.json());
app.post('/addGameData', addGameData);
app.post('/addGameDataBatch', addGameDataBatch);

describe('Admin Controller', () => {
  it('should handle addGameData', async () => {
    const gameData: IGameDataDto = {
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
      msg: 'GameData for round 1 was added.',
    };
    const res = await request(app).post('/addGameData').send(gameData);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expectedResponse);
  });

  it('should handle addGameDataBatch', async () => {
    const gameDataBatch: IGameDataBatchDto = {
      data: [
        {
          roundNumber: 1,
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
      msg: 'GameData for 2 rounds was added.',
    };
    const res = await request(app)
      .post('/addGameDataBatch')
      .send(gameDataBatch);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expectedResponse);
  });
});
