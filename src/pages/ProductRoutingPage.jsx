import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFriendlyApiError } from "../services/api";
import useResizableColumns from "../hooks/useResizableColumns";
import {
    deleteProductRouting,
    getAllProductRoutings
} from "../services/productRoutingService";

const PAGE_SIZE = 10;
const INITIAL_COLUMN_WIDTHS = {
    id: 60,
    productName: 200,
    version: 120,
    status: 120,
    processes: 320,
    actions: 60
};

function ProductRoutingPage() {
    const { getColumnStyle, getResizeHandleProps } = useResizableColumns(INITIAL_COLUMN_WIDTHS);
    const [routings, setRoutings] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(PAGE_SIZE);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const loadRoutings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getAllProductRoutings(currentPage, pageSize);

            if (Array.isArray(data)) {
                setRoutings(data);
                setTotalElements(data.length);
                setTotalPages(1);
                return;
            }

            setRoutings(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (requestError) {
            console.error("Error loading routings:", requestError);
            setError(getFriendlyApiError(requestError, "Failed to load routings."));
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        const timer = setTimeout(() => {
            void loadRoutings();
        }, 0);

        return () => clearTimeout(timer);
    }, [loadRoutings]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this routing?")) return;

        try {
            setMessage(null);
            await deleteProductRouting(id);
            setMessage({ type: "success", text: "Routing deleted successfully." });
            await loadRoutings();
        } catch (requestError) {
            console.error("Error deleting routing:", requestError);
            setError(getFriendlyApiError(requestError, "Failed to delete routing."));
        }
    };

    const processSummary = (routing) => {
    const processes = Array.isArray(routing.processes) ? routing.processes : [];

    const activeProcesses = processes
        .filter((process) => process.active !== false)
        .slice()
        .sort((a, b) => Number(a?.sequence || 0) - Number(b?.sequence || 0));

    if (activeProcesses.length === 0) {
        return "No active processes";
    }

    return activeProcesses
        .map((item) => `${item.processType || "-"} (#${item.sequence || "-"})`)
        .join(", ");
};

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading routings...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Routing</h1>
                <Link to="/product-routings/new" className="btn btn-primary">
                    Add New Routing
                </Link>
            </div>

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

            {routings.length === 0 ? (
                <div className="alert alert-info">No routings found.</div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th className="resizable-th" style={getColumnStyle("id")}>ID<span {...getResizeHandleProps("id")} /></th>
                                    <th className="resizable-th" style={getColumnStyle("productName")}>Product Name<span {...getResizeHandleProps("productName")} /></th>
                                    <th className="resizable-th" style={getColumnStyle("version")}>Version<span {...getResizeHandleProps("version")} /></th>
                                    <th className="resizable-th" style={getColumnStyle("status")}>Status<span {...getResizeHandleProps("status")} /></th>
                                    <th className="resizable-th" style={getColumnStyle("processes")}>Processes<span {...getResizeHandleProps("processes")} /></th>
                                    <th className="resizable-th" style={getColumnStyle("actions")}>Actions<span {...getResizeHandleProps("actions")} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {routings.map((routing) => (
                                    <tr key={routing.id}>
                                        <td style={getColumnStyle("id")}>{routing.id}</td>
                                        <td style={getColumnStyle("productName")}>{routing.productName || routing.product?.name || `#${routing.productId ?? "-"}`}</td>
                                        <td style={getColumnStyle("version")}>{routing.version ?? "-"}</td>
                                        <td style={getColumnStyle("status")}>
                                            <span className={`badge bg-${routing.active ? "success" : "danger"}`}>
                                                {routing.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td style={getColumnStyle("processes")}>{processSummary(routing)}</td>
                                        <td style={getColumnStyle("actions")}>
                                            <Link
                                                to={`/product-routings/${routing.id}/edit`}
                                                className="btn btn-sm btn-warning me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(routing.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <small className="text-muted">
                            Page {currentPage + 1} of {totalPages} ({totalElements} total)
                        </small>
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                                disabled={currentPage === 0}
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setCurrentPage((page) => page + 1)}
                                disabled={currentPage + 1 >= totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProductRoutingPage;
