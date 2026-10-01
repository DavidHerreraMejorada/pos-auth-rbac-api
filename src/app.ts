import express from "express";
import { ENV } from "./config/env";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(express.json());

app.listen(ENV.PORT, () => {
  console.log(`Server activo en el puerto ${ENV.PORT}`);
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hola mundo");
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

//Middleware global para manejar errores
app.use(errorHandler);

app.get("/health", (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: "OK" });
});
