<?php

require __DIR__ . "/../init.php";

$out = "";

$cluster = 'production';
$scale = 60;

if(isset($_GET['scale'])){
    $scale = (int)$_GET['scale'];
}

$btp = JsonRpc_BtpService::createByCluster($cluster, $scale);

$names = [];

if (isset($_GET['name'])) {
    $names[] = $_GET['name'];
}

if (isset($_GET['names']) && is_array($_GET['names'])) {
    $names = array_merge($names, $_GET['names']);
}


if (isset($_GET['prefix'])) {
    $prefix = $_GET['prefix'];

    $data = $btp->get_name_tree([
        "prefix" => $prefix,
        "depth" => 1,
        "sep" => "~~",
        "ntype" => "leaf",
        "offset" => 0,
        "limit" => 100000,
        "sortby" => "count",
        "power" => false
    ]);
    foreach ($data['branches'] as $br){
        $names[] = $prefix . "~~" . $br;
    }
}

$data = $btp->multi_get([
    'names' => $names,
    "sep" => "~~",
    "ts" => 0,
    "offset" => 2995,
    "limit" => 5,
    "power" => false
]);

$params = ['avg', 'cnt', 'perc50', 'perc80', 'perc95', 'perc100', 'min', 'max'];


foreach ($data['data'] as $row) {
    $name = $row['name'];
    $rr = array_pop($row['counters']);
    $time = array_shift($rr);
    foreach ($params as $i => $param) {
        echo "$name{val=$param} " . $rr[$i] . "\n";
    }


}