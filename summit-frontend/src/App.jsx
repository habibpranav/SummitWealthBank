import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import OpenAccount from "./components/OpenAccount";
import ViewAccounts from "./components/ViewAccounts";
import Transfer from "./components/Transfer";
import Admin from "./components/Admin";
import CardFeed from "./components/CardFeed";
import Wealth from "./components/Wealth";

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-6">
                <nav className="mb-6 space-x-4">
                    <Link to="/" className="text-blue-600">Home</Link>
                    <Link to="/open-account" className="text-blue-600">Open Account</Link>
                    <Link to="/view-accounts" className="text-blue-600">View Accounts</Link>
                    <Link to="/transfer" className="text-blue-600">Transfer</Link>
                    <Link to="/admin" className="text-blue-600">Admin</Link>
                    <Link to="/card-feed" className="text-blue-600">Card Feed</Link>
                    <Link to="/wealth" className="text-blue-600">Wealth</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/open-account" element={<OpenAccount />} />
                    <Route path="/view-accounts" element={<ViewAccounts />} />
                    <Route path="/transfer" element={<Transfer />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/card-feed" element={<CardFeed />} />
                    <Route path="/wealth" element={<Wealth />} />
                </Routes>
            </div>
        </Router>
    );
}