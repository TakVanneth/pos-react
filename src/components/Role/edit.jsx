import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../helpers/config';
import useValidation from '../custom/useValidation';
import Spinner from '../layouts/Spinner';
import { AuthContext } from '../../context/authContext';

export default function AddEdit() {
    const [position, setPosition] = useState('');
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        } else {
            fetchRoleDetails();
        }
    }, [accessToken, navigate]);

    const fetchRoleDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/roles/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setPosition(response.data.data.position);
        } catch (error) {
            console.error('Error fetching role details:', error);
            toast.error('Error fetching role details. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setLoading(true);
        const data = { position };

        try {
            const response = await axios.put(`${BASE_URL}/roles/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setLoading(false);
            setPosition('');
            toast.success(response.data.message);
            navigate('/roles');
        } catch (error) {
            setLoading(false);
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else if (error?.response?.status === 401) {
                toast.error('Unauthorized. Please log in again.');
                navigate('/login');
            } else {
                toast.error('An error occurred. Please try again.');
            }
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <div className="row my-5">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-header bg-white">
                            <h4 className="text-center mt-2">Edit Role</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="position" className="form-label">Position*</label>
                                    <input
                                        type="text"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        className="form-control"
                                        id="position"
                                    />
                                    {useValidation(errors, 'position')}
                                </div>
                                {loading ? <Spinner /> : <button type="submit" className="btn btn-primary">Update</button>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
