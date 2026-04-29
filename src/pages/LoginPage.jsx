import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { loginUser } from "../services/authService";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const normalizedEmail = email.trim().toLowerCase();
            const userData = await loginUser(normalizedEmail, password);
            login(userData, normalizedEmail, password);
            navigate("/dashboard");
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Invalid email or password.");
            } else {
                setError("Failed to connect to the server. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#f0f2f5" }}
        >
            <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "420px" }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-1">ERP System</h2>
                    <p className="text-muted mb-0">Sign in to your account</p>
                </div>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            autoComplete="username"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
