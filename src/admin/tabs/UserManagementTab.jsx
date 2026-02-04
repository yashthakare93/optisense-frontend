import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../api';

function UserManagementTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);
    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter(u => u.userId !== userId)); 
        } catch (err) {
            alert("Failed to delete");
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h3>User Management</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userId || user.id}>
                            <td>{user.userId || user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.userId || user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagementTab;
