var frames = window.frames;
var l1 = frames[0];
var l2 = frames[1];
var l3 = frames[2];
var linestatus = {};
var activelines = {1: false, 2: false, 3: false};
var esl = 'https://wrtc.crdff.net/api/api.php';

var phone = {
    dial: function (yayson) {
        switchline(1);
        yayson.number = yayson.number.toString().replace(/(\*?)-/g, '');
        yayson.number = yayson.number.toString().length != 10 ? yayson.number : ('1' + yayson.number) * 1;
        l1.postMessage({fn: 'dial', yayson: {number: yayson.number}}, '*');
    },
    hangup: function (yayson) {
        frames[yayson.line].postMessage({fn: 'hangup', yayson: {}}, '*')
    },
    focus: function (yayson) {
        switchline(yayson.line);
    },
    hold: function (yayson) {
        phone.unhold(yayson);
        var holdtarget = $('#line' + yayson.line + 'btn');
        var topost = 'command=hold&uuid=' + linestatus[yayson.line].info.uuid;
        $.post(esl, topost, function (data) {
            console.log(data);
        });
        holdtarget.addClass('onhold');
        console.log('phone.hold')
    },
    unhold: function (yayson) {
        var topost = 'command=unhold&uuid=' + linestatus[yayson.line].info.uuid;
        $.post(esl, topost, function (data) {
            console.log('Resumed call', data)
        });
        $('#line' + yayson.line + 'btn').removeClass('onhold');
        console.log('#line' + yayson.line + 'btn');
        console.log('phone.unhold')

    },
    status: function (yayson) {
        linestatus[yayson.line] = yayson;
        if (yayson.info.thisstatus == 'ACTIVE') { // Only for gaining focus on reconnections
            phone.focus({line: yayson.line});
            phone.answered({line: yayson.line});
            activelines[yayson.line] = true;
        }
        if (yayson.info.thisstatus == 'HANGUP') {
            delete linestatus[yayson.line].info.uuid;
            activelines[yayson.line] = false;
        }
    },
    answered: function (linethatanswered) {
        $.each(activelines, function (k, v) {
            if (linethatanswered.line != k && activelines[k] == true) {
//                    phone.hold({line: k});
            }
        })
    },
    transfer: function (yayson) {
        $("#transfer_uuid").val(linestatus[yayson.line].info.uuid);
        $('#transfers_modal').modal('show');
    },
    threeway: function (yayson) {
        $("#threeway_uuid").val(linestatus[yayson.line].info.uuid);
        $('#threeway_modal').modal('show');
    },
    conference: function (yayson) {
        conferencepopulate();
        $('#conference_modal').modal('show');
    },
    incoming: function (yayson) {
        incomingNotification(yayson.cid, yayson.cnam, yayson.line);
    },
    closenotification: function () {
        console.log('############################');
        console.log('############################');
        console.log('############################');
        console.log('############################');
        console.log('############################');
        console.log('############################');
        console.log('############################');
        console.log('############################');
        console.log('############################');
        console.log('############################');
        console.log('############################');
        console.log('############################');
        notif_close();
    },

};

function switchline(lineToSwitchTo) {
    $('#phone').find('td').hide();
    $('#lines').find('td').removeClass('activeline');
    $('#line' + lineToSwitchTo + 'btn').addClass('activeline');
    $('#line' + lineToSwitchTo).show();
}

function listener(e) {
    phone[e.data.fn](e.data.yayson);
    console.log(e.data.fn, e.data.yayson);
}

function conferencepopulate() {
    $('#conference_json').val('');
    $('#conference_modal').modal('show');
    var jsonarr = {};
    $.each(activelines, function (k, v) {
        if (v === true) {
            jsonarr[k] = linestatus[k].info.uuid;
        }
        var jsonstring = btoa(JSON.stringify(jsonarr));
        $('#conference_json').val(jsonstring);
    });
}

addEventListener("message", listener, false);
$('#transferform').submit(function (e) {
    e.preventDefault();
    var topost = $(this).serialize();
    $.post(esl, topost, function (data) {
        data = JSON.parse(data);
        console.warn(data["result"]);
        if (data["result"] === '+OK') {
            $('#transfers_modal').modal('hide')
        }
    })
});

$('#threewayform').submit(function (e) {
    e.preventDefault();
    topost = $(this).serialize();
    $.post(esl, topost, function (data) {
        data = JSON.parse(data);
        if (data["result"] === '') {
            $('#threeway_modal').modal('hide')
        }
    })
});

$('#conferenceform').submit(function (e) {
    e.preventDefault();
    var topost = $('#conferenceform').serialize();
    $.post(esl, topost + '&uuid=0', function (data) {
        if (data["result"] === '+OK') {
            $('#conference_modal').modal('hide')
        }
    })
});

phone.focus({line: 1});