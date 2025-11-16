import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md p-4 mb-6 flex justify-between items-center">
            <div className="space-x-4">
                <Link to="/" className="text-blue-600 font-semibold">Home</Link>
                {user && (
                    <>
                        <Link to="/open-account" className="text-blue-600">Open Account</Link>
                        <Link to="/view-accounts" className="text-blue-600">View Accounts</Link>
                        <Link to="/transfer" className="text-blue-600">Transfer</Link>
                        <Link to="/admin" className="text-blue-600">Admin</Link>
                        <Link to="/card-feed" className="text-blue-600">Card Feed</Link>
                        <Link to="/wealth" className="text-blue-600">Wealth</Link>
                    </>
                )}
                {!user && (
                    <>
                        <Link to="/login" className="text-blue-600">Login</Link>
                        <Link to="/register" className="text-blue-600">Register</Link>
                    </>
                )}
            </div>

            {user && (
                <button
                    onClick={logout}
                    className="text-red-600 font-semibold hover:underline"
                >
                    Logout
                </button>
            )}
        </nav>
    );
}