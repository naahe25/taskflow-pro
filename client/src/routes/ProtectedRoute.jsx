import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return <Loader />;
    if (!user) return <Navigate to="/" />;
    if (adminOnly && user.role !== "Admin") return <Navigate to="/dashboard" />;
    return children;
};

export default ProtectedRoute;