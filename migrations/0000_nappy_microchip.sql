CREATE TABLE IF NOT EXISTS "current_stocks" (
	"symbol" varchar NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"volatility" numeric(10, 2) NOT NULL,
	"current_volume_traded" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"round_applicable" smallint NOT NULL,
	"content" text NOT NULL,
	"for_insider" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_account" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"is_banned" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_portfolio" (
	"player_id" uuid,
	"bank_balance" numeric(10, 2) NOT NULL,
	"total_portfolio_value" numeric(10, 2) NOT NULL,
	"stocks" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_powerups" (

);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stocks" (
	"symbol" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"round_introduced" smallint NOT NULL,
	"initial_price" numeric(10, 2) NOT NULL,
	"initial_volatility" numeric(10, 2) NOT NULL,
	"max_volume" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password" char(32) NOT NULL,
	"u1Name" varchar NOT NULL,
	"u2Name" varchar,
	"is_admin" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "current_stocks" ADD CONSTRAINT "current_stocks_symbol_stocks_symbol_fk" FOREIGN KEY ("symbol") REFERENCES "stocks"("symbol") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_account" ADD CONSTRAINT "player_account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_portfolio" ADD CONSTRAINT "player_portfolio_player_id_player_account_id_fk" FOREIGN KEY ("player_id") REFERENCES "player_account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
