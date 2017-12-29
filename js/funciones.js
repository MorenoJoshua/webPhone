$('button').on('click', function (e) {
    var dtmf = $(this).attr('dtmf');
    //console.log(dtmf);
    if (dtmf) {
        $(ext).val($(ext).val() + dtmf);
    }
});

function t_Hold() {
    cur_call ? cur_call.toggleHold() : false;
}

function checkLines(e) {
    var ext = e.data.channelPresenceID;
    ext = ext.substr(0, ext.indexOf('@'));

//        console.info(e.data.channelCallState, e);
    var chState = e.data.channelCallState;
    var extEvent = e.eventChannel.substr(9, e.eventChannel.length - 24);

    var masterExt = extEvent.substr(0, 4);

    var extreplaced = ext.replace(/(999|888)/g, '');
    if (ext != extreplaced) {
        //do something here
    }
    //console.log(ext + ' => ' + extreplaced);

    _spy(extreplaced, ext);

    if (extension == ext) {

        phone.status({thisstatus: chState, uuid: e.data.channelUUID});

        var line;
        if (extEvent === extension) line = extension;
        var lineId = '#line' + line;
        //console.log('Lineid:', lineId); //---
        //console.warn(chState, e); //---

        if (chState === 'RINGING') {
            calleridNumber != e.data.callerIDNumber ? $('#ext').val(e.data.callerIDNumber) : false; // actualiza display en llamadas entrantes solo
            console.info('Incoming call from ' + e.data.callerIDNumber + ' on line ' + line + ':', e);
            var uriComponent = '' + e.data.callerIDNumber;
            console.log(uriComponent);
            updateFunctions(uriComponent);
            blinkRing(lineId);

            phone.focus();
            e.data.calleeIDName != 'Outbound Call' ? phone.incoming(e.data.callerIDNumber, e.data.callerIDName) : false;

        }

        if (chState === 'EARLY') {
            // When ringing
        }

        if (chState === 'ACTIVE') {
            startTimer();
            resetClassLines(lineId);
            blinkAnswered(lineId);
            parentPost('answered', {line: thisline});
        }

        if (chState === 'HELD') {
            parentPost('hold', {line: thisline});
            resetClassLines(lineId);
        }

        if (chState === 'DESTROY') {
            stopTimer();
            hangupandresetlines();
            $(lineId).attr('class', 'col-xs-4 btn btn-primary');
            phone.closeNotification();
        }

        if (chState === 'HANGUP') {
            stopTimer();
            screenText("Call ended.");
            resetClassLines(lineId);
            hangupandresetlines();
            showSection(online);
            console.log('showing online section');

        }
    }
}

function updateFunctions(masterNumber) {
    $('#hold').attr('onclick', 'phone.holdtoggle()');
    /*//$('#vmbtn').attr('onclick', 'autoVM("' + encodeURIComponent(masterNumber) + '")');*/
    $('#hupbtn').attr('onclick', 'hangUpTest("' + encodeURIComponent(masterNumber) + '")');
}

// Keys to dtmf, others
$(document).on('keydown', function (event) { // jquery hijacks ESC key
    if (event.keyCode == 27) {
        console.log('Cleared');
        $(ext).val('');
    }
});
$(document).keypress(function (event) {
    event.preventDefault();
    var key = String.fromCharCode(event.keyCode);
    var i = parseInt(key);
    if (event.keyCode == 13) {
        $(callButton).click();
    }
    if (key === "#" || key === "*" || key === "0" || (i > 0 && i <= 9)) {
        $(ext).val($(ext).val() + key);
        if (!(cur_call)) return;
        cur_call.dtmf(key);
    }
});


function clearTimer() {
    mins = 0;
    secs = 0;
}

timerRunning = '0';

function startTimer() {
    if (timerRunning === '0') {
        clearTimer();
        callTimer = setInterval(timerTick, 1000);
        timerRunning = 1;
    } else {
    }
}

function timerTick() {
    secs++;
    if (secs === 60) {
        secs = 0;
        mins++;
    }
    toDisplaymins = '';
    if (mins > 0) {
        toDisplaymins = mins + 'm ';
    }
    $(timerDisplay).val(toDisplaymins + secs + 's');
}

function stopTimer() {
    typeof(callTimer) != 'undefined' ? clearInterval(callTimer) : false;
    clearTimer();
    timerRunning = '0';
}

function resetClassLines(lineId) {
    parentPost('unhold', {line: thisline})
}

function blinkRing(lineId) {
    $(lineId).addClass('blink_fast');
}

function blinkAnswered(lineId) {
    $(lineId).addClass('blink_slow');
}

//Freeswitch api
var esl = 'https://wrtc.crdff.net/api/api.php';

function autoVM(fileToPlay, thisExt) {
    var topost = 'command=autovm&ext=' + thisExt + '&file=' + fileToPlay;
    $.post(esl, topost)
}

function hangUpTest(extToHangup) {
    var topost = 'command=hangup&ext=' + extToHangup;
    $.post(esl, topost)
}

//function core_dohold(extToToggle) {
//    var helement = $('#hold');
//    var topost = 'command=hold&ext=' + extToToggle;
//    parentPost('hold', {line: thisline});
//    helement.text('Resume');
//    $.post(esl, topost);
//}

//function core_dounhold(extToToggle) {
//    var helement = $('#hold');
//    var topost = 'command=unhold&ext=' + extToToggle;
//    parentPost('unhold', {line: thisline});
//    helement.text('Hold');
//    $.post(esl, topost);
//}

//function holdTest(extToToggle) {
//    var helement = $('#hold');
//    if (helement.text() == 'Resume') {
//        core_dohold(extToToggle);
//        helement.text('Hold');
//    } else {
//        core_dounhold(extToToggle);
//        helement.text('Hold');
//    }
//}


function transferTest() {
    var transferto = prompt('Number to transfer to');
    var topost = 'command=transfer&ext=' + extension + '&transferto=' + transferto;
    $.post(esl, topost);
    verto.hold()
}

function checkPhone() {
    var phoneToDial = localStorage.getItem('phoneToDial');
    if (phoneToDial.length === 4 || phoneToDial.length === 11) {
        $('#ext').val(phoneToDial);
        $(callButton).click();
    } else {
        localStorage.setItem('phoneToDial', '');
    }
    localStorage.setItem('phoneToDial', '');
}
