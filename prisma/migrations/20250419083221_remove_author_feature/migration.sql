/*
  Warnings:

  - You are about to drop the column `authorId` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the `authors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_authorId_fkey";

-- AlterTable
ALTER TABLE "blog_posts" DROP COLUMN "authorId";

-- DropTable
DROP TABLE "authors";
