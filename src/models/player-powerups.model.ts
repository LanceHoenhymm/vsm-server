import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { playerAccount } from './player-account.model';

export const playerPowerups = pgTable('player_powerups', {
  playerId: uuid('player_id')
    .references(() => playerAccount.id, {
      onDelete: 'cascade',
    })
    .notNull()
    .unique(),
});
