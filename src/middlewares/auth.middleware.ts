import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface JwPayload {
  userId: number;
  role: "USER" | "ADMIN";
}

//Creacion de la funcion que autenticara al usuario por medio de los tokens para proteger o dar acceso a rutas
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //Obtenemos el encabezado de autenticacion
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acceso Denegado" });
  }
  //Extraemos el token sin la palabra Bearer
  const token = authHeader.split(" ")[1];

  try {
    //Verificamos y decodificamos el token con el token secreto
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwPayload;

    //Guardamos los datos en el objeto req
    req.user = decoded;
    //Continuamos al siguiente controlador
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalido o expirado" });
  }
};
