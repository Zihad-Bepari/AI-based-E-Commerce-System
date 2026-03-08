import authRoutes from '../modules/auth/auth.routes.js';


const routes = (app) => {
    app.use("/api/auth", authRoutes);
}

export default routes;