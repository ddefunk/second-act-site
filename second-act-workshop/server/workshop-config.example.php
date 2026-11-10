<?php
// Copy this file to workshop-config.php, fill it in, and upload it to Hostinger
// next to save-registration.php. Never commit the filled-in copy to git.

return array(
    'db_host'     => 'localhost',
    'db_name'     => 'u142852309_auditleads',   // can reuse the audit database
    'db_user'     => 'u142852309_audituser',
    'db_pass'     => 'CHANGE_ME',

    'owner_email' => 'olufunke.adeyinka@secondactadvisory.co.uk',
    'from_email'  => 'noreply@secondactadvisory.co.uk',
    'brand_name'  => 'Second Act Advisory',
    'brand_colour'=> '#7D2040',

    // Only these sites may submit the form.
    'allowed_origins' => array(
        'https://workshop.secondactadvisory.co.uk',
        'http://localhost:5173',
    ),

    // Joining links per workshop slug. Sent in the confirmation email only,
    // so the Zoom link never appears on the public page.
    'join_links' => array(
        'from-experience-to-income'   => '',
        'shape-your-first-offer'      => '',
        'your-second-act-income-plan' => '',
    ),
);
