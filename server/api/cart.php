<?php

require_once "./config.php";
require_once "./db.php";
require_once "../jwt.php";
require_once "./functions.php";

if ($route == 'add_to_cart') {
    if (!$data['pid']) {
        output(['err' => 'invalid request !']);
    }
    handleAddToCart($conn, $data);
} else if ($route == 'get_cart') {
    handleGetCart($conn, $data);
}

function handleAddToCart($conn, $data)
{
    $reqData = veirfyRequestToken($data);
    $user = fetchUser('user_id', $reqData['user_key']);
    if ($user) {
        $stmt = $conn->prepare("INSERT INTO cart (pid, cuid) VALUES (?,?)");
        $stmt->execute([$data['pid'], $reqData['user_key']]);
        output([
            'success' => true
        ]);
    } else {
        output(['err' => 'Login Expired']);
    }
}

function handleGetCart($conn, $data)
{
    $reqData = veirfyRequestToken($data);
    $user = fetchUser('user_id', $reqData['user_key']);

    if ($user) {
        $stmt = $conn->prepare("SELECT DISTINCT pid, cid, cat FROM cart WHERE cuid = ?");
        $stmt->execute([$reqData['user_key']]);
        output(['success' => true, 'items' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } else {
        output(['err' => 'Login Expired']);
    }
}

output(['err' => 'Something went wrong !']);
