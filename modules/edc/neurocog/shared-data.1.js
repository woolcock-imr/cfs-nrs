//-------------------------------------
m.set_req=function(){
    if(m.input!=undefined && m.input.record!=undefined){
        m.query={Table:m.Table,'Data.Participant_uid':m.input.record.UID.toString()}
    }
    else{
        m.query={Table:m.Table}
    }
};
//-------------------------------------
m.load=function(){
    if(m.input!=undefined && m.input.record!=undefined){
        $('#export_section__ID').hide();
    }
    else{
        $('#export_section__ID').show();
    }
}
//-------------------------------------
m.cell_render=function(records,I,field,td){
    switch(field){
        case '_Status':
            td.html("<span style='color:"+records[I].Data['sysStatus']+"'>&#x25cf;</span>");
            break;
        case '_Participant_ID':
            td.html(records[I].Data.Participant_uid);
            break;
        case '_Notes':
            var notes='Notes';
            if(records[I].Notes!=undefined){
                var n1=records[I].Notes.split('\n')[0];
                //var n2=n1.split('\n').pop();
                if(n1.length>0){
                    notes=n1;
                    if(notes.length>10) notes=notes.substring(0,10)+"...";
                }
            }
            td.html("<u style='cursor:pointer'>"+notes+"</u>");
            td.find('u').on('click',function(){
                $vm.load_module('notes','',{record:records[I]});
            });
            break;
    }
}
//-------------------------------------
m.new=function(){
    if(m.form_module!=undefined){
        //we are using child panel
        var participant_record=$vm.vm['__ID'].input.record;
        $vm.load_module(m.form_module,'',{participant_record:participant_record,goback:1});
    }
}
//-------------------------------------
