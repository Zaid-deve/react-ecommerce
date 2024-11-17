<?php
require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define('JWT_SECRET', 'ecomm.key.main.type2560');

/**
 * Generate a JWT for a user with a 24-hour expiration.
 *
 * @param mixed $userKey The user identifier or key.
 * @return string The generated JWT.
 */
function generateJwtToken($userKey)
{
    $issuedAt = time();
    $expirationTime = $issuedAt + (24 * 60 * 60);

    $payload = [
        'user_key' => $userKey,
        'iat' => $issuedAt,
        'exp' => $expirationTime,
    ];

    return JWT::encode($payload, JWT_SECRET, 'HS256');
}

/**
 * Decode a JWT to validate it and extract the payload.
 *
 * @param string $token The JWT token to decode.
 * @return mixed The decoded token or false if invalid.
 */
function validateJwtToken($token)
{
    try {
        $decoded = JWT::decode($token, new Key(JWT_SECRET,'HS256'));
        return (array) $decoded;
    } catch (Exception $e) {
        file_put_contents("err.log","JWT Decode Error: " . $e->getMessage() . "\n",FILE_APPEND);
        return false;
    }
}
