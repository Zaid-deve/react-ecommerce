<?php

require_once "./config.php";
require_once "./db.php";
require_once "../jwt.php";  // JWT functions
require_once "./functions.php";

// Main route handler
if ($method === 'POST') {

    switch ($route) {
        case 'authenticate':
            handleAuthenticate($data);
            break;
        case 'signup':
            handleSignup($data);
            break;
        case 'login':
            handleLogin($data);
            break;
        case 'update':
            handleUpdate($_POST);
            break;
        default:
            output(['err' => 'Invalid route']);
    }
} else {
    output(['err' => 'Invalid request method']);
}

// Signup handler
function handleSignup($data)
{
    global $conn;

    $username = htmlentities($data['username'] ?? '');
    $email = htmlentities($data['email'] ?? '');
    $password = htmlentities($data['password'] ?? '');

    if (empty($username) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
        output(['err' => 'All fields are required and email must be valid']);
        return;
    }

    $qry = 'INSERT INTO users (user_email, user_pass, user_name) VALUES (?, ?, ?)';
    try {
        $stmt = $conn->prepare($qry);
        $stmt->execute([$email, $password, $username]);
        $userId = $conn->lastInsertId();
        $token = generateJwtToken($userId);
        output(['success' => true, 'authToken' => $token]);
    } catch (Exception $e) {
        handleDbException($e, $email);
    }
}

// Login handler
function handleLogin($data)
{
    global $conn;

    $email = htmlentities($data['email'] ?? '');
    $password = htmlentities($data['password'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
        output(['err' => 'Email or password is invalid']);
        return;
    }

    $qry = 'SELECT user_id FROM users WHERE user_email = ? AND user_pass = ?';
    try {
        $stmt = $conn->prepare($qry);
        $stmt->execute([$email, $password]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $token = generateJwtToken($user['user_id']);
            output(['success' => true, 'authToken' => $token]);
        } else {
            output(['err' => 'No user found']);
        }
    } catch (Exception $e) {
        output(['err' => 'Something went wrong']);
    }
}

function handleUpdate($data)
{
    global $conn, $resp;
    $reqData = veirfyRequestToken($data);
    $user = fetchUser('user_id', $reqData['user_key']);
    if ($user) {

        // handle profile update
        if (isset($_FILES['img'])) {
            $img = $_FILES['img'];
            $uploadPath = 'http://localhost/ecommerce/api/profiles/' . basename($img['name']);
        }

        $qry = "UPDATE users SET user_name = ?, user_img = ?,user_address = ? WHERE user_id = ?";
        $stmt = $conn->prepare($qry);
        $res = $stmt->execute([
            $data['username'] ?? $user['username'],
            isset($uploadPath) ? $uploadPath : $user['userimg'] ?? '',
            $data['address'] ?? $user['address'],
            $reqData['user_key']
        ]);

        $resp['success'] = $res;
        if($resp['success']){
            if(isset($img)){
                move_uploaded_file($img['tmp_name'], "C:/xampp/htdocs/ecommerce/api/profiles/" . $img['name']);
            }
        }

        $resp['err'] = $res ? '' : 'Failed to update profile !';
        output($resp);
    }

    $resp['err'] = 'Failed to update profile !';
    output($resp);
}

function handleAuthenticate($data)
{
    $payload = veirfyRequestToken($data);
    $user_id = $payload['user_key'] ?? null;
    $user = fetchUser('user_id', $user_id);
    if ($user) {
        output(['success' => true, 'details' => $user]);
        return;
    }

    output(['err' => 'Login Expired']);
}