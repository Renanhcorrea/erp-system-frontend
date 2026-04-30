import { useEffect, useState } from "react";
import { createProduct, getProductById, updateProduct } from "../services/productService";
import { Link, useNavigate, useParams } from "react-router-dom";

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
        unit: "",
        type: "SCREW"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProduct = async () => {
            if (!isEditMode) return;

            try {
                setLoading(true);
                const data = await getProductById(id);

                setFormData({
                    sku: data.sku || "",
                    name: data.name || "",
                    description: data.description || "",
                    price: data.price || "",
                    quantity: data.quantity || "",
                    unit: data.unit || "",
                    type: data.type || "Screw"
                });
            } catch (error) {
                console.error("Error loading product:", error);
                setError("Failed to load product data.");
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

        const payload = {
            sku: formData.sku.trim(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            quantity: Number(formData.quantity),
            unit: formData.unit.trim(),
            type: formData.type
        };

        try {
            if (isEditMode) {
                await updateProduct(id, payload);
            } else {
                await createProduct(payload);
            }

            navigate("/products");
        } catch (error) {
            console.error("Error saving product:", error);
            setError("Failed to save product.");
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

                        <div className="col-md-3">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                placeholder="0"                                
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>

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
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-success me-2">
                            {isEditMode ? "Update Product" : "Save Product"}
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