<script type="text/javascript">
    localStorage.setItem('phoneToDial', '0');
    var extension = "<?=$phoneparams['ext']?>";
    var calleridNumber = "<?=$phoneparams['did']?>";
    var calleridName = "<?=$phoneparams['cid']?>";
    var phonePassword = "<?=$phoneparams['password']?>";
    var host = '<?=isset($phoneparams['host']) ? $phoneparams['host'] : 'wrtc.crdff.net'?>';
</script>