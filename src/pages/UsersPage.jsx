import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser, searchUsers } from "../services/userService";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [pageData, setPageData] = useState({
        number: 0,
        size: 10,
        totalPages: 0, 
        totalElements: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filterName, setFilterName] = useState("");
    const [filterSurname, setFilterSurname] = useState("");
    const [filterPhone, setFilterPhone] = useState("");
    const [filterRole, setFilterRole] = useState("");

    const navigate = useNavigate();

    const fetchUsers = async (page = 0, filters = null) => {
        try {
            setLoading(true);
            setError(null);

            const currentFilters = filters || {
                userName: filterName,
                userSurname: filterSurname,
                phone: filterPhone,
                role: filterRole
            };

            const data = await searchUsers({
                ...currentFilters,
                page,
                size: 10
            });

            setUsers(data.content || []);
            setPageData({
                number: data.number ?? 0,
                size: data.size ?? 10,
                totalPages: data.totalPages ?? 0,
                totalElements: data.totalElements ?? 0
            });
        } catch (error) {
            console.error("Error loading users:", error);
            setError("Failed to load users: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(0);
    }, []);

    const handleDelete = async (id, name, surname) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate the user "${name} ${surname}"?`
        );

        if (!confirmed) return;

        try {
            await deleteUser(id);
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === id ? { ...user, active: false } : user
                )
            );
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Failed to delete user: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) {
        return (
            <div className="container-fluid mt-4">
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Users Management</h1>
                <Link to="/users/new" className="btn btn-primary">
                    Add New User
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card p-3 mb-4">
                <h5 className="mb-3">Filters</h5>

                <div className="row g-3">
                    <div className="col-12 col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="First name"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Surname"
                            value={filterSurname}
                            onChange={(e) => setFilterSurname(e.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Phone"
                            value={filterPhone}
                            onChange={(e) => setFilterPhone(e.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-2">
                        <select
                            className="form-select"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="">All roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="SALES">Sales</option>
                            <option value="FINANCE">Finance</option>
                            <option value="PURCHASE">Purchase</option>
                            <option value="OPERATIONS">Operations</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-1">
                        <button
                            className="btn btn-primary w-100"
                            onClick={() =>
                                fetchUsers(0, {
                                    userName: filterName,
                                    userSurname: filterSurname,
                                    phone: filterPhone,
                                    role: filterRole
                                })
                            }
                        >
                            Search
                        </button>
                    </div>

                    <div className="col-12 col-md-1">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => {
                                setFilterName("");
                                setFilterSurname("");
                                setFilterPhone("");
                                setFilterRole("");
                                fetchUsers(0, {
                                    userName: "",
                                    userSurname: "",
                                    phone: "",
                                    role: ""
                                });
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {users.length === 0 ? (
                <p className="text-muted">No users found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Surname</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th style={{ minWidth: "160px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.userSurname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <span className={`badge ${user.active ? "bg-success" : "bg-secondary"}`}>
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/users/edit/${user.id}`)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(user.id, user.userName, user.userSurname)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3">
                <span>
                    Total users: <strong>{pageData.totalElements}</strong>
                </span>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={pageData.number === 0}
                        onClick={() => fetchUsers(pageData.number - 1)}
                    >
                        Previous
                    </button>

                    <span className="align-self-center">
                        Page {pageData.number + 1} of {pageData.totalPages || 1}
                    </span>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={pageData.number + 1 >= pageData.totalPages}
                        onClick={() => fetchUsers(pageData.number + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UsersPage;