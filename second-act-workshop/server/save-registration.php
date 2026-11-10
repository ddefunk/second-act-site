<?php
// Saves workshop registrations and waitlist sign-ups.
// Upload with workshop-config.php to the same Hostinger folder as save-lead.php.

date_default_timezone_set('Europe/London');
$config = require __DIR__ . '/workshop-config.php';

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $config['allowed_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(array('error' => 'Method not allowed')); exit(); }

$data = json_decode(file_get_contents('php://input'), true);
$first = trim(isset($data['firstName']) ? $data['firstName'] : '');
$email = trim(isset($data['email']) ? $data['email'] : '');
$slug  = preg_replace('/[^a-z0-9-]/', '', isset($data['workshopSlug']) ? $data['workshopSlug'] : '');
$title = substr(trim(isset($data['workshopTitle']) ? $data['workshopTitle'] : ''), 0, 200);
$waitlist = !empty($data['waitlist']);
$consent  = !empty($data['marketingConsent']);
$source   = substr(isset($data['source']) ? $data['source'] : '', 0, 100);
$startsAt = isset($data['startsAt']) && $data['startsAt'] ? date('Y-m-d H:i:s', strtotime($data['startsAt'])) : null;

if ($first === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $slug === '') {
    http_response_code(422);
    echo json_encode(array('error' => 'Please provide a first name, a valid email and a workshop.'));
    exit();
}
$first = substr($first, 0, 100);

try {
    $pdo = new PDO(
        'mysql:host=' . $config['db_host'] . ';dbname=' . $config['db_name'] . ';charset=utf8mb4',
        $config['db_user'], $config['db_pass'],
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
    );

    $pdo->exec("CREATE TABLE IF NOT EXISTS workshop_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        workshop_slug VARCHAR(100) NOT NULL,
        workshop_title VARCHAR(200),
        starts_at DATETIME NULL,
        first_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        waitlist TINYINT(1) NOT NULL DEFAULT 0,
        marketing_consent TINYINT(1) NOT NULL DEFAULT 0,
        source VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY one_per_event (workshop_slug, starts_at, email)
    ) CHARACTER SET utf8mb4");

    // A repeat sign-up for the same session updates the existing row instead of duplicating it.
    $stmt = $pdo->prepare("INSERT INTO workshop_registrations
        (workshop_slug, workshop_title, starts_at, first_name, email, waitlist, marketing_consent, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE first_name = VALUES(first_name), marketing_consent = VALUES(marketing_consent)");
    $stmt->execute(array($slug, $title, $startsAt, $first, $email, $waitlist ? 1 : 0, $consent ? 1 : 0, $source));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Could not save registration.'));
    exit();
}

// ---- Emails ----
$brand  = $config['brand_name'];
$colour = $config['brand_colour'];
$headers = "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: $brand <{$config['from_email']}>\r\nReply-To: {$config['owner_email']}\r\n";
$safeFirst = htmlspecialchars($first, ENT_QUOTES);
$safeTitle = htmlspecialchars($title, ENT_QUOTES);

if ($waitlist) {
    $subject = "You're on the list: $title";
    $body = "<p>Hi $safeFirst,</p><p>Thank you for joining the waitlist for <strong>$safeTitle</strong>. I'll email you as soon as the next date is confirmed.</p><p>Funke<br>$brand</p>";
} else {
    $when = $startsAt ? date('l j F Y, g:ia', strtotime($data['startsAt'])) : '';
    $join = isset($config['join_links'][$slug]) ? $config['join_links'][$slug] : '';
    $joinHtml = $join
        ? "<p><a href=\"" . htmlspecialchars($join, ENT_QUOTES) . "\" style=\"background:$colour;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;display:inline-block\">Join the workshop</a></p><p>Save this email so you can find the link on the day.</p>"
        : "<p>I'll send your joining link before the session.</p>";
    $subject = "Your place is saved: $title";
    $body = "<p>Hi $safeFirst,</p><p>Your place at <strong>$safeTitle</strong> is confirmed.</p>"
          . ($when ? "<p><strong>When:</strong> $when (UK time)</p>" : '')
          . $joinHtml
          . "<p>Bring a notebook. We'll be working, not just listening.</p><p>Funke<br>$brand</p>";
}
@mail($email, $subject, $body, $headers);

$ownerBody = "<p>New " . ($waitlist ? 'waitlist sign-up' : 'registration') . " for <strong>$safeTitle</strong></p>"
           . "<p>$safeFirst &lt;" . htmlspecialchars($email, ENT_QUOTES) . "&gt;<br>Newsletter: " . ($consent ? 'yes' : 'no') . "<br>Source: " . htmlspecialchars($source, ENT_QUOTES) . "</p>";
@mail($config['owner_email'], ($waitlist ? 'Waitlist: ' : 'Registration: ') . $title, $ownerBody, $headers);

echo json_encode(array('ok' => true));
