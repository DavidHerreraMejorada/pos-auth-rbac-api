//Middleware para Autenticacion por medio de los roles
import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export const authorizeRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //1.Verificar que haya pasado por el middleware de authenticate
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // 2. Comprobar si el usuario esta dentro de los roles permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Acceso denegado. Permisos insuficientes para realizar la accion",
      });
    }

    //3. Si tiene el rol permitido se le concede el acceso, y se permite continuar
    next();
  };
};
