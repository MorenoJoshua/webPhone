<div id="page-incall" class="pages" align="center" data-url="page-incall">
    <div data-role="header" id="calltitle"></div>
    <div id="conf" style="display: none;">
        <div align="center" id="conf_count"></div>
        <table width="800" cellspacing="0" cellpadding="0" border="0" align="center" id="conf_list"></table>
    </div>
    <div id="xferdiv" style="display: none;">
        <input data-mini="true" placeholder="Transfer to..." type="text" id="xferto" class="form-control">
        <button id="cancelxferbtn" class="col-xs-6">Cancel Transfer</button>
        <button class="startxferbtn col-xs-6">Complete Transfer</button>
    </div>
    <div id="keypad"><button class="dtmf" dtmf="1"><h3>1</h3><p>&nbsp;</p></button><button class="dtmf" dtmf="2"><h3>2</h3><p>abc</p></button><button class="dtmf" dtmf="3"><h3>3</h3><p>def</p></button><button class="dtmf" dtmf="4"><h3>4</h3><p>ghi</p></button><button class="dtmf" dtmf="5"><h3>5</h3><p>jkl</p></button><button class="dtmf" dtmf="6"><h3>6</h3><p>mno</p></button><button class="dtmf" dtmf="7"><h3>7</h3><p>pqrs</p></button><button class="dtmf" dtmf="8"><h3>8</h3><p>tuv</p></button><button class="dtmf" dtmf="9"><h3>9</h3><p>wxyz</p></button><button class="dtmf" dtmf="*"><h3>*</h3><p>&nbsp;</p></button><button class="dtmf" dtmf="0"><h3>0</h3><p>&nbsp;</p></button><button class="dtmf" dtmf="#"><h3>#</h3><p>&nbsp;</p></button></div>
    <div id="conf_mod"></div>
    <div style="color:blue" id="conf_display"></div>
    <div class="row">
        <button id="hold" class="col-xs-4" onclick="phone.holdtoggle()">Hold</button>

        <div class="dropup col-xs-4">
            <button class="btn btn-default btn-block dropdown-toggle" type="button" id="vmbtn" data-toggle="dropdown">
                Opt
                <small>&#x25B2;</small>
            </button>
            <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="vmbtn">
                <li role="presentation" onclick="autoVM(<?= $phoneparams['ext'] ?>, <?= $phoneparams['did'] ?>)"><a
                        role="menuitem" class="h3" tabindex="-1" href="#">AutoVM</a></li>
                <li role="presentation" onclick="phone.transfer()"><a role="menuitem" class="h3" tabindex="-1" href="#">Transfer</a>
                </li>
                <li role="presentation" onclick="phone.threeway()"><a role="menuitem" class="h3" tabindex="-1"
                                                                        href="#">Three-Way</a></li>
                <li role="presentation" onclick="phone.conference()"><a role="menuitem" class="h3" tabindex="-1"
                                                                        href="#">Conference</a></li>
            </ul>
        </div>
        <button id="hupbtn" class="col-xs-4" onclick="hangupandresetlines()"><h1><span
                    class="glyphicon glyphicon-earphone"></span></h1></button>
    </div>
</div>