//Controlador de registro
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

//Creamos la clase para el controlador
export class AuthController {
  //Metodo register para poder controlar el registro de los usuarios
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      //Si el usuario quiere mandar una respuesta sin el correo o el password usaremos la siguiente linea de codigo
      if (!email || !password) {
        return res.status(400).json("Introduzca correo y contraseña");
      }
      //Si se introdujeron los parametros de manera adecuada procedemos a hacer el registro
      const user = await AuthService.register({ name, email, password });
      return res.status(201).json({
        message: "Registro exitoso",
        data: user,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  //Metodo para controlar el login del usuario
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body; //Traemos la informacion del body
      //Verificamos que la informacion este completa
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "El correo y la contraseña son obligatorios" });
      }
      //Si el el email y el password se introdujeron correctamente procedemos a verificar que se encuntren en la base de datos
      //Para esto traemos el metodo .login de AuthService
      const result = await AuthService.login({ email, password });
      //Si el proceso del login fue exitoso devolvemos el resultado y el status de la promesa
      return res.status(200).json({
        message: "Incio de sesion exitoso",
        data: result,
      });
    } catch (error: any) {
      //Si hubo algun error en el proceso se retorna el mensaje de error
      return res.status(401).json({ message: error.message });
    }
  }
  //Metodo para controlar la utenticacion del usuario
  static async getProfile(req: Request, res: Response) {
    try {
      //En esta parte se usa "req.user" que ya viene inyectado por medio del file de types que establecimos anteriormente
      const userId = req.user!.userId;
      //Esperamos la respuesta del service que confirme la autenticacion
      const user = await AuthService.getProfile(userId);
      //Si todo es correcto retornara la data correspodiente
      return res.status(200).json({
        data: user,
      });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  //Metodo para controlar el Refresh Token
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);

      return res.status(200).json({
        message: "Token renovado con exito",
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  //Metodo para controlar el logout o cierre de sesion
  static async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);

      return res.status(200).json({
        message: "Sesion cerrada",
      });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }
}
