// var prefix=$vm.module_list[$vm.vm['__ID'].name].prefix; if(prefix==undefined) prefix="";

var m=$vm.module["__ID"];
var prefix = $vm.module_list[$vm.vm['__ID'].name].prefix; if (prefix == undefined) prefix = "";
m.module=$vm.module_list[m.name];
$vm.module["__ID"]={};
m.name=$vm.vm['__ID'].name;
//m.input=$vm.vm['__ID'].input; //?
m.preload=m.module.preload;
m.prefix=m.module.prefix; if(m.prefix==undefined) m.prefix="";
m.form_module=m.prefix+m.module.form_module;
m.db_pid=m.module.table_id;
if(m.prefix==undefined) m.prefix="";
//-------------------------------------
// /*
if($vm.module==undefined) $vm.module={};

m.db_pid=m.Table;
m.qid=m.module.qid; 
if(m.qid==undefined) 
m.qid=$vm.qid;






//-------------------------------------
var participant_pid=$vm.module_list[prefix+'participant'].table_id;
var sql_participant="@('Subject_Initials')+' '+@('Gender')+' '+@('DOB')";
//-------------------------------------
$('#back__ID').hide();
//-------------------------------------
$('#Participant__ID').autocomplete({
    minLength:0,
    source:function(request,response){
        var sql="with tb as (select name="+sql_participant+",value2=UID,value3=S1 from [TABLE-"+participant_pid+"])";
        sql+=" select top 10 name,value=name,value2,value3 from tb where Name like '%'+@S1+'%' ";
        $VmAPI.request({data:{cmd:'auto',s1:request.term,sql:sql,minLength:0},callback:function(res){
            response($vm.autocomplete_list(res.table));
        }});
    },
    select: function(event,ui){
        $('#Participant_uid__ID').val(ui.item.value2);
        $('#save__ID').css('background','#E00');
    }
})
$('#Participant__ID').focus(function(){$('#Participant__ID').autocomplete("search","");});
$('#Participant_r__ID').on('click',function(){$('#Participant__ID').val('');$('#Participant_uid__ID').val('');})
//-------------------------------------
var _task_fields;
//-------------------------------------
var _set_participant_field=function(){
    if($vm.vm['__ID'].op.from_grid==="1"){
        $('#tr_participant__ID').show();
    }
    else{
        $('#tr_participant__ID').hide();
        _records[0].Participant=_trigger_parameters.participant;
        _records[0].Participant_uid=_trigger_parameters.participant_uid;
    }
    $('#Participant__ID').blur(function(){
        _records[I].Participant=$('#Participant__ID').val();
        _records[I].Participant_uid=$('#Participant_uid__ID').val();
    })
}
//-------------------------------------
