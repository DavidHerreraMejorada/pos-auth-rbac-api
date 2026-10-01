//Creamos la ruta protegida para los usuarios
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

const router = Router();

//Para poder usar esta ruta se necesitan dos cosas
// 1. Estar autenticado
// 2. Tener el rol de Admin
router.get(
  "/",
  authenticate,
  authorizeRole("ADMIN"),
  UserController.getAllUsers,
);

export default router;
