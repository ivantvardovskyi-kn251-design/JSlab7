<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

function respond($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function toObject($row)
{
    $data = json_decode($row["data"], true) ?? [];
    return array_merge(["id" => (int)$row["id"]], $data);
}

function readBody()
{
    $data = json_decode(file_get_contents("php://input"), true);
    if (!is_array($data)) {
        return [];
    }
    unset($data["id"]);
    return $data;
}

try {
    $pdo = new PDO("mysql:host=localhost;charset=utf8mb4", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS js_labs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE js_labs");
    $pdo->exec("CREATE TABLE IF NOT EXISTS entities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        entity_type VARCHAR(100) NOT NULL,
        data LONGTEXT NOT NULL,
        INDEX (entity_type)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    $type = $_GET["type"] ?? "";
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;

    if ($type === "") {
        respond(400, ["error" => "Параметр type обов'язковий"]);
    }

    $find = function ($id) use ($pdo, $type) {
        $stmt = $pdo->prepare("SELECT * FROM entities WHERE entity_type = ? AND id = ?");
        $stmt->execute([$type, $id]);
        return $stmt->fetch();
    };

    switch ($_SERVER["REQUEST_METHOD"]) {
        case "GET":
            if ($id === null) {
                $stmt = $pdo->prepare("SELECT * FROM entities WHERE entity_type = ? ORDER BY id");
                $stmt->execute([$type]);
                respond(200, array_map("toObject", $stmt->fetchAll()));
            }
            $row = $find($id);
            if (!$row) {
                respond(404, ["error" => "Запис не знайдено"]);
            }
            respond(200, toObject($row));

        case "POST":
            $data = readBody();
            $stmt = $pdo->prepare("INSERT INTO entities (entity_type, data) VALUES (?, ?)");
            $stmt->execute([$type, json_encode($data, JSON_UNESCAPED_UNICODE)]);
            respond(201, array_merge(["id" => (int)$pdo->lastInsertId()], $data));

        case "PATCH":
            $row = $find($id);
            if (!$row) {
                respond(404, ["error" => "Запис не знайдено"]);
            }
            $data = array_merge(json_decode($row["data"], true) ?? [], readBody());
            $stmt = $pdo->prepare("UPDATE entities SET data = ? WHERE id = ?");
            $stmt->execute([json_encode($data, JSON_UNESCAPED_UNICODE), $id]);
            respond(200, array_merge(["id" => $id], $data));

        case "DELETE":
            $row = $find($id);
            if (!$row) {
                respond(404, ["error" => "Запис не знайдено"]);
            }
            $stmt = $pdo->prepare("DELETE FROM entities WHERE id = ?");
            $stmt->execute([$id]);
            respond(200, ["deleted" => true, "id" => $id]);

        default:
            respond(405, ["error" => "Метод не підтримується"]);
    }
} catch (PDOException $e) {
    respond(500, ["error" => "Помилка бази даних: " . $e->getMessage()]);
}
