import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //Imprimir el error en consola por depuracion
  console.error("Error capturado por Middleware Global:", err);

  //Si el error es personalizado que se definio con statusCode
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }
  //Para errores no esperados
  return res.status(500).json({
    status: "error",
    message: "Ocurrió un error interno en el servidor",
  });
};
