<?php
header('Content-Type: application/json');

$host     = 'localhost';
$dbname   = 'u142852309_auditleads';
$username = 'u142852309_audituser';
$password = '@Dusdus1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    echo json_encode(['status' => 'Connected successfully!', 'host' => $host]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'FAILED', 'error' => $e->getMessage()]);
}
