<?php

// Helper function for handling database exceptions
function handleDbException($e, $email)
{
    if (stripos($e->getMessage(), '1062') !== false) {
        output(['err' => 'User with ' . $email . ' already exists']);
    } else {
        output(['err' => 'Something went wrong']);
    }
}

function veirfyRequestToken($data)
{
    $authToken = $data['authToken'] ?? null;
    $userId = validateJwtToken($authToken);

    if (!$userId || time() > $userId['exp']) {
        output(['err' => 'Login expired']);
        return;
    }

    return $userId;
}

function fetchUser($t, $v)
{
    global $conn;
    $qry = "SELECT user_name as username, user_email as email, user_img as userimg, user_address address FROM users WHERE $t = ?";
    $stmt = $conn->prepare($qry);
    $stmt->execute([$v]);
    return $stmt->fetchAll();
}
