import { useState } from "react";

export default function Transfer() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleTransfer = async () => {
        setResult(null);
        setError(null);

        const payload = {
            fromAccountId: parseInt(from),
            toAccountId: parseInt(to),
            amount: parseFloat(amount),
        };

        try {
            const res = await fetch("http://localhost:8080/api/transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Transfer failed");
            }

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold">Transfer Money</h2>

            <input
                type="number"
                placeholder="From Account ID"
                className="w-full border px-3 py-2 rounded"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
            />

            <input
                type="number"
                placeholder="To Account ID"
                className="w-full border px-3 py-2 rounded"
                value={to}
                onChange={(e) => setTo(e.target.value)}
            />

            <input
                type="number"
                placeholder="Amount"
                className="w-full border px-3 py-2 rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <button
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={handleTransfer}
            >
                Transfer
            </button>

            {error && <div className="text-red-500">{error}</div>}

            {result && (
                <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
            )}
        </div>
    );
}