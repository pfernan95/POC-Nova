import express, { Application } from "express";
import cors from "cors";
import userRoutes from "../../routes/users";
import authRoutes from "../../routes/auth";
import nominationRoutes from "../../routes/nominations";

export class Server {
  private app: Application;

  private port: string;

  private apiPaths = {
    users: "/api/users",
    nominations: "/api/nominations",
    auth: "/api/login",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8080";

    //Middlewares
    this.middlewares();

    //Define routes
    this.routes();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.apiPaths.users, userRoutes);
    this.app.use(this.apiPaths.nominations, nominationRoutes);
    this.app.use(this.apiPaths.auth, authRoutes);
  }

  listen = async () => {
    this.app.listen(this.port, () => {
      console.log("Server listening port: " + this.port);
    });
  };
}
