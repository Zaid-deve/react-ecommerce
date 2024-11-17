export default function Error({err}) {
    return (
        <div className="alert mt-3">
            <div className="d-flex flex-center flex-column gap-3">
                <i className="bi bi-exclamation-diamond display-3"></i>
                <span>{err}</span>
            </div>
        </div>
    )
}