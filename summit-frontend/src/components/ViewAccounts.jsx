import { useState } from "react";

export default function ViewAccounts() {
    const [userId, setUserId] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null);

    const handleFetch = async () => {
        setError(null);
        try {
            const res = await fetch(`http://localhost:8080/api/accounts/${userId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch accounts");
            }
            const data = await res.json();
            setAccounts(data);
        } catch (err) {
            setError(err.message);
            setAccounts([]);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold">View Accounts by User ID</h2>

            <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />

            <button
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                onClick={handleFetch}
            >
                Fetch Accounts
            </button>

            {error && <div className="text-red-500">{error}</div>}

            {accounts.length > 0 && (
                <div className="space-y-2">
                    {accounts.map((acc) => (
                        <div key={acc.id} className="bg-gray-100 p-3 rounded">
                            <p><strong>ID:</strong> {acc.id}</p>
                            <p><strong>Type:</strong> {acc.type}</p>
                            <p><strong>Balance:</strong> {acc.balance}</p>
                            <p><strong>Frozen:</strong> {acc.frozen ? "Yes" : "No"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}