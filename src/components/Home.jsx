import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../helpers/config";
import { AuthContext } from '../context/authContext';

export default function Home() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setUsers(response.data.data);
        } catch (error) {
            setError('Error fetching users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        } else {
            fetchUsers();
        }
    }, [accessToken, navigate]);

    return (
        <div className='container'>
            <div className="row my-5">
                <div className="col-md-10 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-center mt-2">
                                Welcome
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-5">
                <div className="col-md-10 mx-auto">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role ? user.role.position : "No role"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
