import "../styles/ComingSoon.css";

function ComingSoonPage({ title, description }) {
    return (
        <div className="coming-soon-container">
            <div className="coming-soon-content">
                <div className="coming-soon-icon">
                    <i className="bi bi-rocket"></i>
                </div>
                <h1 className="coming-soon-title">{title}</h1>
                <p className="coming-soon-description">
                    {description || "This feature is currently under development and will be available soon."}
                </p>
                <div className="coming-soon-badge">
                    <span>Coming Soon</span>
                </div>
            </div>
        </div>
    );
}

export default ComingSoonPage;
