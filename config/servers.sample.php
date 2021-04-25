<?php
/**
 * Created by PhpStorm.
 * User: mix
 * Date: 14.03.17
 * Time: 16:30
 */

$host= 'btpd';

return [
    'production' => [
        '5' => [['host' => $host, 'port' => 36000]],
        '60' => [['host' => $host, 'port' => 36001]],
        '420' => [['host' => $host, 'port' => 36004]],
        '3600' => [['host' => $host, 'port' => 36002]],
        '86400' => [['host' => $host, 'port' => 36003]],
    ],
];

