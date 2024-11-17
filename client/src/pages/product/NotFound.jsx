import { useNavigate } from "react-router-dom"

export default function NotFound({ err }) {
    const navigate = useNavigate();

    return (
        <div className="container text-center pt-5">

            <div className="mt-3 alert alert-danger border-0">
                <h1 className="display-2 fw-bolder logo">Product Not Found</h1>
                {err && err}
            </div>
            <h3 className="mt-3">Sorry the product you are looking, <br /> was not available or has been removed !</h3>
            <button onClick={() => navigate(-1)} className="btn btn-outline-dark has-icon rounded-5 mx-auto px-4 py-3 mt-3"><i className="bi bi-arrow-left"></i><span>Go back</span></button>
        </div>
    )
}