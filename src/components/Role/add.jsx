import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../helpers/config';
import useValidation from '../custom/useValidation';
import Spinner from '../layouts/Spinner';
import { AuthContext } from '../../context/authContext';

export default function AddRole() {
    const [position, setPosition] = useState('');
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        }
    }, [accessToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setLoading(true);
        const data = { position };

        try {
            const response = await axios.post(`${BASE_URL}/roles`, data, {
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
            console.log(error);
        }
    };

    return (
        <div className="container">
            <div className="row my-5">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-header bg-white">
                            <h4 className="text-center mt-2">Role</h4>
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
                                {loading ? <Spinner /> : <button type="submit" className="btn btn-primary">Submit</button>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
