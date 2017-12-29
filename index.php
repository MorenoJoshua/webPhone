<?php
$folder = '';
$phoneparams = json_decode(base64_decode(urldecode($_REQUEST['ext'])), true);

//Security Check
//to prevent URL hotlinks
//require_once 'other/check_function.php';
//End security

$line1params = $phoneparams;
$line1params['line'] = '1';
$line1 = urlencode(base64_encode(json_encode($line1params)));

$line2params = $phoneparams;
$line2params['line'] = '2';
$line2params['ext'] = '999' . $line2params['ext'];
$line2 = urlencode(base64_encode(json_encode($line2params)));

$line3params = $phoneparams;
$line3params['line'] = '3';
$line3params['ext'] = '888' . $line3params['ext'];
$line3 = urlencode(base64_encode(json_encode($line3params)));

$host = (substr($_SERVER['HTTP_HOST'], (strlen(strtok($_SERVER['HTTP_HOST'], '.')) + 1)));

$line1url = 'https://line1.' . $host;
$line2url = 'https://line2.' . $host;
$line3url = 'https://line3.' . $host;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Webphone</title>
    <meta charset="UTF-8">
    <meta name=description content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="css/style.css" rel="stylesheet" media="screen">
</head>
<body>
<div id="linesbg"></div>
<table class="table">
    <tr id="lines">
        <td class="" id="line1btn" onclick="phone.focus({line: 1})">Line 1</td>
        <td class="" id="line2btn" onclick="phone.focus({line: 2})">Line 2</td>
        <td class="" id="line3btn" onclick="phone.focus({line: 3})">Line 3</td>
    </tr>
    <tr id="phone">
        <td id="line1" colspan="3">
            <iframe src="<?= $line1url ?>/line.php?ext=<?= $line1 ?>"></iframe>
        </td>
        <td id="line2" colspan="3">
            <iframe src="<?= $line2url ?>/line.php?ext=<?= $line2 ?>"></iframe>
        </td>
        <td id="line3" colspan="3">
            <iframe src="<?= $line3url ?>/line.php?ext=<?= $line3 ?>"></iframe>
        </td>
    </tr>
</table>
<?php require 'parts/modals_container.php'; ?>
<script src="https://wrtc.crdff.net:3000/socket.io/socket.io.js">
</script>
<script>
    var socket = io('https://wrtc.crdff.net:3000', {port: 3000, secure: true});
    socket.on('connect', function (msg) {
        socket.emit('join', 'callflow')
    });
    socket.emit('join', "<?=$phoneparams['cid']?>");

    socket.on('command', function (msg) {
        msg["function"] == "dial" ? phone.dial({number: msg["command"]}) : false;
    })
</script>
</body>
<script src="<?= $line1url ?>/js/jquery-2.1.1.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script src="<?= $line1url ?>/js/index.js"></script>
<script src="/js/notifications.js"></script>
</html>