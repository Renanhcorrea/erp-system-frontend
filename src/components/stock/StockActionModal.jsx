import { useState } from "react";
import { STOCK_ACTION_LABELS } from "../../types/stockTypes";

const INITIAL_FORM = {
    quantity: "",
    referenceId: ""
};

function StockActionModal({
    isOpen,
    action,
    product,
    loading,
    onClose,
    onSubmit
}) {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [validationError, setValidationError] = useState("");

    if (!isOpen || !product || !action) {
        return null;
    }

    const title = STOCK_ACTION_LABELS[action] || "Stock Action";

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const quantity = Number(formData.quantity);
        if (!quantity || quantity <= 0) {
            setValidationError("Quantity must be greater than zero.");
            return;
        }

        setValidationError("");
        await onSubmit({
            quantity,
            referenceId: formData.referenceId
        });
    };

    return (
        <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                disabled={loading}
                                aria-label="Close"
                            />
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <p className="mb-3 text-muted">
                                    Product: <strong>{product.name}</strong> ({product.sku || "-"})
                                </p>

                                {validationError && <div className="alert alert-danger py-2">{validationError}</div>}

                                <div className="mb-3">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        className="form-control"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Reference ID (optional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="referenceId"
                                        value={formData.referenceId}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Saving..." : title}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" />
        </>
    );
}

export default StockActionModal;
