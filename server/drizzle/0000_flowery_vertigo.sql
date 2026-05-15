CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255),
	"password_hash" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
