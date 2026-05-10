import { useEffect, useState } from "react";
import { createProduct, getProductById, updateProduct } from "../services/productService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFriendlyApiError } from "../services/api";
import { executeStockAction, getProductStock } from "../services/stockService";
import { STOCK_ACTIONS } from "../types/stockTypes";

function ProductFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        sku: "",
        name: "",
        description: "",
        price: "",
        quantity: "",
        adjustmentQuantity: "",
        adjustmentReferenceId: "",
        unit: "",
        type: "SCREW",
        active: true
    });
    const [stockData, setStockData] = useState({
        availableQuantity: 0,
        reservedQuantity: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProduct = async () => {
            if (!isEditMode) return;

            try {
                setLoading(true);
                const data = await getProductById(id);

                let stock = null;
                try {
                    stock = await getProductStock(id);
                } catch (stockError) {
                    console.error("Error loading product stock:", stockError);
                }

                setFormData({
                    sku: data.sku || "",
                    name: data.name || "",
                    description: data.description || "",
                    price: data.price || "",
                    quantity: data.availableQuantity ?? data.quantity ?? "",
                    adjustmentQuantity: "",
                    adjustmentReferenceId: "",
                    unit: data.unit || "",
                    type: data.type || "SCREW",
                    active: data.active !== false
                });
                setStockData({
                    availableQuantity: Number(stock?.availableQuantity ?? data.availableQuantity ?? data.quantity ?? 0),
                    reservedQuantity: Number(stock?.reservedQuantity ?? data.reservedQuantity ?? 0)
                });
            } catch (error) {
                console.error("Error loading product:", error);
                setError(getFriendlyApiError(error, "Failed to load product data."));
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
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
        setLoading(true);

        const basePayload = {
            sku: formData.sku.trim(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            unit: formData.unit.trim(),
            type: formData.type
        };

        try {
            if (isEditMode) {
                await updateProduct(id, {
                    ...basePayload,
                    active: formData.active
                });

                const adjustmentQuantity = Number(formData.adjustmentQuantity || 0);
                if (adjustmentQuantity !== 0) {
                    await executeStockAction(
                        adjustmentQuantity > 0 ? STOCK_ACTIONS.ADD : STOCK_ACTIONS.REMOVE,
                        id,
                        {
                            quantity: Math.abs(adjustmentQuantity),
                            referenceId: formData.adjustmentReferenceId
                        }
                    );
                }
            } else {
                await createProduct({
                    ...basePayload,
                    quantity: Number(formData.quantity || 0)
                });
            }

            navigate("/products");
        } catch (error) {
            console.error("Error saving product:", error);
            setError(getFriendlyApiError(error, "Failed to save product."));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading product data...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>
                <Link to="/products" className="btn btn-secondary">
                    Back
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label">SKU</label>
                            <input
                                type="text"
                                className="form-control"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-5">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-7">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                rows="1"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="form-control"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {!isEditMode && (
                            <div className="col-md-3">
                                <label className="form-label">Initial Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="quantity"
                                    placeholder="0"
                                    min="0"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="col-md-3">
                            <label className="form-label">Unit</label>
                            <input
                                type="text"
                                className="form-control"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Type</label>
                            <select
                                className="form-select"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="SCREW">Screw</option>
                                <option value="STEEL_SHEET">Steel Sheet</option>
                                <option value="STAINLESS_STEEL_SHEET">Stainless Steel Sheet</option>
                            </select>
                        </div>

                        {isEditMode && (
                            <div className="col-md-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    name="active"
                                    value={String(formData.active)}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            active: e.target.value === "true"
                                        }));
                                    }}
                                    required
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                                <small className="text-muted">Set to Active to reactivate the product.</small>
                            </div>
                        )}

                        {isEditMode && (
                            <>
                                <div className="col-12 mt-3">
                                    <h5 className="mb-2">Quantity</h5>
                                    <p className="text-muted mb-0">
                                        Use a positive value to add stock and a negative value to remove stock for inventory adjustment.
                                    </p>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Available Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={stockData.availableQuantity}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Reserved Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={stockData.reservedQuantity}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Quantity Adjustment</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="adjustmentQuantity"
                                        placeholder="Example: 10 or -5"
                                        value={formData.adjustmentQuantity}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Adjustment Reference ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="adjustmentReferenceId"
                                        placeholder="Optional"
                                        value={formData.adjustmentReferenceId}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-success me-2" disabled={loading}>
                            {loading ? "Saving..." : isEditMode ? "Update Product" : "Save Product"}
                        </button>
                        <Link to="/products" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductFormPage;