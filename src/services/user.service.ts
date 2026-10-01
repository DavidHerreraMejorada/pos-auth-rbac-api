//Clase para gestionar mejor el servicio de usuarios
import { prisma } from "../config/db";

//Retornaremos la informacion del usuario para posteriormente usarlo en el controlador
export class UserService {
  static async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
