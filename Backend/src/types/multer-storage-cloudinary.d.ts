declare module "multer-storage-cloudinary" {
    import { StorageEngine } from "multer";
    import { ConfigOptions } from "cloudinary";
  
    export class CloudinaryStorage implements StorageEngine {
      constructor(options: {
        cloudinary: ConfigOptions;
        params?: {
          folder?: string; // Add folder property
          public_id?: (req: Express.Request, file: Express.Multer.File) => string;
          resource_type?: string;
        };
      });
    }
  }