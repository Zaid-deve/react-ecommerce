<?php

require_once "./config.php";
require_once "./db.php";
require_once "../jwt.php";
require_once "./functions.php";

if ($route == 'place_order') {
    if (!$data['pid']) {
        output(['err' => 'invalid request !']);
    }
    handlePlaceOrder($conn, $data);
} else if ($route == 'get_order' || $route == 'get_orders') {
    handleGetOrder($conn, $data, $route == 'get_order');
} else if ($route == 'cancel_order') {
    handleCancelOrder($conn, $data);
}

function handlePlaceOrder($conn, $data)
{
    $reqData = veirfyRequestToken($data);
    $user = fetchUser('user_id', $reqData['user_key']);

    if ($user) {
        if (!$data['username'] || !$data['address']) {
            output(['err' => 'SHIPPING_DETAILS_REQUIRED']);
        }

        $stmt = $conn->prepare("INSERT INTO orders(ouid, opid,oprice,oqty,oaddress) VALUES (?,?,?,?,?)");
        $res = $stmt->execute([
            $reqData['user_key'],
            $data['pid'],
            $data['total'],
            $data['qty'],
            $data['address']
        ]);

        if ($res) {
            $resp['success'] = true;
            $resp['order_id'] = $conn->lastInsertId();
            output($resp);
            return;
        }
    }

    $resp['err'] = 'Login Expired';
    output($resp);
}

function handleGetOrder($conn, $data, $fetchOne = false)
{
    $reqData = veirfyRequestToken($data);
    $user = fetchUser('user_id', $reqData['user_key']);
    if ($user) {
        $query = "SELECT * FROM orders WHERE ouid = ?";
        if ($fetchOne) {
            $query .= " LIMIT 1";
        }

        $stmt = $conn->prepare($query);
        $stmt->execute([$reqData['user_key']]);

        $resp['success'] = true;
        $resp['orders'] = $fetchOne ? $stmt->fetch(PDO::FETCH_ASSOC) : $stmt->fetchAll(PDO::FETCH_ASSOC);
        output($resp);
    }

    $resp['err'] = 'Login Expired';
    output($resp);
}

function handleCancelOrder($conn, $data)
{
    $reqData = veirfyRequestToken($data);
    $user = fetchUser('user_id', $reqData['user_key']);
    if ($user) {
        $stmt = $conn->prepare("DELETE FROM orders WHERE oid = ?");
        $res = $stmt->execute([$data['orderId']]);

        if ($res) {
            $resp['success'] = true;
            $resp['message'] = 'Order cancelled successfully';
        } else {
            $resp['err'] = 'Failed to cancel the order';
        }
        output($resp);
    }

    $resp['err'] = 'Login Expired';
    output($resp);
}


output(['err' => 'Something went wrong !']);
