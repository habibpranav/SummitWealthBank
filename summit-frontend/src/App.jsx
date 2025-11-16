import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import OpenAccount from "./components/OpenAccount";
import ViewAccounts from "./components/ViewAccounts";
import TransferMoney from "./components/TransferMoney";
import Admin from "./components/Admin";
import CardFeed from "./components/CardFeed";
import Wealth from "./components/Wealth";
import PrivateRoute from "./auth/PrivateRoute";
import Navbar from "./components/Navbar";

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-6">
                <Navbar /> {/* Use Navbar instead of hardcoded <nav> */}

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/open-account"
                        element={
                            <PrivateRoute>
                                <OpenAccount />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/view-accounts"
                        element={
                            <PrivateRoute>
                                <ViewAccounts />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/transfer"
                        element={
                            <PrivateRoute>
                                <TransferMoney />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute>
                                <Admin />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/card-feed"
                        element={
                            <PrivateRoute>
                                <CardFeed />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/wealth"
                        element={
                            <PrivateRoute>
                                <Wealth />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}