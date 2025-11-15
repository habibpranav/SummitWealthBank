import React, { useState } from 'react';
import axios from 'axios';

const AccountForm = () => {
    const [userId, setUserId] = useState('');
    const [type, setType] = useState('CHECKING');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/accounts/open', {
                userId: Number(userId),
                type,
            });

            setMessage(`Account opened: ID ${response.data.id}`);
        } catch (error) {
            console.error('Error opening account:', error);
            setMessage('Error opening account');
        }
    };

    return (
        <div>
            <h2>Open Account</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="CHECKING">Checking</option>
                    <option value="SAVINGS">Savings</option>
                </select>
                <button type="submit">Open</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AccountForm;