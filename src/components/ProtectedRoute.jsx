import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { hasAccess } from "../utils/roleAccess";

function ProtectedRoute({ children, section }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (section && !hasAccess(user.role, section)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;
