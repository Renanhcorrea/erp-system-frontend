import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllWorkCenters, deleteWorkCenter } from "../services/workCenterApi";
import { getFriendlyApiError } from "../services/api";

const PROCESS_TYPES = ["CUTTING", "BENDING", "WELDING", "PAINTING", "ASSEMBLY", "PACKAGING"];
const PAGE_SIZE = 10;

// Spring Boot can serialize LocalDateTime as ISO string or as an array [y,M,d,H,m,s,ns]
function formatDate(value) {
    if (!value) return "-";
    let date;
    if (Array.isArray(value)) {
        // [year, month(1-based), day, hour, minute, second, nano?]
        const [y, M, d, h = 0, m = 0, s = 0] = value;
        date = new Date(y, M - 1, d, h, m, s);
    } else {
        date = new Date(value);
    }
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

function WorkCenterPage() {
    const [workCenters, setWorkCenters] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const [filterProcessType, setFilterProcessType] = useState("");
    const [filterActive, setFilterActive] = useState("");

    // ── Data loading ──────────────────────────────────────────────────────────

    const loadWorkCenters = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getAllWorkCenters(currentPage, pageSize);
            
            // Normalize Spring Page response
            if (Array.isArray(data)) {
                setWorkCenters(data);
                setTotalElements(data.length);
                setTotalPages(1);
            } else {
                setWorkCenters(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            }
        } catch (err) {
            console.error("Error loading work centers:", err);
            setError(getFriendlyApiError(err, "Failed to load work centers."));
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        loadWorkCenters();
    }, [loadWorkCenters]);

    // ── Actions ───────────────────────────────────────────────────────────────

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            setMessage(null);
            await deleteWorkCenter(id);
            setMessage({ type: "success", text: "Work center deleted successfully." });
            loadWorkCenters();
        } catch (err) {
            console.error("Error deleting work center:", err);
            setError(getFriendlyApiError(err, "Failed to delete work center."));
        }
    };

    // ── Derived list: filter then sort A-Z ───────────────────────────────────

    const displayedWorkCenters = workCenters
        .filter((c) => {
            if (filterProcessType && c.processType !== filterProcessType) return false;
            if (filterActive !== "" && c.active !== (filterActive === "true")) return false;
            return true;
        })
        .sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
        );

    // ── Render ────────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading work centers...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Work Centers</h1>
                <Link to="/work-centers/new" className="btn btn-primary">
                    <i className="bi bi-plus-lg"></i> New Work Center
                </Link>
            </div>

            {/* Feedback */}
            {message && (
                <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible`}>
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage(null)} />
                </div>
            )}
            {error && (
                <div className="alert alert-danger alert-dismissible">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)} />
                </div>
            )}

            {/* Filters */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="filterProcessType" className="form-label">
                        Filter by Process Type
                    </label>
                    <select
                        id="filterProcessType"
                        className="form-select"
                        value={filterProcessType}
                        onChange={(e) => setFilterProcessType(e.target.value)}
                    >
                        <option value="">All Process Types</option>
                        {PROCESS_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="filterActive" className="form-label">
                        Filter by Status
                    </label>
                    <select
                        id="filterActive"
                        className="form-select"
                        value={filterActive}
                        onChange={(e) => setFilterActive(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {displayedWorkCenters.length === 0 ? (
                <div className="alert alert-info">No work centers found.</div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Process Type</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedWorkCenters.map((center) => (
                                <tr key={center.id}>
                                    <td><strong>{center.name}</strong></td>
                                    <td>
                                        <span className="badge bg-secondary">
                                            {center.processType}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${center.active ? "success" : "danger"}`}>
                                            {center.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        {formatDate(center.createdAt)}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/work-centers/${center.id}/edit`}
                                            className="btn btn-sm btn-warning me-2"
                                        >
                                            <i className="bi bi-pencil"></i> Edit
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(center.id, center.name)}
                                        >
                                            <i className="bi bi-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <small className="text-muted">
                            Page {currentPage + 1} of {totalPages} ({totalElements} total)
                        </small>
                        <div className="btn-group">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                            >
                                ← Previous
                            </button>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setCurrentPage((p) => p + 1)}
                                disabled={currentPage + 1 >= totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default WorkCenterPage;
