ALTER TABLE "player_account" DROP CONSTRAINT "player_account_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "player_portfolio" DROP CONSTRAINT "player_portfolio_player_id_player_account_id_fk";
--> statement-breakpoint
ALTER TABLE "player_account" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "player_powerups" ADD COLUMN "player_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_account" ADD CONSTRAINT "player_account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_portfolio" ADD CONSTRAINT "player_portfolio_player_id_player_account_id_fk" FOREIGN KEY ("player_id") REFERENCES "player_account"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_powerups" ADD CONSTRAINT "player_powerups_player_id_player_account_id_fk" FOREIGN KEY ("player_id") REFERENCES "player_account"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
