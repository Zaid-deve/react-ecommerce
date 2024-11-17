<?php

require_once "./config.php";
require_once "./db.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect and sanitize the input
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $message = trim($data['message'] ?? '');

    // Basic validation checks
    if (empty($name) || empty($email) || empty($message)) {
        $resp['err'] = 'All fields are required.';
        output($resp);  // Use the existing output method to return the response
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $resp['err'] = 'Invalid email address.';
        output($resp);
    }

    // Prepare the SQL statement for inserting data into the contact_us table
    $stmt = $conn->prepare("INSERT INTO contact_us (name, email, message, created_at) VALUES (?, ?, ?, NOW())");

    if ($stmt) {
        // Bind the parameters and execute the query
        $res = $stmt->execute([$name, $email, $message]);

        if ($res) {
            $resp['success'] = true;
            $resp['err'] = 'Thank you for contacting us!';
        } else {
            $resp['err'] = 'Failed to submit your err. Please try again.';
        }
    } else {
        $resp['err'] = 'Failed to prepare database query.';
    }
} else {
    $resp['err'] = 'Invalid request method.';
}

output($resp);
