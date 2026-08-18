CREATE INDEX "theaters_deleted_at_idx" ON "theaters" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "movies_deleted_at_idx" ON "movies" USING btree ("deleted_at");