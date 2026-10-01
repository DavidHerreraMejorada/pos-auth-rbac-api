//Creando el servicion de autenticacion de la API
import { prisma } from "../config/db"; //Importamos la base de datos
import bcrypt from "bcryptjs"; //Importamos bcryptjs para poder hashear los password de los usuarios
import jwt from "jsonwebtoken"; //Importamos el jsonwebtoken para poder darle un token y un rfresh token al usuario para iniciar sesion
import { ENV } from "../config/env";
//Creamos la clase que proporciona el servicio de registro para usuarios
export class AuthService {
  //Se crea el metodo asincrono para registrar
  static async register(data: {
    name?: string;
    email: string;
    password: string;
  }) {
    //1. Verificamos que el correo exista en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) throw new Error("El correo electronico ya existe");

    //Si el correo no existe saltamos a la siguiente parte
    //2. Encriptar el password

    const hashedPassword = await bcrypt.hash(data.password, 10);

    //Despues de encriptar pasamos a guardar en la base de datos
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  //Metodo para el login del usuario
  static async login(data: { email: string; password: string }) {
    //1.Se busca al usario por medio del correo
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    //Verificamos que el email si se encuentre dentro de labase de datos
    if (!user) {
      throw new Error("Credenciales invalidas");
    }
    //Si el usuario si existe procedemos a comparar los passswords con el metodo .compare de la libreria bycript
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    //Verificamis la variable
    if (!isPasswordValid) throw new Error("Credenciales invalidas");

    //Si no salto ningun error quiere decir que el usuario y password son correctos
    //Procedemos a generar el accses token
    //Generacion de token de corta duracion (duracion: 15min)
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: "15m" },
    );
    //Generamos el refresh token de larga duracion (duracion: 7d)
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    //Una vez creados los tokens procedemos a guardar el refresh token en la base de datos
    const expiresAt = new Date(); //Guardar la fecha actual
    expiresAt.setDate(expiresAt.getDate() + 7); //Se actualiza con el tiempo permitido para el refresh token

    //Guardamos en la base de datos
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: expiresAt,
      },
    });

    //Retornamos los nuevos parametros con los tokens de acceso
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
  //Metodo de autenticacion de token, ruta protegida
  static async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new Error("Usuario no encontardo.");
    }

    return user;
  }

  //Metodo para dar acceso por medio del refresh token
  static async refreshToken(token: string) {
    //Comprobamos si esta presente el refresh token
    if (!token) {
      throw new Error("Refresh Token requerido");
    }

    //Si el token esta presente se verifica que este en la base de datos
    const storedToken = await prisma.refreshToken.findFirst({
      where: { token },
      include: { user: true },
    });

    if (!storedToken) {
      throw new Error("Refresh token invalido o revocado");
    }

    //Se comprueba si el refresh token expiro en la base de datos
    if (new Date() > storedToken.expiresAt) {
      //Si ya expiro el token se elimina de la base de datos
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new Error("Token expirado");
    }
    //Si el refresh token sigue vigente se compara con la firma JWT\
    try {
      jwt.verify(token, ENV.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error("Refresh token invalido");
    }

    //Finalmente generamos un nuevo acces token
    const newAccesToken = jwt.sign(
      { userId: storedToken.user.id, role: storedToken.user.role },
      ENV.JWT_SECRET,
      { expiresIn: "15m" },
    );
    //Y lo retornamos
    return { accessToken: newAccesToken };
  }

  //Metodo para cerrar sesion y revocar el Refresh Token
  static async logout(token: string) {
    //Verificamos la existencia del token
    if (!token) {
      throw new Error("Refresh Token requerido!");
    }

    //Si el token existe procedemos a borrar lo de la base de datos\
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
    //Retornamos el mensaje de que la operacion de cierre fue exitosa
    return { message: "Sesion cerrada correctamente" };
  }
}
