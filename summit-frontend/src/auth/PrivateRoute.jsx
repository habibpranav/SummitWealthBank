import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";


const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    // If user is logged in → allow route
    // If NOT logged in → redirect to /login
    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;