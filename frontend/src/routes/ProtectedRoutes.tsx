import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem("token");

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;