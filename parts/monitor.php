<input type="hidden" name="" id="keys">
<script>
    var monext = null;
    var monmode = false;

    function _mon(yn, ext) {
        monmode = yn;
        monext = ext;
    }

    function _spy(extreplaced, ext) {
        if (monmode != false) {
            if (monext == extreplaced) {
                $('#ext').val('*88' + ext)
                $('#callbtn').click();
                $('#ext').val('')
            }
        }

    }
</script>

<!--<a class="btn btn-primary" data-toggle="modal" href="modal-id">Trigger modal</a>-->
<div class="modal fade" id="modal-id">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Modal title</h4>
            </div>
            <div class="modal-body">
                Modal body ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><!-- /.modal -->