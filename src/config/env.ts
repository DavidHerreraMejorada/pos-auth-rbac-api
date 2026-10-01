import dotennv from "dotenv";

dotennv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET:
    process.env.JWT_SECRET || "mi_clave_secreta_super_segura_para_tokens",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ||
    "otra_clave_secreta_diferente_para_refresh",
};
