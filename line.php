<?php
$phoneparams = json_decode(base64_decode($_REQUEST['ext']), true);
//Security Check
//to prevent URL hotlinks
//require_once 'check_function.php';
//security_check($phoneparams);
//End security

?><!DOCTYPE html>
<html lang="en">
<head>
    <title>Title</title>
    <meta charset="UTF-8">
    <meta name=description content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet" media="screen">

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/custom.css">
<!--    <link rel="shortcut icon" href="https://webrtc.freeswitch.org/verto/favicon.ico">-->
    <style>
        #screen {
            margin: 33px 8px 7px 8px !important;
            background: linear-gradient(#c9e1c0, #b5ccb6);
        }

        #screenbg {
            content: '';
            width: calc(100vw - 19px);
            height: 111px;
            position: absolute;
            top: 34px;
            left: 10px;
            background: linear-gradient(#E2E2E2, gray);
            z-index: -1;
        }

        body {
            padding: 0;
            overflow: hidden;
        }

        input {
            outline: none;
        }
    </style>
</head>
<body>
<div id="screenbg"></div>
<?php
require_once 'parts/screen.php';
require_once 'parts/incall.php';
require_once 'parts/online.php';
require_once 'parts/dialogs.php';
require_once 'parts/hideable.php';
require_once 'parts/config.php';
?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
</body>

<!--<script type="text/javascript" src="js/jquery.mobile.min.js"></script>-->
<script type="text/javascript" src="js/jquery.json-2.4.min.js"></script>
<script type="text/javascript" src="js/jquery.cookie.js"></script>
<!--<script type="text/javascript" src="js/jquery.dataTables.min.js"></script>-->
<script type="text/javascript" src="js/verto-min.js"></script>
<script type="text/javascript" src="js/new_verto.js"></script>
<script type="text/javascript" src="js/funciones.js"></script>
<?php
require_once 'parts/monitor.php';
?>
<script>
    var thisline = '<?=$phoneparams['line']?>';
    var holdtext = 'Hold';
    var resumetext = 'Resume';
    var $hold = $('#hold');
    var holdfn = {
        hold: function () {
            $hold.text(resumetext);
        },
        unhold: function () {
            $hold.text(holdtext);
        }
    };

    function definiteHold(fn) {
        var holdcheck = $hold.text();
        var callcheck = cur_call ? true : false;

        fn == 'hold' && callcheck == true && holdcheck != resumetext ? holdfn.hold() : false;
        fn == 'unhold' && callcheck == true && holdcheck != holdtext ? holdfn.unhold() : false;
        if (fn == 'toggle' && callcheck == true) {
            if ($hold.text() == holdtext) {
                phone.hold();
            } else {
                phone.unhold();
            }
        }

    }

    $('#hupbtn').on('click', function () {
        cur_call ? cur_call.hangup() : false;
    });

    function hangupandresetlines() {
        $('#hold').text('Hold');
        cur_call ? cur_call.hangup() : false;
    }


    function parentPost(fn, yayson) {
        parent.postMessage({fn: fn, yayson: yayson}, '*');
    }

    var phone = {
        dial: function (yayson) {
            $('#ext').val(yayson.number);
            $(callButton).click();
        },
        hold: function () {
            definiteHold('hold', 'this');
            parentPost('hold', {line: thisline});
            console.log('invoked hold, from child');
        },
        unhold: function () {
            definiteHold('unhold');
            parentPost('unhold', {line: thisline})
        },
        holdtoggle: function () {
            definiteHold('toggle');
        },
        focus: function () {
            parentPost('focus', {line: thisline});
        },
        status: function (_yayson) {
            parentPost('status', {line: thisline, info: _yayson});
        },
        active: function () {
        },
        transfer: function () {
            parentPost('transfer', {line: thisline})
        },
        threeway: function () {
            parentPost('threeway', {line: thisline})
        },
        conference: function () {
            parentPost('conference', {originExt: extension})
        },
        incoming: function (cid, cnam) {
            parentPost('incoming', {line: thisline, cid: cid, cnam: cnam})
        },
        closenotification(){
            parentPost('closenotification', {});
        }
    };

    addEventListener("message", listener, false);
    function listener(e) {
        phone[e.data.fn](e.data.yayson);
    }

    phone.status({thisstatus: 'HANGUP'});

</script>
</html>