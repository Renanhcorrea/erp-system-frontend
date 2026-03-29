function Topbar({ onToggleSidebar }) {
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
                <span className="d-none d-md-inline">User</span>
            </div>
        </header>
    );
}

export default Topbar;