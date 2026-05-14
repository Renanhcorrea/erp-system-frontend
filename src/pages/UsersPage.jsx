import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser, searchUsers } from "../services/userService";
import useResizableColumns from "../hooks/useResizableColumns";

const INITIAL_FILTERS = {
    userName: "",
    userSurname: "",
    phone: "",
    role: "",
    email: "",
    status: "",
    keyword: ""
};

const INITIAL_COLUMN_WIDTHS = {
    id: 80,
    firstName: 150,
    surname: 150,
    email: 240,
    phone: 140,
    role: 120,
    status: 120,
    actions: 170
};

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

    const [pageData, setPageData] = useState({
        number: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { getColumnStyle, getResizeHandleProps } = useResizableColumns(INITIAL_COLUMN_WIDTHS);

    const fetchUsers = async (page = 0, currentFilters = appliedFilters) => {
        try {
            setLoading(true);
            setError(null);

            const data = await searchUsers({
                userName: currentFilters.userName,
                userSurname: currentFilters.userSurname,
                phone: currentFilters.phone,
                role: currentFilters.role,
                page,
                size: 10
            });

            setUsers(data.content || []);
            setAppliedFilters(currentFilters);
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
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await searchUsers({
                    page: 0,
                    size: 10
                });

                setUsers(data.content || []);
                setAppliedFilters(INITIAL_FILTERS);
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

        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const name = (user.userName || "").toLowerCase();
            const surname = (user.userSurname || "").toLowerCase();
            const email = (user.email || "").toLowerCase();
            const phone = (user.phoneNumber || "").toLowerCase();
            const role = (user.role || "").toLowerCase();

            const keyword = appliedFilters.keyword.trim().toLowerCase();
            const emailFilter = appliedFilters.email.trim().toLowerCase();

            const matchesKeyword =
                !keyword ||
                name.includes(keyword) ||
                surname.includes(keyword) ||
                email.includes(keyword) ||
                phone.includes(keyword) ||
                role.includes(keyword);

            const matchesEmail = !emailFilter || email.includes(emailFilter);

            const matchesStatus =
                appliedFilters.status === ""
                    ? true
                    : appliedFilters.status === "active"
                    ? user.active === true
                    : user.active === false;

            return matchesKeyword && matchesEmail && matchesStatus;
        });
    }, [users, appliedFilters]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        fetchUsers(0, filters);
    };

    const handleClear = () => {
        setFilters(INITIAL_FILTERS);
        fetchUsers(0, INITIAL_FILTERS);
    };

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
            <div className="container mt-5">
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Users Management</h1>
                <Link to="/users/new" className="btn btn-primary">
                    Add New User
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card p-3 mb-4">
                <h5 className="mb-3">Filters</h5>

                <div className="row g-3">
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="keyword"
                            placeholder="Keyword"
                            value={filters.keyword}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="userName"
                            placeholder="First name"
                            value={filters.userName}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="userSurname"
                            placeholder="Surname"
                            value={filters.userSurname}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            value={filters.email}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            placeholder="Phone"
                            value={filters.phone}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
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

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="col-md-1">
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>

                    <div className="col-md-1">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <p className="text-muted">No users found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th className="resizable-th" style={getColumnStyle("id")}>ID<span {...getResizeHandleProps("id")} /></th>
                                <th className="resizable-th" style={getColumnStyle("firstName")}>First Name<span {...getResizeHandleProps("firstName")} /></th>
                                <th className="resizable-th" style={getColumnStyle("surname")}>Surname<span {...getResizeHandleProps("surname")} /></th>
                                <th className="resizable-th" style={getColumnStyle("email")}>Email<span {...getResizeHandleProps("email")} /></th>
                                <th className="resizable-th" style={getColumnStyle("phone")}>Phone<span {...getResizeHandleProps("phone")} /></th>
                                <th className="resizable-th" style={getColumnStyle("role")}>Role<span {...getResizeHandleProps("role")} /></th>
                                <th className="resizable-th" style={getColumnStyle("status")}>Status<span {...getResizeHandleProps("status")} /></th>
                                <th className="resizable-th" style={getColumnStyle("actions")}>Actions<span {...getResizeHandleProps("actions")} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td style={getColumnStyle("id")}>{user.id}</td>
                                    <td style={getColumnStyle("firstName")}>{user.userName}</td>
                                    <td style={getColumnStyle("surname")}>{user.userSurname}</td>
                                    <td style={getColumnStyle("email")}>{user.email}</td>
                                    <td style={getColumnStyle("phone")}>{user.phoneNumber}</td>
                                    <td style={getColumnStyle("role")}>{user.role}</td>
                                    <td style={getColumnStyle("status")}>
                                        <span className={`badge ${user.active ? "bg-success" : "bg-secondary"}`}>
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td style={getColumnStyle("actions")}>
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
                        onClick={() => fetchUsers(pageData.number - 1, appliedFilters)}
                    >
                        Previous
                    </button>

                    <span className="align-self-center">
                        Page {pageData.number + 1} of {pageData.totalPages || 1}
                    </span>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={pageData.number + 1 >= pageData.totalPages}
                        onClick={() => fetchUsers(pageData.number + 1, appliedFilters)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UsersPage;