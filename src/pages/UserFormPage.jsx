import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createUser, getUserById, updateUser } from "../services/userService";

function UserFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        userName: "",
        userSurname: "",
        phoneNumber: "",
        password: "",
        email: "",
        role: "OPERATIONS"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            if (!isEditMode) return;

            try {
                setLoading(true);
                const data = await getUserById(id);

                setFormData({
                    userName: data.userName || "",
                    userSurname: data.userSurname || "",
                    phoneNumber: data.phoneNumber || "",
                    password: "",
                    email: data.email || "",
                    role: data.role || "OPERATIONS"
                });
            } catch (error) {
                console.error("Error loading user:", error);
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            userName: formData.userName.trim(),
            userSurname: formData.userSurname.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            password: formData.password,
            email: formData.email.trim(),
            role: formData.role
        };

        try {
            if (isEditMode) {
                await updateUser(id, payload);
            } else {
                await createUser(payload);
            }

            navigate("/users");
        } catch (error) {
            console.error("Error saving user:", error);
            setError(error.response?.data?.message || "Failed to save user.");
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{isEditMode ? "Edit User" : "Add New User"}</h1>
                <Link to="/users" className="btn btn-secondary">
                    Back
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Surname</label>
                            <input
                                type="text"
                                className="form-control"
                                name="userSurname"
                                value={formData.userSurname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">
                                Password {isEditMode && <span className="text-muted">(required by current backend)</span>}
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Role</label>
                            <select
                                className="form-select"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="MANAGER">MANAGER</option>
                                <option value="SALES">SALES</option>
                                <option value="FINANCE">FINANCE</option>
                                <option value="PURCHASE">PURCHASE</option>
                                <option value="OPERATIONS">OPERATIONS</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-success me-2">
                            {isEditMode ? "Update User" : "Save User"}
                        </button>

                        <Link to="/users" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserFormPage;