import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEmailUniqueConstraint1706614240771 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE "user" ADD CONSTRAINT "uk_user_email" UNIQUE ("email")
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "uk_user_email"
        `)
    }
}
