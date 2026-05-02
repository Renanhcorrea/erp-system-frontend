import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteProduct, getAllProducts } from "../services/productService";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filterSku, setFilterSku] = useState("");
    const [filterName, setFilterName] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterUnit, setFilterUnit] = useState("");
    const [filterActive, setFilterActive] = useState("");

    const navigate = useNavigate();


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllProducts();
                setProducts(data || []);
            } catch (error) {
                console.error("Error loading products:", error);
                setError("Failed to load products: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, []);

     const handleDelete = async (id, name) => {
        const confirmed = window.confirm(`Are you sure you want to delete/deactivate the product "${name}"?`);
        if (!confirmed) return;

        try {
            await deleteProduct(id);
            setProducts((prev) =>
                prev.map((product) =>
                    product.id === id ? { ...product, active: false } : product
                )
            );
        } catch (error) {
            console.error("Error deleting product:", error);
            setError("Failed to delete product: " + error.message);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSku = (product.sku || "").toLowerCase().includes(filterSku.toLowerCase());
            const matchesName = product.name?.toLowerCase().includes(filterName.toLowerCase());
            const matchesType = filterType ? product.type === filterType : true;
            const matchesUnit = product.unit?.toLowerCase().includes(filterUnit.toLowerCase());
            const matchesActive =
                filterActive === ""
                    ? true
                    : filterActive === "true"
                    ? product.active === true
                    : product.active === false;

            return matchesSku && matchesName && matchesType && matchesUnit && matchesActive;
        });
    }, [products, filterSku, filterName, filterType, filterUnit, filterActive]);

    if (loading) {
        return (
            <div className="container mt-5">
                <p>⏳ Loading products...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Products Management</h1>
                <Link to="/products/new" className="btn btn-primary">
                    Add New Product
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
                            placeholder="SKU"
                            value={filterSku}
                            onChange={(e) => setFilterSku(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All types</option>
                            <option value="SCREW">Screw</option>
                            <option value="STEEL_SHEET">Steel Sheet</option>
                            <option value="STAINLESS_STEEL_SHEET">Stainless Steel Sheet</option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Unit"
                            value={filterUnit}
                            onChange={(e) => setFilterUnit(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filterActive}
                            onChange={(e) => setFilterActive(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <div className="col-md-1">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => {
                                setFilterSku("");
                                setFilterName("");
                                setFilterType("");
                                setFilterUnit("");
                                setFilterActive("");
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
    <p className="text-muted">No products found.</p>
) : (
    <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Unit</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredProducts.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.sku || "-"}</td>
                        <td>{p.name}</td>
                        <td>€{Number(p.price).toFixed(2)}</td>
                        <td>{p.quantity}</td>
                        <td>{p.unit}</td>
                        <td>{p.type}</td>
                        <td>
                            <span className={`badge ${p.active ? "bg-success" : "bg-secondary"}`}>
                                {p.active ? "Active" : "Inactive"}
                            </span>
                        </td>
                        <td>
                            <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => navigate(`/products/edit/${p.id}`)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(p.id, p.name)}
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
        </div>
    );
}

export default ProductsPage;