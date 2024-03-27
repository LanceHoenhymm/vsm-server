ALTER TABLE "player_powerups" ADD COLUMN "insider_trading_status" "char" DEFAULT 'Unused' NOT NULL;--> statement-breakpoint
ALTER TABLE "player_powerups" ADD COLUMN "muft_ka_paisa_status" "char" DEFAULT 'Unused' NOT NULL;--> statement-breakpoint
ALTER TABLE "player_powerups" ADD COLUMN "stock_betting_status" "char" DEFAULT 'Unused' NOT NULL;--> statement-breakpoint
ALTER TABLE "player_powerups" ADD COLUMN "stock_betting_amount" double precision;--> statement-breakpoint
ALTER TABLE "player_powerups" ADD COLUMN "stock_betting_prediction" "char";--> statement-breakpoint
ALTER TABLE "player_powerups" ADD COLUMN "stock_betting_locked_symbol" varchar;--> statement-breakpoint
ALTER TABLE "player_powerups" ADD COLUMN "stock_betting_locked_price" double precision;--> statement-breakpoint
ALTER TABLE "stocks" DROP COLUMN IF EXISTS "freebies";