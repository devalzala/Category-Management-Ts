import { Navigate, Outlet } from "react-router-dom";

const PublicRoutes: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem("token");

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;