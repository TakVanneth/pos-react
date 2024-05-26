import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../helpers/config";
import { AuthContext } from '../../context/authContext';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Role() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/roles`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log('API Response:', response);  // Log the response for debugging
            setRoles(response.data.data);  // Access the nested data array
        } catch (error) {
            setError('Error fetching roles');
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        } else {
            fetchRoles();
        }
    }, [accessToken, navigate]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/roles/${roleToDelete}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // Remove the deleted role from the state
            setRoles(roles.filter(role => role.id !== roleToDelete));
            toast.success('Role deleted successfully');
        } catch (error) {
            setError('Error deleting role');
            console.error('Error deleting role:', error);
        } finally {
            setShowModal(false);
        }
    };

    const showModalConfirmation = (roleId) => {
        setRoleToDelete(roleId);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setRoleToDelete(null);
    };

    return (
        <div className='container'>
            <div className="row my-5">
                <div className="col-md-10 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-center mt-2">
                                Welcome <a href="/roles/add">insert</a>
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
                                    <th>Position</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role, index) => (
                                    <tr key={role.id}>
                                        <td>{index + 1}</td>
                                        <td>{role.position}</td>
                                        <td>
                                            <button 
                                                className="btn btn-danger" 
                                                onClick={() => showModalConfirmation(role.id)}
                                            >
                                                Delete
                                            </button>
                                            <a className="btn btn-success mx-3" href={`/roles/${role.id}/edit`}>Edit</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal for delete confirmation */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this role?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
