//-------------------------------------
var m=$vm.module_list['__MODULE__'];
if(m.prefix==undefined) m.prefix="";
if(m.change_status==undefined) m.change_status=0;
m.options={self:m.self};
//-------------------------------------
m.load=function(){
    //$('#D__ID').scrollTop(0);
    //$(window).scrollTop(0);
    $('#F__ID')[0].reset();
    $('#submit__ID').show();
    $('#draft__ID').show();
    $('#delete__ID').hide(); if(m.input!=undefined && m.input.record!=undefined && m.input.record._id!==undefined) $('#delete__ID').show();
    if(m.input!=undefined) $vm.deserialize(m.input.record,'#F__ID');
}
//-------------------------------
m.set_file_link=function(tag){
    $('#link_'+tag+'__ID').html("");
    $('#x_'+tag+'__ID').hide();
    var record=m.input.record;
    if(record==undefined) return;
    var filename=record.Data[tag];
    if(filename==undefined){
        filename="";
    }
    else{
        $('#x_'+tag+'__ID').show();
    }
    $('#link_'+tag+'__ID').html(filename);
    var url=record.Table+"/"+record.UID+"-"+tag+"-"+filename;
    $('#link_'+tag+'__ID').on('click',function(){
        if(record._id!==undefined){
            if(filename!="") $vm.open_s3_url(record._id,m.Table,filename,url);
        }
        else alert("No file was found on server.")
    });
    $('#x_'+tag+'__ID').on('click',function(){
        $('#link_'+tag+'__ID').html('');
        $('#x_'+tag+'__ID').hide();
        record.Data[tag]="";
    })
}
//-------------------------------
m.set_file_link_s0=function(tag){
    $('#link_'+tag+'__ID').html("");
    $('#x_'+tag+'__ID').hide();
    var record=m.input.record;
    if(record==undefined) return;
    var filename=record.Data[tag];
    if(filename==undefined){
        filename="";
    }
    else{
        $('#x_'+tag+'__ID').show();
    }
    $('#link_'+tag+'__ID').html(filename);
    $('#link_'+tag+'__ID').off().on('click',function(){
        if(record._id!==undefined && filename!=""){
            var rid=record.UID;
            var done=0;
            var get_file_from_server=function(){
                if(done==0){
                    $vm.request({api:m.api,cmd:"file",id:rid,table:m.Table,uid:record.UID, field:tag,filename:filename,options:m.options},function(res, textStatus, xhr){
                        try{
                            if(res=="404"){
                                alert("No such file.");
                                return;
                            };
                        }
                        catch(e){}
                        if('caches' in window){
                            caches.open('VM').then(cache => {
                                var aHeaders = new Headers();
                                aHeaders.append('last-modifie',xhr.getResponseHeader('last-modified'));
                                var rs=new Response(res, { "headers" :aHeaders} );
                                cache.put(m.Table+"-"+rid+"-"+tag,rs);
                                return;
                            })
                        }
                        var link=document.createElement('a');
                        var url = window.URL || window.webkitURL;
                        link.href=url.createObjectURL(res);
                        link.download=filename;
                        link.click();
                        //document.body.removeChild(link);
                    });
                }
            }
            var get_file_from_cache=function(){
                if('caches' in window){
                    caches.open('VM').then(
                        cache => {
                            cache.match(m.Table+"-"+rid+"-"+tag).then(response => {
                                if(response){
                                    $vm.request({api:m.api,cmd:"file",id:rid,table:m.Table,uid:record.UID, field:tag,filename:filename,datetime:1,options:m.options},function(res){
                                        var dtA=new Date(response.headers.get('last-modifie')).getTime();
                                        var dtB=new Date(res.result).getTime();
                                        dtA=dtA-dtA%1000;
                                        dtB=dtB-dtB%1000;
                                        if(dtA==dtB){
                                            response.blob().then(function(myBlob) {
                                                var link=document.createElement('a');
                                                var url = window.URL || window.webkitURL;
                                                link.href=url.createObjectURL(myBlob);
                                                link.download=filename;
                                                link.click();
                                            });
                                        }
                                        else get_file_from_server();
                                    })
                                }
                                else{
                                    get_file_from_server();
                                }
                            })
                        }
                    )
                }
            }
            get_file_from_cache();
        }
        else alert("No file was found on server.")
    });
    $('#x_'+tag+'__ID').on('click',function(){
        $('#link_'+tag+'__ID').html('');
        $('#x_'+tag+'__ID').hide();
        record.Data[tag]="";
        $('#F__ID input[name='+tag+']').val('');
    })
    $('#F__ID input[name='+tag+']').on('change',function(){
        if($(this).val()!='') $('#x_'+tag+'__ID').show();
    });
}
//-------------------------------
m.set_image_url=function(tag){
    $obj=$('#'+tag+'__ID');
    $obj.attr('src',"");
    $('#x_'+tag+'__ID').hide();
    var record=m.input.record;
    if(record==undefined) return;
    var filename=record.Data[tag];
    if(filename==undefined || filename==""){
        return;
    }
    else{
        $('#x_'+tag+'__ID').show();
    }
    var modified=record.Update_date;
    if(modified==undefined) modified=record.Submit_date;
    
    var img_id='img_'+tag+'_'+record._id;
    if(m[img_id]!=undefined) $obj.attr('src',m[img_id]);
    else{
        var img_url				=localStorage.getItem(img_id+"_url");
        var img_last_load_date	=localStorage.getItem(img_id+"_last_load_date");
        var img_modified		=localStorage.getItem(img_id+"_modified");
        var D1=new Date();
        var D0=new Date(img_last_load_date);
        var dif=D1.getTime()-D0.getTime();
        dif=dif/1000/3600/24;
        if(img_url!==null && dif<6 && img_modified==modified){
            m[img_id]=img_url;
            $obj.attr('src',img_url);
        }
        else{
            var expires=7*24*3600;
            var url=record.Table+"/"+record.UID+"-"+tag+"-"+filename;
            $vm.request({api:m.api,cmd:"s3_download_url",id:record._id,table:record.Table,filename:filename,url:url,expires:expires,options:m.options},function(res){
                if(res.status=="np"){
                    alert("No permission.")
                    return;
                }
                m[img_id]=res.result;
                $obj.attr('src',res.result);
                localStorage.setItem(img_id+"_url",res.result);
                localStorage.setItem(img_id+"_last_load_date",new Date().toString());
                localStorage.setItem(img_id+"_modified",modified);
            });
        }
    }
    $('#x_'+tag+'__ID').on('click',function(){
        $obj.attr('src',"");
        $('#x_'+tag+'__ID').hide();
        record.Data[tag]="";
    })
}
//-------------------------------
m.submit=function(event){
    //--------------------------------------------------------
    event.preventDefault();
    $('#submit__ID').hide();
    $('#draft__ID').hide();
    //--------------------------------------------------------
    var data={};
    var index={};
    var data_new=$vm.serialize('#F__ID');
    if(m.input!=undefined && m.input.record!=undefined){
        for(k in m.input.record.Data){
            data[k]=m.input.record.Data[k];
        }
    }
    if(data_new!=undefined){
        for(k in data_new){
            data[k]=data_new[k];
        }
    }
    delete data[""];
    var file=$vm.serialize_file('#F__ID');
    var big_file_size=0;
    var FN=0; $('#F__ID').find('input[type=file]').each(function(evt){ 
        if(this.files.length==1) FN++; 
        //*******************
        if(this.files.length==1 && this.files[0].size>20000000){
            big_file_size=1;
            alert('File size must be less than 20M.');
            return false;                
        }
        //*******************
    });
    if(big_file_size==1) return;

    var r=true;
    if(m.before_submit!=undefined) r=m.before_submit(data,index);
    if(r==false){$('#submit__ID').show(); $('#draft__ID').show(); return;}
    //--------------------------------------------------------
    var rid=undefined; if(m.input!=undefined && m.input.record!=undefined) rid=m.input.record._id;
    if(rid==undefined){
        var i_cmd="insert";
        if(m.cmd_type=='table') i_cmd='insert-table';
        $vm.request({api:m.api,cmd:i_cmd,table:m.Table,data:data,index:index,file:file,options:m.options},function(res){
            if(res.status=="np"){
                alert("No permission to insert a new record in to the database.");
                if(m.input!=undefined && m.input.goback!=undefined){
                    $vm.refresh=1;
                    window.history.go(-1);       //from grid
                }
                return;
            }
            var after_submit=function(){
                if(m.after_insert!=undefined){
                    m.after_insert(data,res); return;
                }
                $vm.refresh=1;
                //if(m.change_status==undefined) m.change_status=0;
                m.change_status++;
                if(m.input.goback!=undefined) window.history.go(-1);            //from grid
                else $vm.alert('Your data has been successfully submitted');    //standalone
            }
            if(FN==0) after_submit();
            else{
                open_model__ID();
                $vm.upload_form_files(res,$('#F__ID'),"msg__ID",function(){
                    close_model__ID();
                    after_submit();
                })
            }
            //-----------------------------
        });
    }
    else if(rid!=undefined){
        var cmd="update";
        if(m.cmd_type=='p1') cmd='update-p1';
        if(m.cmd_type=='p2') cmd='update-p2';
        if(m.cmd_type=='table') cmd='update-table';
        $vm.request({api:m.api,cmd:cmd,id:rid,table:m.Table,data:data,index:index,file:file,options:m.options},function(res){
            //-----------------------------
            if(res.status=="lk"){
                $vm.alert("This record is locked.");
                return;
            }
            //-----------------------------
            if(res.status=="np"){
                alert("No permission to update this record.");
                return;
            }
            //-----------------------------
            var after_submit=function(){
                if(m.after_update!=undefined){
                    m.after_update(data,res); return;
                }
                $vm.refresh=1;
                //if(m.change_status==undefined) m.change_status=0;
                m.change_status++;
                if(rid!=undefined) window.history.go(-1);                       //modify
            }
            //-----------------------------
            if(FN==0) after_submit();
            else{
                open_model__ID();
                $vm.upload_form_files(res,$('#F__ID'),"msg__ID",function(){
                    close_model__ID();
                    after_submit();
                })
            }
            //-----------------------------
        });
    }
}
//--------------------------------------------------------
m.submit_s0=function(event){
    //-------------------------------------
    event.preventDefault();
    $('#submit__ID').hide();
    $('#draft__ID').hide();
    //-------------------------------------
    var rid=undefined; if(m.input!=undefined && m.input.record!=undefined) rid=m.input.record._id;
    var data={};
    var files=[];
    var index={};
    //-------------------------------------
    //data
    var data_new=$vm.serialize('#F__ID');
    if(m.input!=undefined && m.input.record!=undefined){
        for(k in m.input.record.Data){
            data[k]=m.input.record.Data[k];
        }
    }
    if(data_new!=undefined){
        for(k in data_new){
            data[k]=data_new[k];
        }
    }
    delete data[""];
    //-------------------------------------
    //index
    var r=true;
    if(m.before_submit!=undefined) r=m.before_submit(data,index);
    if(r==false){ $('#submit__ID').show(); $('#draft__ID').show(); return;}
    //-------------------------------------
    //after files
    var after_read_files=function(){
        if(rid==undefined){
            var i_cmd="insert";
            $vm.request({api:m.api,cmd:i_cmd,table:m.Table,data:data,index:index,fdata:files,options:m.options},
                function(res){
                    close_model__ID();
                    if(res.status=="np"){
                        alert("No permission to insert a new record in to the database.");
                        if(m.input!=undefined && m.input.goback!=undefined){
                            $vm.refresh=1;
                            window.history.go(-1);       //from grid
                        }
                        return;
                    }
                    var after_submit=function(){
                        if(m.after_insert!=undefined){
                            m.after_insert(data,res); return;
                        }
                        $vm.refresh=1;
                        m.change_status++;
                        if(m.input.goback!=undefined) window.history.go(-1);            //from grid
                        else $vm.alert('Your data has been successfully submitted');    //standalone
                    }
                    after_submit();
                    //-----------------------------
                },
                function(loaded, total){
                    if(FN!=0){
                        $("#msg__ID").text("Uploading... "+(100*loaded/total)+"%");
                    }
                }
            )
                
        }
        else if(rid!=undefined){
            var cmd="update";
            if(m.cmd_type=='p1') cmd='update-p1';
            if(m.cmd_type=='p2') cmd='update-p2';
            if(m.cmd_type=='table') cmd='update-table';

            $vm.request(
                {api:m.api,cmd:cmd,id:rid,table:m.Table,data:data,index:index,fdata:files,options:m.options},
                function(res){
                    close_model__ID();
                    //-----------------------------
                    if(res.status=="lk"){
                        $vm.alert("This record is locked.");
                        return;
                    }
                    //-----------------------------
                    if(res.status=="np"){
                        alert("No permission to update this record.");
                        return;
                    }
                    //-----------------------------
                    var after_submit=function(){
                        if(m.after_update!=undefined){
                            m.after_update(data,res); return;
                        }
                        $vm.refresh=1;
                        m.change_status++;
                        if(rid!=undefined) window.history.go(-1);                       //modify
                    }
                    //-----------------------------
                    after_submit();
                    //-----------------------------
                },
                function(loaded, total){
                    if(FN!=0){
                        $("#msg__ID").text("Uploading... "+(100*loaded/total)+"%");
                    }
                }
            );
        }
    }
    //-------------------------------------
    //files
    var FN=0; 
    $('#F__ID').find('input[type=file]').each(function(evt){if(this.files.length==1){FN++;}});
    var FNN=FN;
    if(FNN!=0){
        open_model__ID();
        $("#msg__ID").text("Uploading...");
        
        $('#F__ID').find('input[type=file]').each(function(evt){ 
            if(this.files.length==1){
                var r={};
                r.field_name=this.name;
                r.file_name=this.files[0].name;
                if(this.files[0].size>20000000){ 
                    alert('File size must be less than 20M.');
                    close_model__ID();
                    return false;                
                }
                var reader = new FileReader();
                reader.onload = (function(e) {
                    var c=e.target.result;
                    var s=$vm.getB64Str(c);
                    r.b64str=s;
                    files.push(r);
                    FNN--;
                    if(FNN==0) after_read_files();
                });
                reader.readAsArrayBuffer(this.files[0]);
            }
        });
    }
    else{
        after_read_files();
    }
    //-------------------------------------
}
//--------------------------------------------------------
$('#D__ID').on('load',function(){ m.load();})
$('#F__ID').submit(function(event){if(m.storage_type=='s0') m.submit_s0(event); else m.submit(event);})
//--------------------------------------------------------
$('#delete__ID').on('click', function(){
    var record=m.input.record;    if(record==undefined) return;
    var rid=record._id;           if(rid==undefined)    return;
    if(confirm("Are you sure to delete?\n")){
        var d_cmd="delete";
        if(m.cmd_type=='table') cmd='delete-table';
        $vm.request({api:m.api,cmd:d_cmd,id:rid,table:m.Table,options:m.options},function(res){
            //-----------------------------
            if(res.status=="lk"){
                $vm.alert("This record is locked.");
                return;
            }
            //-----------------------------
            if(res.status=="np"){
                alert("No permission to delete this record.");
                return;
            }
            //-----------------------------
            if(m.after_delete!=undefined){
                m.after_delete(res); 
                return;
            }
            //-------------------------------
            $vm.refresh=1;
            //if(m.change_status==undefined) m.change_status=0;
            m.change_status++;
            window.history.go(-1);
        });
    }
})
//-------------------------------------
$('#copy__ID').on('click',function(){
    if($vm.copy_paste==undefined) $vm.copy_paste={}
    $vm.copy_paste['__ID']={Data:$vm.serialize('#F__ID')};
    console.log($vm.copy_paste['__ID'])
})
//---------------------------------------------
$('#paste__ID').on('click',function(){
    if($vm.copy_paste!=undefined && $vm.copy_paste['__ID']!=null){
        $vm.deserialize($vm.copy_paste['__ID'],'#F__ID');
        if(m.paste!=undefined) m.paste($vm.copy_paste['__ID']);
    }
})
//---------------------------------------------
$('#header__ID').on('click', function(event){
    if(event.ctrlKey){
        var x=document.getElementById("F__ID");
        var txt="";var nm0="";
        for (var i=0; i < x.length; i++) {
            var nm=x.elements[i].getAttribute("name");
            if(nm!=null && nm!=nm0){ if(txt!="") txt+=", "; txt+=nm; nm0=nm;}
        }
        console.log(txt);
    }
});
//--------------------------------------------------------
$('#pdf__ID').on('click',function(){
    $('#D__ID').scrollTop(0);
    $(window).scrollTop(0);
    var h=$('#D__ID').css('height');
    $('#D__ID').css('height',"210mm");
    $('form_container__ID').css('height',"297mm");
    $('#F__ID').css('border-bottom-width','0');
    $('#submit__ID').hide();
    $('#pdf__ID').hide();
    var pdf=new jsPDF('p', 'pt', 'a4');
    //pdf.internal.scaleFactor = 2.25;
    var options = {
        //pagesplit: true,
        background: '#fff'
    };
    pdf.addHTML($('#form_container__ID'),options,function() {
        pdf.save(m.Table+'.pdf');
        $('#F__ID').css('border-bottom-width','1px');
        $('#submit__ID').show();
        $('#pdf__ID').show();
        $('#D__ID').css('height',h);
    });
    
})
//-------------------------------------
