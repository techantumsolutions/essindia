-- Align pages.template_id with templates.id (uuid)
UPDATE "pages" SET "template_id" = NULL
WHERE "template_id" IS NOT NULL
  AND TRIM("template_id") = '';

UPDATE "pages" SET "template_id" = NULL
WHERE "template_id" IS NOT NULL
  AND "template_id" !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

ALTER TABLE "pages"
  ALTER COLUMN "template_id" TYPE uuid
  USING (
    CASE
      WHEN "template_id" IS NULL THEN NULL
      ELSE "template_id"::uuid
    END
  );

ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_template_id_templates_id_fk";

ALTER TABLE "pages"
  ADD CONSTRAINT "pages_template_id_templates_id_fk"
  FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id")
  ON DELETE SET NULL ON UPDATE NO ACTION;
