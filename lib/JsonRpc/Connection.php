<?php

/**
 * Created by PhpStorm.
 * User: mix
 * Date: 14.03.17
 * Time: 16:45
 */
class JsonRpc_Connection
{
    protected $socket = null;

    protected $server = null;

    protected $failed = false;

    protected $id = 0;

    protected $onRecv = array();

    /**
     * @var callable
     */
    protected $onNotify = null;

    public function __construct($srv) {
        $this->server = $srv;
    }

    public function __destruct() {
        if ($this->socket) {
            fclose($this->socket);
        }
    }

    public function connect() {
        $timeout = 60;
        if ($this->socket) {
            return $this;
        }
        if ($this->failed) {
            return $this;
        }
        $this->socket = fsockopen($this->server['host'], $this->server['port'], $errno, $errstr, $timeout);
        $this->id = 1;
        $this->onRecv = array();
        if (!$this->socket) {
            $this->failed = true;
        } else {
            stream_set_timeout($this->socket, $timeout);
        }

        return $this;
    }

    protected function send($data) {
        global $debug;

        $bytes = json_encode($data) . "\r\n";

        if (!fwrite($this->socket, $bytes)) {
            $this->throwEx('fwrite failed');
        }
        if($debug) {
            echo ">> " . $bytes;
        }
    }

    public function notify($method, $params) {
        if ($this->connect()->failed) {
            return $this;
        }
        $data = array('jsonrpc' => '2.0', 'method' => $method, 'params' => $params);
        $this->send($data);

        return $this;
    }

    public function failed() {
        return $this->failed;
    }

    public function requestCallback($method, array $params, $onRecv) {
        if ($this->connect()->failed) {
            return $this;
        }
        $id = $this->id++;
        $this->onRecv[$id] = $onRecv;
        $data = array('jsonrpc' => '2.0', 'method' => $method, 'id' => $id, 'params' => $params);
        $this->send($data);

        return $this;
    }

    public function newId(){
        return $this->id++;
    }

    /**
     * @param $method
     * @param $params
     * @return JsonRpc_Future
     */
    public function request($method, $params) {
        //fclose($fp);
        $F = new JsonRpc_Future();
        $F->func = array($this, 'process');
        $this->requestCallback($method, $params, array($F, 'onReady'));

        return $F;
    }

    public function sync (array $data){
        $this->connect()->send($data);
        return $this->connect()->recv();
    }

    protected function throwEx($data) {
        @fclose($this->socket);
        $this->socket = null;
        throw new Exception(print_r($data, true));
    }

    public function registerOnNotifyCallback(callable $callback) {
        $this->onNotify = $callback;
    }

    protected function recv(){
        global $debug;
        $data = fgets($this->socket);
        if (!$data) {
            $this->throwEx('no data recieved');
        }
        //echo $data."\n";

        /**
         * Из за того что из сервера BTP шла всякая бяка в виде символов x01, все падало...
         */
//        $data = utf8_encode($data);
        if($debug) {
            echo "<< " . $data;
        }
        $data = json_decode(
            $data, //      self::cleanJsonString($data),
            true
        );
        return $data;
    }

    public function process($force = false) {

        if ($this->connect()->failed) {
            return array();
        }
        $result = array();
        while ($force || count($this->onRecv) > 0) {

            $data = $this->recv();

            if (isset($data['error'])) {
                $this->throwEx($data['error']);
            }
            if (!isset($data['id'])) {
                if ($this->onNotify) {
                    $f = $this->onNotify;
                    $f($data['method'], $data['params']);
                    continue;
                }
                //error_log("resp:".print_R($data),1);
                //$this->throwEx('id not found');
            }
            //if (!isset($this->onRecv[$data['id']])) $this->throwEx('invalid data recieved');

            call_user_func($this->onRecv[$data['id']], $data['result'], $data['id']);
            unset($this->onRecv[$data['id']]);
        }

        return $this;
    }

    /**
     * А вот нехер совать чо попало в JSON
     */
    public static function cleanJsonString($s) {
        return preg_replace("~[^a-z\d_\-\[\]\.\{\}а-яёЁА-Я:=\(\)'\",.;]~is", '', $s);
    }
}