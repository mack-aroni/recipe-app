// types.d.ts
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Assuming 'User' is the type exported from your Prisma client
    }
  }
}
