<?php
function security_check($phoneparams = array())
{
    $now = abs(time() - $phoneparams['t']);
    isset($phoneparams['t']) ?: die();
    $now < (60 * 5) ?: die('Please Refresh the CRM'); // despues de 5 mins url es invalida
    md5($phoneparams['did'] . $phoneparams['cid'] . $phoneparams['t']) == $phoneparams['check'] ?: die();
}
security_check($phoneparams);
