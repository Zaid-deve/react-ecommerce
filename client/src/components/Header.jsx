import { Link } from "react-router-dom"
import logoImg from '/src/assets/7835563.png'
import { useAuth } from "../context/AuthProvider"


export default function Header() {
    const { isLogin } = useAuth();

    let btn = ''

    if (isLogin) {
        btn = <Link to="/dashboard" className="btn has-icon btn-primary rounded-5 px-4 ">
            <i className="bi bi-person text-light"></i> <span className="text-light">My Account</span>
        </Link>
    } else {
        btn = <Link to="/login" className="btn has-icon btn-primary rounded-5 px-4 ">
            <i className="bi bi-person text-light"></i> <span className="text-light">Login</span>
        </Link>
    }

    return (
        <nav className="navbar navbar-expand-lg bg-white py-3 px-3">
            <div className="container-fluid">
                <button className="navbar-toggler me-1 border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="bg-dark" style={{ width: "32px", height: "2px", display: "block" }}></span>
                    <span className="bg-dark mt-2" style={{ width: "32px", height: "2px", display: "block" }}></span>
                </button>
                <Link to='/' className="me-auto">
                    <div className="d-flex gap-2">
                        <img src={logoImg} alt="#" height="32px" />
                        <h3 className="logo">E-Commerce</h3>
                    </div>
                </Link>
                <div className="collapse navbar-collapse me-md-4" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto d-flex gap-3">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                <i className="bi bi-house-door me-2"></i>Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/products" className="nav-link">
                                <i className="bi bi-bag me-2"></i>Products
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className="nav-link">
                                <i className="bi bi-info-circle me-2"></i>About Us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className="nav-link">
                                <i className="bi bi-telephone me-2"></i>Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>
                {btn}
            </div>
        </nav>
    )
}