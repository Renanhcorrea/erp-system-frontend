import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    createWorkCenter,
    getWorkCenterById,
    updateWorkCenter
} from "../services/workCenterApi";
import { getFriendlyApiError } from "../services/api";

const PROCESS_TYPES = ["CUTTING", "BENDING", "WELDING", "PAINTING", "ASSEMBLY", "PACKAGING"];

const EMPTY_FORM = { name: "", processType: "", active: true };

function WorkCenterFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // ── Load existing record in edit mode ─────────────────────────────────────

    useEffect(() => {
        if (!isEditMode) return;

        const loadWorkCenter = async () => {
            try {
                setLoading(true);
                const data = await getWorkCenterById(id);
                setFormData({
                    name: data.name || "",
                    processType: data.processType || "",
                    active: data.active !== false
                });
            } catch (err) {
                console.error("Error loading work center:", err);
                setError(getFriendlyApiError(err, "Failed to load work center data."));
            } finally {
                setLoading(false);
            }
        };

        loadWorkCenter();
    }, [id, isEditMode]);

    // ── Field change ─────────────────────────────────────────────────────────

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // ── Save (create or update) ──────────────────────────────────────────────

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload = {
                name: formData.name.trim(),
                processType: formData.processType,
                active: formData.active
            };

            if (isEditMode) {
                await updateWorkCenter(id, payload);
            } else {
                await createWorkCenter(payload);
            }

            navigate("/work-centers");
        } catch (err) {
            console.error("Error saving work center:", err);
            setError(getFriendlyApiError(err, "Failed to save work center."));
        } finally {
            setLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    if (loading && isEditMode) {
        return (
            <div className="container mt-5">
                <p>Loading work center data...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{isEditMode ? "Edit Work Center" : "New Work Center"}</h1>
                <Link to="/work-centers" className="btn btn-secondary">
                    Back
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

            {/* Form */}
            <div className="card p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">
                                Name <span className="text-danger">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                maxLength={100}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="processType" className="form-label">
                                Process Type <span className="text-danger">*</span>
                            </label>
                            <select
                                id="processType"
                                name="processType"
                                className="form-select"
                                value={formData.processType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a process type</option>
                                {PROCESS_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        {isEditMode && (
                            <div className="col-md-3">
                                <label htmlFor="active" className="form-label">Status</label>
                                <select
                                    id="active"
                                    name="active"
                                    className="form-select"
                                    value={String(formData.active)}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            active: e.target.value === "true"
                                        }))
                                    }
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                                <small className="text-muted">Set to Active to reactivate the work center.</small>
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-between">
                        <Link to="/work-centers" className="btn btn-secondary">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : isEditMode ? "Save Changes" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WorkCenterFormPage;
