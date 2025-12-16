declare global {
  namespace Express {
    interface User {
      id: number;
      barangayId: number | null;
    }
  }
}

export {};
