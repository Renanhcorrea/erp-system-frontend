import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Topbar({ onToggleSidebar }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const displayName = user
        ? `${user.userName || ""} ${user.userSurname || ""}`.trim() || user.email
        : "";

    return (
        <header className="erp-topbar">
            <div className="d-flex align-items-center gap-3">
                <button
                    type="button"
                    className="btn btn-link text-white p-0 erp-menu-btn"
                    onClick={onToggleSidebar}
                >
                    <i className="bi bi-list fs-3"></i>
                </button>

                <span className="fw-semibold">ERP System</span>
            </div>

            <div className="d-flex align-items-center gap-3">
                <i className="bi bi-bell fs-5"></i>
                <i className="bi bi-person-circle fs-4"></i>
                <span className="d-none d-md-inline">{displayName}</span>
                {user?.role && (
                    <span className="badge bg-secondary d-none d-md-inline">{user.role}</span>
                )}
                <button
                    type="button"
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Topbar;
