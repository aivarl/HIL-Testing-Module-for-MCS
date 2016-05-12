<?php

switch ($_REQUEST['action']) {
    case 'write':
        $data = $_REQUEST['data'];
        $decodeData = json_decode($data,true);
        $dataCount = count($decodeData, COUNT_RECURSIVE);
        if($dataCount >= 814) {
        $fh = fopen("data_out.json", 'w')
            or die("Error opening output file");
        fwrite($fh, json_encode($data,256));
        fclose($fh);
        }
        else{
        error_log("Data incorrect, not saving.");
        }
        break;
    case 'read':
        echo file_get_contents("data_out.json");
        break;
}

?>