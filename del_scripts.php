<?php
/**
 * Created by PhpStorm.
 * User: mix
 * Date: 14.03.17
 * Time: 10:51
 */

require __DIR__ . "/init.php";

$btp = JsonRpc_BtpService::createByCluster('production', 5);

$service = 'rabbitmq_publish';


///{"prefix":"script","depth":1,"sep":"~~","ntype":"branch","offset":0,"limit":100000,"sortby":"","power":false}

$rr = [
    'prefix' => "script",
    'depth' => 1,
    'sep' => '~~',
    'ntype' => 'branch',
    'offset' => 0,
    'limit' => 100000,
    'sortby' => 'count',
];

$out = $btp->get_name_tree($rr)['branches'];


$i = 0;
foreach ($out as $script) {
    if(strpos($script, "delivery_api:DELETE/v2/courier/queue") === 0) {
        /*
        $i++;
        echo $op . "\n";

        die();
        if($i > 100){
            die();
        }
        */

        echo $script . "\n";

//{"prefix":"script~~delivery_api:DELETE/v2/courier/queue/1038807594","depth":1,"sep":"~~","ntype":"branch","offset":0,"limit":100000,"sortby":"","power":false}
        $rr = [
            'prefix' => "script~~$script",
            'depth' => 1,
            'sep' => '~~',
            'ntype' => 'branch',
            'offset' => 0,
            'limit' => 100000,
            'sortby' => 'count',
        ];

        $svs = $btp->get_name_tree($rr)['branches'];


        foreach ($svs as $service){

        }
        
        die();



        $rr = [
            "prefix" => "script~~$script",

            "sep" => "~~",
            "offset" => 0,
            "limit" => 10,
            "sortby" => "count"
        ];


        $names_ts = $btp->get_names($rr)['names_ts'];


        die();

        foreach($names_ts as $scriptDesc){
            $script = $scriptDesc['name'];
            echo $script . "\n";
            $btp->del($script);
        }

        $branch = "service~~$service~~$op";
        echo $branch . "\n";
        $btp->del($branch);
        //die();


        continue;

        echo "branch: $branch\n";
        $rr = [
            'prefix' => $branch,
            'depth' => 1,
            'sep' => '~~',
            'ntype' => 'leaf',
            'offset' => 0,
            'limit' => 100000,
            'sortby' => 'count',
        ];

        foreach ($btp->get_name_tree($rr)['branches'] as $lf) {
            $leaf = "$branch~~$lf";
            echo "del $leaf\n";
            $btp->del(['name' => $leaf]);
        }
        $btp->del(['name' => $br]);
    } else {
    }
}





echo $i;




