<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// ---------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------
$host         = 'localhost';
$dbname       = 'u142852309_auditleads';
$username     = 'u142852309_audituser';
$password     = '@Dusdus1';
$owner_email  = 'olufunke.adeyinka@secondactadvisory.co.uk';
$from_email   = 'noreply@secondactadvisory.co.uk';
$booking_url  = 'https://stan.store/OlufunkeAdeyinka/p/second-act-income-audit-review';
$brand_colour = '#7D2040';
$brand_name   = 'Second Act Advisory Studio';

// ---------------------------------------------------------------
// ARCHETYPE DATA
// ---------------------------------------------------------------
$archetypes = array(
    'consultant' => array(
        'title'   => 'The Expertise-to-Income Consultant',
        'tagline' => 'Your experience has a market. It just needs a structure.',
        'summary' => 'You have built real expertise over years, and other people need exactly what you know. The biggest opportunity for you is to clarify what you know, who needs it most, and how to package it into a simple paid engagement.',
        'paths'   => array('Strategy or advisory sessions', 'Done-with-you consulting packages', 'Paid discovery or diagnostic audits', 'Retainer-based advisory relationships'),
        'step'    => 'Write down the three most common problems people have brought to you in your career. That list is the beginning of your consulting offer.',
    ),
    'digitalProduct' => array(
        'title'   => 'The Digital Product Builder',
        'tagline' => 'What you know can be packaged, sold, and scaled.',
        'summary' => 'You have accumulated knowledge, frameworks, and practical guidance that others would pay to access. Digital products let you package your expertise once and sell it repeatedly.',
        'paths'   => array('Ebooks, guides, or practical workbooks', 'Templates, checklists, or resource packs', 'Mini-courses or self-study programmes', 'Prompt packs or AI-assisted learning tools'),
        'step'    => 'Choose one specific problem you have solved and outline a simple guide that shows someone else how to solve it. That is your first product.',
    ),
    'mentor' => array(
        'title'   => 'The Mentor or Guide',
        'tagline' => 'Your story and wisdom are exactly what someone else needs right now.',
        'summary' => 'You have lived something. You have navigated transitions, overcome challenges, and rebuilt yourself. That journey has given you a depth of insight that cannot be taught in a classroom.',
        'paths'   => array('One-to-one coaching or mentoring', 'Group coaching programmes or cohorts', 'Paid workshops or live training sessions', 'Community membership with facilitated support'),
        'step'    => 'Think about the single most significant transition you have navigated. Now ask: who is currently in the middle of that same challenge? That person is your client.',
    ),
    'aiService' => array(
        'title'   => 'The AI-Assisted Service Provider',
        'tagline' => 'You can deliver more, faster, with the right tools behind you.',
        'summary' => 'You are comfortable with digital tools, and that is a significant advantage right now. AI tools have created a real opportunity for skilled, organised, service-minded women to offer high-quality support to businesses.',
        'paths'   => array('AI-assisted content creation or copywriting services', 'Business support, admin, or operations management', 'Research, planning, or strategy support for small businesses', 'Customer communications or community management'),
        'step'    => 'List three tasks you currently do well. Then explore one AI tool that can help you do each of those tasks faster. That combination is your service offer.',
    ),
    'operator' => array(
        'title'   => 'The Behind-the-Scenes Operator',
        'tagline' => 'Your organisational skills are a premium asset in a chaotic world.',
        'summary' => 'Not everyone wants to be front and centre. Businesses and solopreneurs are constantly looking for skilled, reliable, organised people who can run operations, manage projects, and keep things moving.',
        'paths'   => array('Virtual operations or executive assistant services', 'Project management or programme coordination support', 'Research, data, or information management services', 'Business administration or systems support for solopreneurs'),
        'step'    => 'Write down the operational tasks you are known for being excellent at. Then ask: which type of business needs those things most? That is your client profile.',
    ),
    'starter' => array(
        'title'   => 'The Confidence and Clarity Starter',
        'tagline' => 'You have more to offer than you realise. Let us find the right direction.',
        'summary' => 'You are not starting from zero. What you need is a clear direction, a simple starting point, and the confidence to take the first step.',
        'paths'   => array('A simple first offer based on one clear skill', 'Paid advice or guided conversations with people you already help informally', 'A small digital product or guide that solves one specific problem', 'An exploratory conversation service to test your direction'),
        'step'    => 'Write down five things you know how to do that someone else has asked you for help with. That list is the beginning.',
    ),
);

// ---------------------------------------------------------------
// PARSE INCOMING JSON
// ---------------------------------------------------------------
$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit();
}

$lead        = isset($body['leadData'])    ? $body['leadData']    : array();
$scores      = isset($body['scores'])      ? $body['scores']      : array();
$primaryId   = isset($body['primaryId'])   ? $body['primaryId']   : 'starter';
$secondaryId = isset($body['secondaryId']) ? $body['secondaryId'] : '';
$firstName   = isset($lead['firstName'])   ? $lead['firstName']   : 'there';
$email       = isset($lead['email'])       ? $lead['email']       : '';
$ageRange    = isset($lead['ageRange'])    ? $lead['ageRange']    : '';
$season      = isset($lead['season'])      ? $lead['season']      : '';

$archetype = isset($archetypes[$primaryId])   ? $archetypes[$primaryId]   : $archetypes['starter'];
$secondary = isset($archetypes[$secondaryId]) ? $archetypes[$secondaryId] : null;

$exp  = isset($scores['expertise'])  ? intval($scores['expertise'])  : 0;
$read = isset($scores['readiness'])  ? intval($scores['readiness'])  : 0;
$dig  = isset($scores['digital'])    ? intval($scores['digital'])    : 0;
$tim  = isset($scores['time'])       ? intval($scores['time'])       : 0;
$vis  = isset($scores['visibility']) ? intval($scores['visibility']) : 0;

// ---------------------------------------------------------------
// SAVE TO DATABASE
// ---------------------------------------------------------------
try {
    $pdo = new PDO('mysql:host=' . $host . ';dbname=' . $dbname . ';charset=utf8mb4', $username, $password, array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ));

    $pdo->exec('CREATE TABLE IF NOT EXISTS audit_leads (
        id                  INT AUTO_INCREMENT PRIMARY KEY,
        first_name          VARCHAR(100),
        email               VARCHAR(255),
        age_range           VARCHAR(50),
        season              VARCHAR(100),
        primary_archetype   VARCHAR(50),
        secondary_archetype VARCHAR(50),
        score_expertise     INT,
        score_readiness     INT,
        score_digital       INT,
        score_time          INT,
        score_visibility    INT,
        completed_at        DATETIME,
        created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');

    $stmt = $pdo->prepare('INSERT INTO audit_leads
        (first_name, email, age_range, season, primary_archetype, secondary_archetype,
         score_expertise, score_readiness, score_digital, score_time, score_visibility, completed_at)
        VALUES
        (:fn, :em, :ar, :se, :pa, :sa, :ex, :re, :di, :ti, :vi, :ca)');

    $stmt->execute(array(
        ':fn' => $firstName,
        ':em' => $email,
        ':ar' => $ageRange,
        ':se' => $season,
        ':pa' => $primaryId,
        ':sa' => $secondaryId,
        ':ex' => $exp,
        ':re' => $read,
        ':di' => $dig,
        ':ti' => $tim,
        ':vi' => $vis,
        ':ca' => isset($body['completedAt']) ? $body['completedAt'] : date('Y-m-d H:i:s'),
    ));

    $newId = $pdo->lastInsertId();

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit();
}

// ---------------------------------------------------------------
// SEND EMAILS
// ---------------------------------------------------------------
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";

// --- Owner notification ---
$owner_subject = 'New Audit Completion: ' . $firstName . ' - ' . $archetype['title'];

$owner_body  = '<html><body style="font-family:Georgia,serif;background:#FAF7F4;margin:0;padding:20px;">';
$owner_body .= '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #E5DDD5;">';
$owner_body .= '<div style="background:' . $brand_colour . ';padding:28px;text-align:center;">';
$owner_body .= '<p style="color:#fff;margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">' . $brand_name . '</p>';
$owner_body .= '<h1 style="color:#fff;font-size:22px;margin:8px 0 0;">New Audit Completion</h1>';
$owner_body .= '</div>';
$owner_body .= '<div style="padding:28px;">';
$owner_body .= '<h2 style="color:#2C2C2C;font-size:17px;margin-top:0;">Lead Details</h2>';
$owner_body .= '<table style="width:100%;font-size:14px;border-collapse:collapse;">';
$owner_body .= '<tr><td style="padding:7px 0;color:#6B6B6B;width:130px;">Name</td><td style="padding:7px 0;color:#2C2C2C;font-weight:bold;">' . htmlspecialchars($firstName) . '</td></tr>';
$owner_body .= '<tr><td style="padding:7px 0;color:#6B6B6B;">Email</td><td style="padding:7px 0;"><a href="mailto:' . htmlspecialchars($email) . '" style="color:' . $brand_colour . ';">' . htmlspecialchars($email) . '</a></td></tr>';
$owner_body .= '<tr><td style="padding:7px 0;color:#6B6B6B;">Age Range</td><td style="padding:7px 0;color:#2C2C2C;">' . htmlspecialchars($ageRange) . '</td></tr>';
$owner_body .= '<tr><td style="padding:7px 0;color:#6B6B6B;">Life Season</td><td style="padding:7px 0;color:#2C2C2C;">' . htmlspecialchars($season) . '</td></tr>';
$owner_body .= '</table>';
$owner_body .= '<hr style="border:none;border-top:1px solid #E5DDD5;margin:20px 0;">';
$owner_body .= '<h2 style="color:#2C2C2C;font-size:17px;">Result</h2>';
$owner_body .= '<div style="background:#F3EDE6;border-radius:8px;padding:14px;margin-bottom:14px;">';
$owner_body .= '<p style="margin:0;font-size:11px;color:#6B6B6B;text-transform:uppercase;letter-spacing:1px;">Primary Archetype</p>';
$owner_body .= '<p style="margin:6px 0 0;font-size:16px;color:' . $brand_colour . ';font-weight:bold;">' . htmlspecialchars($archetype['title']) . '</p>';
$owner_body .= '<p style="margin:4px 0 0;font-size:13px;color:#6B6B6B;font-style:italic;">' . htmlspecialchars($archetype['tagline']) . '</p>';
$owner_body .= '</div>';

if ($secondary) {
    $owner_body .= '<div style="background:#FAF7F4;border-radius:8px;padding:12px;margin-bottom:14px;border:1px solid #E5DDD5;">';
    $owner_body .= '<p style="margin:0;font-size:11px;color:#6B6B6B;text-transform:uppercase;letter-spacing:1px;">Secondary Archetype</p>';
    $owner_body .= '<p style="margin:6px 0 0;font-size:14px;color:#2C2C2C;font-weight:bold;">' . htmlspecialchars($secondary['title']) . '</p>';
    $owner_body .= '</div>';
}

$owner_body .= '<h2 style="color:#2C2C2C;font-size:17px;">Scores</h2>';
$owner_body .= '<table style="width:100%;font-size:13px;border-collapse:collapse;">';
$owner_body .= '<tr style="background:#F3EDE6;"><td style="padding:7px 10px;">Expertise</td><td style="padding:7px 10px;color:' . $brand_colour . ';font-weight:bold;text-align:right;">' . $exp . '/100</td></tr>';
$owner_body .= '<tr><td style="padding:7px 10px;">Income Readiness</td><td style="padding:7px 10px;color:' . $brand_colour . ';font-weight:bold;text-align:right;">' . $read . '/100</td></tr>';
$owner_body .= '<tr style="background:#F3EDE6;"><td style="padding:7px 10px;">Digital Confidence</td><td style="padding:7px 10px;color:' . $brand_colour . ';font-weight:bold;text-align:right;">' . $dig . '/100</td></tr>';
$owner_body .= '<tr><td style="padding:7px 10px;">Time Capacity</td><td style="padding:7px 10px;color:' . $brand_colour . ';font-weight:bold;text-align:right;">' . $tim . '/100</td></tr>';
$owner_body .= '<tr style="background:#F3EDE6;"><td style="padding:7px 10px;">Visibility</td><td style="padding:7px 10px;color:' . $brand_colour . ';font-weight:bold;text-align:right;">' . $vis . '/100</td></tr>';
$owner_body .= '</table>';
$owner_body .= '<hr style="border:none;border-top:1px solid #E5DDD5;margin:22px 0;">';
$owner_body .= '<p style="text-align:center;"><a href="mailto:' . htmlspecialchars($email) . '" style="background:' . $brand_colour . ';color:#fff;padding:11px 26px;border-radius:50px;text-decoration:none;font-size:13px;font-family:Arial,sans-serif;">Reply to ' . htmlspecialchars($firstName) . '</a></p>';
$owner_body .= '</div>';
$owner_body .= '<div style="background:#F3EDE6;padding:14px;text-align:center;"><p style="margin:0;font-size:12px;color:#6B6B6B;">' . $brand_name . ' - secondactadvisory.co.uk</p></div>';
$owner_body .= '</div></body></html>';

$owner_headers  = $headers;
$owner_headers .= 'From: ' . $brand_name . ' <' . $from_email . '>' . "\r\n";
$owner_headers .= 'Reply-To: ' . $email . "\r\n";

mail($owner_email, $owner_subject, $owner_body, $owner_headers);

// --- Client results email ---
if (!empty($email)) {
    $paths_html = '';
    foreach ($archetype['paths'] as $path) {
        $paths_html .= '<li style="margin-bottom:6px;">&#9654;&nbsp; ' . htmlspecialchars($path) . '</li>';
    }

    $client_subject = 'Your Second Act Income Audit Results, ' . $firstName;

    $client_body  = '<html><body style="font-family:Georgia,serif;background:#FAF7F4;margin:0;padding:20px;">';
    $client_body .= '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #E5DDD5;">';
    $client_body .= '<div style="background:' . $brand_colour . ';padding:36px;text-align:center;">';
    $client_body .= '<p style="color:#fff;margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">' . $brand_name . '</p>';
    $client_body .= '<h1 style="color:#fff;font-size:24px;margin:0;line-height:1.3;">Your Income Audit Results</h1>';
    $client_body .= '</div>';
    $client_body .= '<div style="padding:32px;">';
    $client_body .= '<p style="color:#2C2C2C;font-size:16px;line-height:1.6;margin-top:0;">Dear ' . htmlspecialchars($firstName) . ',</p>';
    $client_body .= '<p style="color:#6B6B6B;font-size:14px;line-height:1.7;">Thank you for completing The Second Act Income Audit. Here is your personalised result to keep and refer back to.</p>';
    $client_body .= '<div style="background:' . $brand_colour . ';border-radius:10px;padding:22px;margin:22px 0;text-align:center;">';
    $client_body .= '<p style="color:rgba(255,255,255,0.7);margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Your Result</p>';
    $client_body .= '<h2 style="color:#fff;margin:0;font-size:20px;line-height:1.3;">' . htmlspecialchars($archetype['title']) . '</h2>';
    $client_body .= '<p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:13px;font-style:italic;">' . htmlspecialchars($archetype['tagline']) . '</p>';
    $client_body .= '</div>';
    $client_body .= '<p style="color:#2C2C2C;font-size:14px;line-height:1.8;">' . htmlspecialchars($archetype['summary']) . '</p>';
    $client_body .= '<div style="background:#F3EDE6;border-radius:10px;padding:22px;margin:22px 0;">';
    $client_body .= '<h3 style="color:' . $brand_colour . ';margin-top:0;font-size:15px;">Your Top Income Paths</h3>';
    $client_body .= '<ul style="color:#2C2C2C;font-size:13px;line-height:1.8;padding-left:0;list-style:none;margin:0;">' . $paths_html . '</ul>';
    $client_body .= '</div>';
    $client_body .= '<div style="border-left:4px solid ' . $brand_colour . ';padding:14px 18px;margin:22px 0;background:#FAF7F4;border-radius:0 8px 8px 0;">';
    $client_body .= '<p style="color:#6B6B6B;margin:0 0 5px;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">Your Suggested First Step</p>';
    $client_body .= '<p style="color:#2C2C2C;margin:0;font-size:14px;line-height:1.7;font-style:italic;">&ldquo;' . htmlspecialchars($archetype['step']) . '&rdquo;</p>';
    $client_body .= '</div>';
    $client_body .= '<hr style="border:none;border-top:1px solid #E5DDD5;margin:26px 0;">';
    $client_body .= '<div style="text-align:center;">';
    $client_body .= '<p style="color:#2C2C2C;font-size:15px;line-height:1.7;margin-bottom:5px;">Ready to turn this result into a real income direction?</p>';
    $client_body .= '<p style="color:#6B6B6B;font-size:13px;line-height:1.7;margin-bottom:22px;">Book your Personal Audit Review and we will walk through your result together.</p>';
    $client_body .= '<a href="' . $booking_url . '" style="background:' . $brand_colour . ';color:#fff;padding:13px 30px;border-radius:50px;text-decoration:none;font-size:14px;font-family:Arial,sans-serif;display:inline-block;">Book Your Personal Audit Review</a>';
    $client_body .= '</div>';
    $client_body .= '</div>';
    $client_body .= '<div style="background:#F3EDE6;padding:18px;text-align:center;">';
    $client_body .= '<p style="margin:0 0 3px;font-size:13px;color:#2C2C2C;font-weight:bold;">' . $brand_name . '</p>';
    $client_body .= '<p style="margin:0;font-size:12px;color:#6B6B6B;">secondactadvisory.co.uk</p>';
    $client_body .= '</div>';
    $client_body .= '</div></body></html>';

    $client_headers  = $headers;
    $client_headers .= 'From: ' . $brand_name . ' <' . $from_email . '>' . "\r\n";
    $client_headers .= 'Reply-To: ' . $owner_email . "\r\n";

    mail($email, $client_subject, $client_body, $client_headers);
}

// ---------------------------------------------------------------
// RETURN SUCCESS
// ---------------------------------------------------------------
echo json_encode(array('success' => true, 'id' => $newId));
