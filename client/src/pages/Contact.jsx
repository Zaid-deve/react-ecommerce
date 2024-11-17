import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const { isLogin, userDetails } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (isLogin && Object.keys(userDetails).length) {
            setFormData((p) => {
                return { ...p, ...userDetails, name: userDetails?.username }
            })
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/contact.php", formData);
            if (response.status === 200) {
                setSuccessMessage("Thank you for contacting us!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setSuccessMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            setSuccessMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container bg-white p-md-5 p-3 m-4 mx-auto rounded-5">
            <h2 className="mb-4 logo">Contact Us</h2>
            <p className="lead">
                Have questions or feedback? We’d love to hear from you! Fill out the form below, and we’ll get back to you as soon as possible.
            </p>
            {successMessage && (
                <div className={`alert ${successMessage == 'Thank you for contacting us!' ? 'alert-success' : 'alert-danger'} ms-3 mb-0`}>
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        <i className="bi bi-person-fill me-2"></i>Name
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        <i className="bi bi-envelope-fill me-2"></i>Email
                    </label>
                    <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                        <i className="bi bi-chat-dots-fill me-2"></i>Message
                    </label>
                    <textarea
                        className="form-control form-control-lg"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here"
                        required
                    ></textarea>
                </div>
                <div className="d-flex align-items-center">
                    <button
                        type="submit"
                        className="btn btn-dark ms-auto px-5 rounded-5"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                Sending...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
