import React from "react";
import './about.css';

export default function AboutUs() {
    return (
        <section className="about-us-container py-5">
            <div className="container">
                <h2 className="mb-4 logo">About Us</h2>
                <p className="lead">
                    Welcome to our eCommerce platform, your one-stop shop for the best products online. 
                    We pride ourselves on delivering quality, value, and convenience to our customers.
                </p>
                <div className="row mt-5">
                    <div className="col-md-4">
                        <div className="feature-box">
                            <span className="feature-icon display-1 mb-4" role="img" aria-label="Quality Products">✨</span>
                            <h5>Quality Products</h5>
                            <p>
                                We hand-pick every item to ensure it meets the highest standards of quality.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="feature-box">
                            <span className="feature-icon display-1 mb-4" role="img" aria-label="Great Value">💰</span>
                            <h5>Great Value</h5>
                            <p>
                                Our pricing is designed to offer you the best deals without compromise.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="feature-box">
                            <span className="feature-icon display-1 mb-4" role="img" aria-label="Customer Support">📞</span>
                            <h5>Customer Support</h5>
                            <p>
                                Our team is here 24/7 to help you with all your queries and concerns.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
