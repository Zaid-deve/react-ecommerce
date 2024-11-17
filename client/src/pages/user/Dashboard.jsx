import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth, logout } from "../../context/AuthProvider";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const { isLogin, setLogin, userDetals } = useAuth(),
        navigate = useNavigate(),
        location = useLocation();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (location.pathname === "/dashboard") {
            navigate("/dashboard/profile");
        }
    }, [location, navigate]);

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (!isLogin) {
        navigate('/login');
    }

    function logoutUser() {
        logout();
        setLogin(false);
        navigate('/login');
    }

    const colStyle = {
        height: windowWidth >= 768 ? "100%" : "auto"
    };

    return (
        <div className="row m-0 g-0 h-100">
            <div className="col-md-4 col-12 bg-white p-3" style={colStyle}>
                <div className="d-flex gap-2 mb-3 align-items-center">
                    <h3 className="mb-0">Welcome {userDetals?.username}</h3>
                    <button className="btn btn-outline-danger rounded-5 has-icon ms-auto" onClick={logoutUser}>
                        <i className="bi bi-box-arrow-right"></i><span>Logout</span>
                    </button>
                </div>
                <ul className="list-unstyled">
                    <Link to="/dashboard/profile" className="list-item d-flex align-items-center gap-2 p-3 bg-light rounded-4">
                        <i className="bi bi-person fs-5"></i>
                        <span className="fs-6">Profile</span>
                    </Link>
                    <Link to="/dashboard/cart" className="list-item d-flex align-items-center gap-2 p-3">
                        <i className="bi bi-cart fs-5"></i>
                        <span className="fs-6">Cart</span>
                    </Link>
                    <Link to="/dashboard/orders" className="list-item d-flex align-items-center gap-2 p-3">
                        <i className="bi bi-bag fs-5"></i>
                        <span className="fs-6">Orders</span>
                    </Link>
                    <Link to="/dashboard/terms" className="list-item d-flex align-items-center gap-2 p-3">
                        <i className="bi bi-file-earmark-text fs-5"></i>
                        <span className="fs-6">Terms and Conditions</span>
                    </Link>
                </ul>
            </div>
            <div className="col h-100">
                <Outlet />
            </div>
        </div>
    );
}
