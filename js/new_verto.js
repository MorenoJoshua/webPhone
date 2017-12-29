'use strict';
var cur_call = null;
var confMan = null;
var verto;
var ringing = false;
var autocall = false;
var chatting_with = false;
var first_login = false;
var online_visible = false;

//$(selector).pagecontainer({"theme": "a"});

//Customs
var inCall = '#page-incall';
var extSection = '#ext';
var onlineSection = '#page-main';
var offlineSection = '#offline';
var timerDisplay = '#timer';
var xferDiv = '#xferdiv';
var screenDiv = '#main_info';
var message = '#message';
var confSection = '#conf';
//var chatSection = '#chatwin';
var answerButton = '#ansbtn';
var incomingDialog = '#dialog-incoming-call';
var declineButton = '#declinebtn';
var incomingText = '#dialog-incoming-call-txt';
var videoAnswer = '#vansdiv';
var hangupCause = '#hangup_cause';
var holdButton = '#hold';
var cancelTransferButton = '#cancelxferbtn';
var startTransferButtons = '.startxferbtn';
var transferToInput = '#xferto';
var clearButton = '#clearbtn';
var dialButton = '.dialbtn';
var hangUpButton = '#hupbtn';
var webcamButton = '#webcam';
var webcam = webcamButton;
var mainInfo = '#main_info';
var nameInput = '#name';
var callerID = '#cid';
var useStereo = '#use_stereo';
var callButton = '#callbtn';
var errorDisplay = '#errordisplay';
var dtmfButton = '.dtmf';
var useVid = '#use_vid';
var useStun = '#use_stun';
var login = '#login';
var hostName = '#hostName';
var password = '#passwd';
var websocketUrl = '#wsURL';
var ringFile = "other/ring.mp3";
var logoutButton = '#logoutbtn';
var loginButton = '#loginbtn';
var directory = '#directory';
var selector = '.selector';
var holdText = 'Hold';
var onHoldText = '...';
var prescense;


// Sets user Variables to verto cookies inside init()
// string (input id), cookie, default (if input empty)
function popopop() {
    pop("#name", "verto_demo_name", calleridName);
    pop("#cid", "verto_demo_cid", calleridNumber);
    pop("#textto", "verto_demo_textto", "");

    pop("#login", "verto_demo_login", extension);
    pop("#passwd", "verto_demo_passwd", phonePassword);

    pop("#hostName", "verto_demo_hostname", host);
    pop("#wsURL", "verto_demo_wsurl", "wss://" + host + ":8082");
}


//Updates Screen content
function screenText(msg) {
    $(screenDiv).val(msg);
}

// Clears conference manager, not used
function clearConfMan() {
    if (confMan) {
        confMan.destroy();
        confMan = null;
    }
    phone.closenotification();
    $(confSection).hide();
    $(message).hide();
    chatting_with = null;
}

// hides all fields with same class as thingToShow, shows thingToShow
// goto_dialog(where), goto_page(where, force)
function showSection(thingToShow) {
    var classToHide = $(thingToShow).attr('class');
    $('.' + classToHide).hide();
    $(thingToShow).show();
}


/*If online, show online section, else show offline*/
function online(on) {
    if (on) {
        $(onlineSection).show();
        $(offlineSection).hide();
        first_login = true;
    } else {
        $(onlineSection).hide();
        $(offlineSection).show();
    }
    online_visible = on;
}

/*Chat , eliminando
 * posible eliminar chatmsg chatwin chatsend*/
function setupChat() {
}

/*Checks if video is enabled, always return false*/
function check_vid() {
    return false;
}

/*Makes links? eliminando*/
var callbacks = {
    onMessage: function (verto, dialog, msg, data) {
        //When receiving a $(message), ignorable/removable
    }, onDialogState: function (d) {
        // when phone is doing something
        cur_call = d;
        ringing = d.state == $.verto.enum.state.ringing;
        //if there is an incoming call, state = ringing
        if (d.state === $.verto.enum.state.ringing) {
            // hook when phone rings
            screenText("Call From: " + d.cidString());

            $(answerButton).click(function () {
                // hook when user answers button
                cur_call.answer({
                    useStereo: $(useStereo).is(':checked'),
                    callee_id_name: $(nameInput).val(),
                    callee_id_number: $(callerID).val() ///xxxxxxxx
                });
                $(incomingDialog).slideUp();
            });
            $(declineButton).click(function () {
                // hook when user declines
                cur_call.hangup();
                $(incomingDialog).slideUp();
            });
            //showSection(incomingDialog);
            $(incomingDialog).slideDown();
            $(incomingText).text("Incoming call from: " + d.cidString());
            //removed video answer
            $(videoAnswer).hide();

        } else if (d.state === $.verto.enum.state.trying) {
            // when dialing, before call connects with server
            // hook when dialing before ring
            screenText("Calling: " + d.cidString());
            showSection(inCall);

        } else if (d.state === $.verto.enum.state.early || d.state === $.verto.enum.state.active) {
            // when phone is active, or returning to page and call is active
            // hook when answered, start timer and stuff
            //screenText("Talking to: " + d.cidString());
            showSection(inCall);


        } else if (d.state === $.verto.enum.state.hangup) {
            $(incomingDialog).hide();
            showSection(onlineSection);
            $(hangupCause).html("");
            clearConfMan();
            cur_call = null;
        } else if (d.state === $.verto.enum.state.destroy) {
            clearConfMan();
            cur_call = null;
        } else if (d.state === $.verto.enum.state.held) {
        } else {
            screenText("");
        }
    }, onWSLogin: function (v, success) {
        screenText("Logged In");
        showSection(onlineSection);
        $(incomingDialog).hide();
        cur_call = null;
        ringing = false;
        if (success) {
            online(true);
            /*###sends everything to the checklines function####*/
            verto.subscribe("presence", {
                handler: function (v, e) {
                    checkLines(e);
                }

            });
            /*###################################################*/
            if (!window.location.hash) {
                showSection(onlineSection);
            }

            if (autocall) {
                autocall = false;
                docall();
            }
        } else {
            showSection(onlineSection);
            showSection(loginErrorSection);
        }

    },
// when ws connection is lost
    onWSClose: function (v, success) {
        // hook when status is not ready, red light?
        console.log(v + ' ' + success);
        screenText("");
        online(false);
        var today = new Date();
        $(errorDisplay).html("Connection Error.<br>Last Attempt: " + today);
        showSection(onlineSection);
    },

// when event is received?
    onEvent: function (v, e) {
        //hook
        console.log("GOT EVENT", e);
    }
};

// when click on hold
// Deprecated aug 14 - Josh
//$(holdButton).click(function (e) {
//    console.log(e);
//    if ($(this).text() == holdText) {
//        $(this).text(onHoldText);
//    } else {
//        $(this).text(holdText);
//    }
//
//     hook when clicking on hold
//cur_call.toggleHold();
//showSection(onHold);
//});

// when click on cancel transfer
$(cancelTransferButton).click(function (e) {
    console.log(e);

    // hook
    $(transferToInput).val("");
    $($(xferDiv)).slideUp();
});

// when lcicking on each transfer button
$(startTransferButtons).click(function (e) {
    //console.log(e);
    //if ($($(xferDiv)).is(':visible')) {
    //    var xfer = $(transferToInput).val();
    //    if (xfer) {
    //        cur_call.transfer(xfer);
    //    }
    //    $(transferToInput).val("");
    //    $($(xferDiv)).slideUp();
    //} else {
    //    $($(xferDiv)).slideDown();
    //}
});

//when click on clear
$(clearButton).click(function (e) {
    //console.log(e);
    // hook on clear
    //$(extSection).val("");
});

//when clicking on dial?
$(dialButton).click(function (e) {
    // hook on dial
    $(extSection).val($(extSection).val() + e.currentTarget.textContent);
});

// when function dtmf is called
$(dtmfButton).click(function (e) {
    if ($($(xferDiv)).is(':visible')) {
        $(transferToInput).val($(transferToInput).val() + e.currentTarget.textContent);
    } else {
        cur_call.dtmf(e.currentTarget.textContent);
    }

});

// when clicking the hangup button
$(hangUpButton).click(function () {
    // hook when hanging up
    verto.hangup();
    $(holdButton).text(holdText);
    showSection(onlineSection);
    cur_call = null;
});

// does nothing
$(webcamButton).click(function () {
    check_vid();
});

// tries to make a call
function docall() {
    $(extSection).trigger('change');
    if (cur_call) {
        // if call exists, nothing changes
        return;
    }

    var todial = $(extSection).val();
    switch (todial.substr(0, 3)) {
        default:
            break;
        case '*88':
            var spiedExt = todial.substr(3);
            //alert(spiedExt);
            _mon(true, spiedExt);
            break;



        //    var yyy = $(extSection).val();
        //    _spy(yyy.substr(3));
        //    alert(todial);
    }

    screenText("Trying");
    // hook before conencting call

    cur_call = verto.newCall({
        destination_number: $(extSection).val(),
        caller_id_name: $(nameInput).val(),
        caller_id_number: $(callerID).val(),
        useVideo: false,
        useStereo: false
    });
}

$(callButton).click(function () {
    // when clickcing call, tries to make a call
    docall();
});

// input to cookies
function pop(id, cname, dft) {
    var tmp = $.cookie(cname) || dft;
    $.cookie(cname, tmp, {
        expires: 0
    });
    $(id).val(tmp).change(function () {
        $.cookie(cname, $(id).val(), {
            expires: 0
        });
    });
}


function init() {
    cur_call = null;

    // set user variables
    popopop();

    var tmp = $.cookie("verto_demo_vid_checked") || "false";
    $.cookie("verto_demo_vid_checked", tmp, {
        expires: 0
    });

    $(useVid).prop("checked", tmp === "true").change(function (e) {
        console.log(e);
        tmp = $(useVid).is(':checked');
        $.cookie("verto_demo_vid_checked", tmp ? "true" : "false", {
            expires: 365
        });
    });

    tmp = $.cookie("verto_demo_stereo_checked") || "false";
    $.cookie("verto_demo_stereo_checked", tmp, {
        expires: 0
    });

    //checks if we're using stereo
    $(useStereo).prop("checked", tmp === "true").change(function (e) {
        console.log(e);
        tmp = $(useStereo).is(':checked');
        $.cookie("verto_demo_stereo_checked", tmp ? "true" : "false", {
            expires: 0
        });
    });

    tmp = $.cookie("verto_demo_stun_checked") || "true";
    $.cookie("verto_demo_stun_checked", tmp, {
        expires: 0
    });

    //checks stun info
    $(useStun).prop("checked", tmp === "true").change(function (e) {
        console.log(e);
        tmp = $(useStun).is(':checked');
        $.cookie("verto_demo_stun_checked", tmp ? "true" : "false", {
            expires: 0
        });
        if (verto) {
            verto.iceServers(tmp);
        }
    });

    // creates connection to WS server
    verto = new $.verto({
        login: $(login).val() + "@" + $(hostName).val(),
        passwd: $(password).val(),
        socketUrl: $(websocketUrl).val(),
        tag: "webcam",
        ringFile: ringFile,
        videoParams: {
            "minWidth": "1",
            "minHeight": "1"
        },
        audioParams: {
            googAutoGainControl: false,
            googNoiseSuppression: false,
            googHighpassFilter: false
        },
        iceServers: $(useStun).is(':checked')
    }, callbacks);

//not used
    $(login).change(function (e) {
        $(callerID).val(e.currentTarget.value);
        $.cookie("verto_demo_cid", e.currentTarget.value, {
            expires: 0
        });
    });

// ignorable
    $("#vtxtbtn").click(function () { //ignorable
        verto.$(message)({
            to: '',
            body: ''
        });
    });


//not used
    $(logoutButton).click(function () {
        verto.logout();
        online(false);
    });

// not used
    $(loginButton).click(function () {
        online(false);
        verto.loginData({
            login: $(login).val() + "@" + $(hostName).val(),
            passwd: $(password).val()
        });
        verto.login();
        showSection($(mainInfo));
    });

    $(xferDiv).hide();
    $(webcam).hide();

    online(false);

//ignorable
    setupChat();

// enter on number input places call
    $(extSection).keyup(function (event) {
        if (event.keyCode == 13) {
            $(callButton).trigger("click");
        }
    });

// Keys to dtmf
    $(document).keypress(function (event) {
        if (!(cur_call && event.target.id == "page-incall")) return;
        var key = String.fromCharCode(event.keyCode);
        var i = parseInt(key);
        if (key === "#" || key === "*" || key === "0" || (i > 0 && i <= 9)) {
            cur_call.dtmf(key);
        }
    });

    if (window.location.hostname !== hostName) {
        $(directory).hide();
    }
}

// logs in when ready homes
$(document).ready(function () {
    var hash = window.location.hash.substring(1);
    //noinspection JSUnusedAssignment
    var a = [];

    if (hash && hash.indexOf("page-") == -1) {
        window.location.hash = "";
        $(extSection).val(hash);
        autocall = true;
    }

    if (hash && (a = hash.split("&"))) {
        window.location.hash = a[0];
    }

    init();

});


