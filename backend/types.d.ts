// Extend the Express Request type globally so all handlers can access userId
// without using a custom interface that causes NodeNext resolution issues.
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export {};
