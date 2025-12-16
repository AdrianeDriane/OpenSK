import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * Middleware to require specific role(s) for route access
 * @param allowedRoleIds - Array of role IDs that are allowed to access the route
 */
export function requireRole(allowedRoleIds: number[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      (req as any).user = decoded;

      if (!allowedRoleIds.includes(decoded.roleId)) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
      }

      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
}
