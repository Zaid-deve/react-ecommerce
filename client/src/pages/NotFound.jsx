import { Link, useNavigate } from "react-router-dom";

export default function NotFound(msg) {
    const navigate = useNavigate();

    return (
        <div className="text-center pt-5">
            <h1 className="display-1 fw-bolder logo">404</h1>
            <h3 className="mt-3">Sorry the page you are looking, <br /> was not found or is under maintainence !</h3>
            <button onClick={() => navigate(-1)} className="btn btn-outline-dark has-icon rounded-5 mx-auto px-4 py-3 mt-3"><i className="bi bi-arrow-left"></i><span>Go back</span></button>
        </div>
    )
}