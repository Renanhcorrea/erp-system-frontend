import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFriendlyApiError } from "../services/api";
import {
    createProductRouting,
    getProductRoutingById,
    updateProductRouting
} from "../services/productRoutingService";

const PROCESS_TYPES = ["CUTTING", "BENDING", "WELDING", "PAINTING", "ASSEMBLY", "PACKAGING"];

const createEmptyProcess = (sequence = 1) => ({
    processType: "CUTTING",
    sequence,
    estimatedMinutes: "",
    workCenterId: "",
    active: true
});

function ProductRoutingFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        productId: "",
        active: true,
        processes: [createEmptyProcess(1)]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRouting = async () => {
            if (!isEditMode) return;

            try {
                setLoading(true);
                setError(null);

                const data = await getProductRoutingById(id);
                const processes = Array.isArray(data.processes) && data.processes.length > 0
                    ? data.processes
                        .slice()
                        .sort((a, b) => Number(a?.sequence || 0) - Number(b?.sequence || 0))
                        .map((process, index) => ({
                            processType: process.processType || "CUTTING",
                            sequence: process.sequence ?? index + 1,
                            estimatedMinutes: process.estimatedMinutes ?? "",
                            workCenterId: process.workCenterId ?? "",
                            active: process.active !== false
                        }))
                    : [createEmptyProcess(1)];

                setFormData({
                    productId: data.productId ?? "",
                    active: data.active !== false,
                    processes
                });
            } catch (requestError) {
                console.error("Error loading routing:", requestError);
                setError(getFriendlyApiError(requestError, "Failed to load routing data."));
            } finally {
                setLoading(false);
            }
        };

        loadRouting();
    }, [id, isEditMode]);

    const handleBaseChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProcessChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            processes: prev.processes.map((process, processIndex) => {
                if (processIndex !== index) return process;
                return {
                    ...process,
                    [field]: value
                };
            })
        }));
    };

    const handleAddProcess = () => {
        setFormData((prev) => ({
            ...prev,
            processes: [...prev.processes, createEmptyProcess(prev.processes.length + 1)]
        }));
    };

    const handleRemoveProcess = (index) => {
        setFormData((prev) => {
            if (prev.processes.length === 1) return prev;

            const nextProcesses = prev.processes
                .filter((_, processIndex) => processIndex !== index)
                .map((process, processIndex) => ({
                    ...process,
                    sequence: processIndex + 1
                }));

            return {
                ...prev,
                processes: nextProcesses
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload = {
                productId: Number(formData.productId),
                active: formData.active === true || formData.active === "true",
                processes: formData.processes.map((process) => ({
                    processType: process.processType,
                    sequence: Number(process.sequence),
                    estimatedMinutes: Number(process.estimatedMinutes),
                    workCenterId:
                        process.workCenterId === "" || process.workCenterId == null
                            ? null
                            : Number(process.workCenterId),
                    active: process.active === true || process.active === "true"
                }))
            };

            if (isEditMode) {
                await updateProductRouting(id, payload);
            } else {
                await createProductRouting(payload);
            }

            navigate("/product-routings");
        } catch (requestError) {
            console.error("Error saving routing:", requestError);
            setError(getFriendlyApiError(requestError, "Failed to save routing."));
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="container mt-5">
                <p>Loading routing data...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{isEditMode ? "Edit Routing" : "Add New Routing"}</h1>
                <Link to="/product-routings" className="btn btn-secondary">
                    Back
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <label htmlFor="productId" className="form-label">Product ID</label>
                            <input
                                id="productId"
                                type="number"
                                className="form-control"
                                name="productId"
                                value={formData.productId}
                                onChange={handleBaseChange}
                                required
                                min="1"
                            />
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="active" className="form-label">Status</label>
                            <select
                                id="active"
                                name="active"
                                className="form-select"
                                value={String(formData.active)}
                                onChange={handleBaseChange}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Processes</h5>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={handleAddProcess}
                        >
                            Add Process
                        </button>
                    </div>

                    {formData.processes.map((process, index) => (
                        <div key={`${index}-${process.sequence}`} className="card p-3 mb-3 bg-light-subtle border">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Process #{index + 1}</h6>
                            </div>
                            <div className="row g-3 align-items-end">
                                <div className="col-md-3">
                                    <label className="form-label">Process Type</label>
                                    <select
                                        className="form-select"
                                        value={process.processType}
                                        onChange={(event) =>
                                            handleProcessChange(index, "processType", event.target.value)
                                        }
                                        required
                                    >
                                        {PROCESS_TYPES.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Sequence</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={process.sequence}
                                        onChange={(event) =>
                                            handleProcessChange(index, "sequence", event.target.value)
                                        }
                                        required
                                        min="1"
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Estimated Minutes</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={process.estimatedMinutes}
                                        onChange={(event) =>
                                            handleProcessChange(index, "estimatedMinutes", event.target.value)
                                        }
                                        required
                                        min="1"
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Work Center ID (optional)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={process.workCenterId}
                                        onChange={(event) =>
                                            handleProcessChange(index, "workCenterId", event.target.value)
                                        }
                                        min="1"
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={String(process.active)}
                                        onChange={(event) =>
                                            handleProcessChange(index, "active", event.target.value)
                                        }
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>

                                <div className="col-md-1 d-grid">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleRemoveProcess(index)}
                                        disabled={formData.processes.length === 1}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="d-flex justify-content-between">
                        <Link to="/product-routings" className="btn btn-secondary">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Saving..." : isEditMode ? "Save Changes" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductRoutingFormPage;
