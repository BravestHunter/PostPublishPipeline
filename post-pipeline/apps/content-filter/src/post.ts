import type { Express } from "express";

export default interface Post {
  text: string;
  socialPlatform: string;
  mediaFiles?: Express.Multer.File[];
}