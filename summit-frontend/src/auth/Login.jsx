import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const data = await res.json();
            login(data);
            navigate("/open-account");
        } else {
            alert("Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
            <h2 className="text-xl font-semibold">Login</h2>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="border p-2 w-full" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border p-2 w-full" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
        </form>
    );
}