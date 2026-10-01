//Controlador para autenticar por roles a los usuarios
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CustomError } from "../utils/customError";

export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      //Obtenemos la informacion de los usuarios
      const users = await UserService.getAllUsers();
      return res.status(200).json({
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}
