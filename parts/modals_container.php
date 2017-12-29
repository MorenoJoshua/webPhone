<div class="modal fade" id="transfers_modal">
    <div class="modal-dialog modal-vertical-centered">
        <form action="" id="transferform">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Calling transfer</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <input type="hidden" id="transfer_uuid" name="uuid" value="">
                        <input type="hidden" id="transfer_command" name="command" value="transfer">
                        <input type="text" id="transfer_to" class="form-control"
                               placeholder="Transfer to:"
                               autofocus name="to">
                    </div>
                </div>
                <div class="modal-footer">             
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Confirm</button>
                </div>
            </div>
        </form>
    </div>
</div>


<div class="modal fade" id="threeway_modal">
    <div class="modal-dialog modal-vertical-centered">
        <form action="" id="threewayform">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Three-way</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <input type="hidden" id="threeway_uuid" name="uuid" value="">
                        <input type="hidden" id="threeway_command" name="command" value="threeway">
                        <input type="text" id="threeway_to" class="form-control"
                               placeholder="Merge with:"
                               autofocus name="to">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Confirm</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="modal fade" id="conference_modal">
    <div class="modal-dialog modal-vertical-centered">
        <form action="" id="conferenceform">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Conference</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <input type="hidden" id="conference_room" name="room" value="<?= time() ?>">
                        <input type="hidden" id="conferenceway_command" name="command" value="conference">
                        <input type="hidden" id="conference_json" name="json" value="">
                        <h3>Join calls?</h3>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Confirm</button>
                </div>
            </div>
        </form>
    </div>
</div>
