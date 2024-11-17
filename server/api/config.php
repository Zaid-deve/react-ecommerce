<?php

header('content-type:application/json');
$data = json_decode(file_get_contents("php://input"), true) ?? [];
$route = $data['route'] ?? $_POST['route'] ?? null;
$resp = [
    'success' => false,
    'err' => ''
];

function output($resp)
{
    if (isset($conn)) {
        $conn = null;
    }

    die(json_encode($resp));
}

$method = $_SERVER['REQUEST_METHOD'];
