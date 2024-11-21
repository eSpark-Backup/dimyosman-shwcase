import { SwaggerDefinition, Options } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation For SHWCase",
    version: "1.0.0",
    description: "API documentation for your Express application",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server",
    },
  ],
};

export const swaggerOptions: Options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.ts"], // Path to your route files
};
