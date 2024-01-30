import express, { Express } from "express";
import { init } from "./init";
import { ErrorMiddleware } from "./middlewares/error-handler-middleware";

const app: Express = express();
const PORT = process.env.PORT || 3000;

const setupRoutes = async (app: Express): Promise<void> => {
    const { userController } = await init();
    
    app.get("/", (req, res) => {
        res.send("Hello World");
    });
    app.use("/users/v1", userController.getRouter());
    app.use(ErrorMiddleware.handle as express.ErrorRequestHandler);
};

app.use(express.json());
setupRoutes(app);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

