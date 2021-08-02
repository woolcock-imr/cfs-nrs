$('body').css('background','black');
var timeouts = [];
var intervals = [];
//------------------------------------
var this_module=$vm.module_list[$vm.vm['__ID'].name];
//------------------------------------
$('#D__ID').on('load',function(){
    $('#header').hide();
    $('#footer').hide();
    $('#participant_div__ID').hide()
    $('#thirdparty_container__ID').css('padding-top','100px');
    $('#thirdparty_container__ID').css('height',$vm.min_height);
    third_party("thirdparty_container__ID",data_process);
    //data={}
    //calc(data)
    //console.log(data)
})
//------------------------------------
var ClearIntervals = function()
{
    for (var i=0; i<intervals.length; i++)
    {
        clearInterval(intervals[i]);
    }
    intervals = [];
    for (var i=0; i<timeouts.length; i++)
    {
        clearTimeout(timeouts[i]);
    }
    timeouts = [];
}
//------------------------------------
$('#D__ID').on('unload',function(){
    ClearIntervals();
})
//------------------------------------
var calc=function(data){
/*
    var no="PRE,1,2,3,4,5,6,7,8,9,10,11,12,13"
    var nno=no.split(",")
    var rt="0,779,1011,1093,2998,3001,1812,1040,1110,954,621,771,961,1262"
    var nrt=rt.split(",")
    var ac="-,CN,CN,CN,CN,CN,CM,CM,CN,CM,CM,CM,FN,CM"
    var nac=ac.split(",")
*/	
    var nno=data.NNO.split(",");
    var nrt=data.NRT.split(",");
    var nac=data.NAC.split(",");
    var ngta=0;
    var nrgt=0;
    var ntcr=0;
    var ntcrm=0;
    var ntcrn=0;
    var ntic=0;
    var ntmr=0;
    var nmis=0;
    var ntwr=0;
    var nmrt=0;
    var nmrtm=0;
    var nmrtn=0;
    var nmrta=[];
    var nmrtma=[];
    var nmrtna=[];
    var mrtcm=0;
    var ntfrm=0;
    var ntfrn=0;
    for (var i=0;i<nno.length;i++){
        if(nno[i]!='1' && nno[i]!='2' && nno[i]!='3' && nno[i]!='PRE'){
            if( nac[i]=='CM')   {ntcr++;ntcrm++;nmrt+=parseInt(nrt[i]);nmrtm+=parseInt(nrt[i]);nmrta.push(nrt[i]);nmrtma.push(nrt[i]);}
            if( nac[i]=='CN')   {ntcr++;ntcrn++;nmrt+=parseInt(nrt[i]);nmrtn+=parseInt(nrt[i]);nmrta.push(nrt[i]);nmrtna.push(nrt[i]);}
            if( nac[i]=='O')    nmis++;
            if( nac[i]=='FM')   {ntic++;ntfrm++;}
            if( nac[i]=='FN')   {ntic++;ntfrn++;}
            if( nac[i]=='W')    ntwr++;
            nrgt=nrgt+parseInt(nrt[i]);
        }
    }
    if( ntcr+ntic > 0){
        ngta=(100*ntcr/(ntcr+ntic)).toFixed(1)
        data.NGTA=ngta;
        data.GMRT=(nrgt/(nno.length-3-nback)).toFixed(0);
    }
    else  data.NGTA='0';
    data.NBACK=nback;
    data.NTCR=ntcr;
    data.NMIS=nmis;
    data.NTIC=ntic;
    data.NGRT=nrgt;
    if(ntcr>0) data.NMRT=(nmrt/ntcr).toFixed(0);
    else data.NMRT='0';
    if(ntcrm>0) data.MRTCM=(nmrtm/ntcrm).toFixed(0);
    else data.MRTCM='0';
    if(ntcrn>0) data.MRTCN=(nmrtn/ntcrn).toFixed(0);
    else data.MRTCN='0';
    if(nmrta.length>1){
        var sdcr=standardDeviation(nmrta);
        data.SDCR=sdcr.toFixed(0);
    }
    else data.SDCR=0;
    if(nmrtma.length>1){
        var sdcm=standardDeviation(nmrtma);
        data.SDCM=sdcm.toFixed(0);
    }
    else data.SDCM=0;
    if(nmrtna.length>1){
        var sdcn=standardDeviation(nmrtna);
        data.SDCN=sdcn.toFixed(0);
    }
    else data.SDCN=0;

    if(nmrta.length>1){
        var mdrtcr=median(nmrta);
        data.MdRTCR=mdrtcr.toFixed(0);
    }
    else data.MdRTCR=0;
    if(nmrtma.length>1){
        var mdrtcm=median(nmrtma);
        data.MdRTCM=mdrtcm.toFixed(0);
    }
    else data.MdRTCM=0;
    if(nmrtna.length>1){
        var mdrtcn=median(nmrtna);
        data.MdRTCN=mdrtcn.toFixed(0);
    }
    else data.MdRTCN=0;
    if(nmrta.length>0){
        var mnrtcr=getmin(nmrta);
        data.MnRTCR=mnrtcr;
        var mxrtcr=getmax(nmrta);
        data.MxRTCR=mxrtcr;
        var mf10cra=top10pc(nmrta);
        var mf10cr=average(mf10cra);
        data.MF10CR=mf10cr;
        var ms10cra=bottom10pc(nmrta);
        var ms10cr=average(ms10cra);
        data.MS10CR=ms10cr;
    }
    else {
        data.MnRTCR='0';
        data.MxRTCR='0';
        data.MF10CR='0';
        data.MS10CR='0';
    }
    if(mf10cra!=undefined && mf10cra.length > 1){
        var sdf10cr=standardDeviation(mf10cra);
        data.SDF10CR=sdf10cr.toFixed(0);
    }
    else data.SDF10CR='0';
    if(ms10cra!=undefined && ms10cra.length > 1){
        var sds10cr=standardDeviation(ms10cra);
        data.SDS10CR=sds10cr.toFixed(0);
    }
    else data.SDS10CR='0';
    data.NTCM=ntcrm;
    data.NTCN=ntcrn;
    data.NTFM=ntfrm;
    data.NTFN=ntfrn;
    data.NTWR=ntwr;
}
//-------------------------------------
var data_process=function(data){
    //alert(JSON.stringify(data));
    calc(data);
    data.Participant=$('#Participant__ID').val();
    data.Participant_uid=$("input[name='Participant_uid']").val();
    data.sysStatus='#00FF00';
    $vm.request({cmd:"insert",table:m.Table,data:data},function(res){
        if(res.status=="np"){
            alert("No permission to insert a new record in to the database.");
            if(m.input.goback!=undefined){
                $('#header').show();
                $('#footer').show();
                $vm.refresh=1;
                window.history.go(-1);       //from grid
            }
            return;
        }
        else { 
            $('#header').show();
            $('#footer').show();
            $vm.refresh=1;
            window.history.go(-1);
        }
    });
    //--------------------------------------------------------
}
//------------------------------------
var third_party=function(containerID,callback)
{
    $('.start-button').hide();
    ClearIntervals();
    $('#'+containerID).css('background-color','#000000');
    var canvas = document.getElementById('main_canvas__ID');
    var ctx = canvas.getContext('2d');
    var scale = 4;
    var angle = 60;
    var radius1 = 10;
    var radius2 = 35;
    var numpretrials = nback;
    var cuestarttostimulusstarttime = 1500;
    var interstimulustime = 4500;
    var cuevisibletime = 200;
    var stimulusvisibletime = 250;
    var practice = false;
    var instructions = [
                        "#instructions_1__ID",
                        ];
    var letters = ['B', 'C', 'F', 'H', 'L', 'M', 'P', 'T', 'W', 'X', 'Y', 'Z'];
    var first = null;
    var trials = [];
    var responded = true;
    var current = 0;
    var startTime;
    var width = canvas.width;
    var height = canvas.height;
    var midX = width / 2;
    var midY = height / 2;
    var separation = 140;
    var finished = false;
    function PointOnCircle(a, r)
    {
        var rad = a / 180 * Math.PI;
        var ret = { x : -Math.cos(rad) * r * scale + midX, y : -Math.sin(rad) * r * scale + midY };
        return ret;
    }
    var positions = [
                        PointOnCircle(-angle, radius1),
                        PointOnCircle(0, radius1),
                        PointOnCircle(angle, radius1),
                        PointOnCircle(180 - angle, radius1),
                        PointOnCircle(180, radius1),
                        PointOnCircle(180 + angle, radius1),
                        PointOnCircle(-angle, radius2),
                        PointOnCircle(0, radius2),
                        PointOnCircle(angle, radius2),
                        PointOnCircle(180 - angle, radius2),
                        PointOnCircle(180, radius2),
                        PointOnCircle(180 + angle, radius2),
                    ];
    var correct = 0;
    var missed = 0;
    var wrong = 0;
    var results = {
        Time : [],
        Number : [],
        KeyResponse : [],
    };
    var responce = {};
    instructions.forEach(function(i) { $(i).hide(); });
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '32px arial';
    function Instructions()
    {
        $('#main_canvas__ID').hide();
        $('.start-button').show();
        $(instructions[current]).show();
    }
    function RandomExcept(maxExcl, exception)
    {
        var ret = 0;
        do
        {
            ret = Math.floor(Math.random() * maxExcl);
        } while (ret == exception);
        return ret;
    }
    function ReferenceTrial(cur)
    {
        if (nback == 1)
            return Math.max(0, cur - 1);
        else if (nback == 2)
            return Math.max(0, cur - 2);
        else if (nback == 3)
            return Math.max(0, cur - 3);
    }
    function Start()
    {
        var start_time= new Date();
        var hh = start_time.getHours()
        var mn = start_time.getMinutes()
        var ss = start_time.getSeconds()
        if(mn<10){mn='0'+mn;}
        if(hh<10){hh='0'+hh;}
        if(ss<10){ss='0'+ss;}
        responce.Start_Time=hh+':'+mn+':'+ss;
        $('.start-button').hide();
        $('#participant_div__ID').css("visibility", "hidden");
        $(instructions[current]).hide();
        $('#main_canvas__ID').show();
        marks = [];
        trials=[];
        Clear();
        for (var i=0; i<numpretrials; i++)
        {
            var t = {
                        l: Math.floor(Math.random() * letters.length),
                        p: Math.floor(Math.random() * positions.length),
                        pre: true,
                    }
            trials.push(t);
        }

        var p1=0,p2=0,pv;
        for (var i=0; i<numtrials; i++)
        {
            var ref = ReferenceTrial(trials.length);
            if(p1==parseInt((numtrials-3)/2) || p2==parseInt((numtrials-3)/2) ) {
                if(p2==parseInt((numtrials-3)/2)) {pv=trials[ref].p;}
                else pv=RandomExcept(positions.length, trials[ref].p);
            }
            else { if(Math.random() < 0.5 ){
                        pv=trials[ref].p;
                        if(i>2) p1++;
                    }
                    else{
                        pv=RandomExcept(positions.length, trials[ref].p);
                        if(i>2) p2++;
                    }
            }
            var t = {
                        id: i+1,
                        l: Math.floor(Math.random() * letters.length),
                        p: pv,
                        pre: false,
                    }
            trials.push(t);
        }
        
        for (var i=0; i<trials.length; i++)
        {
            var t = trials[i];
            console.log(i + ' ' + t.l + ' ' + t.p) ;
        }
        current = -1;
        Next();
        intervals.push(setInterval(Next, interstimulustime));
    }
    function Next()
    {
        if (!responded)
        {
            SaveResults('O');
        }
        current++;

        if (current >= trials.length)
        {
            ClearIntervals();
            Finish();
        }
        else
        {
            Clear();
            Cue();
            setTimeout(Clear, cuevisibletime);
            setTimeout(Stimulus, cuestarttostimulusstarttime);
            setTimeout(Clear, cuestarttostimulusstarttime+stimulusvisibletime);
        }
    }

    function Stimulus()
    {
        ctx.fillStyle = 'white';
        var t = trials[current];
        var l = letters[t.l];
        var pt = positions[t.p];
        ctx.fillText(l, pt.x, pt.y);
        responded = false;
        startTime = Date.now();
        /*for (var i=0; i<positions.length; i++)
        {
            var l = letters[Math.floor(Math.random() * letters.length)];
            var pt = positions[i];
            ctx.fillText(l, pt.x, pt.y);
        }*/
    }
    function Cue()
    {
        ctx.beginPath();
        ctx.fillStyle = '#00ff00';
        ctx.arc(midX, midY, 20, 0, 2 * Math.PI);
        ctx.fill();
    }
    function Clear()
    {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(midX, midY, 5, 0, 2 * Math.PI);
        ctx.fill();
        //ctx.fillText(correct + ' ' + missed + ' ' + wrong, 100, 550);
    }
    function SaveResults(resp)
    {
        responded = true;
        var endTime = Date.now();
        var t = trials[current];
        if (t.pre)
        {
            results.Number.push('PRE');
            results.Time.push(0);
            results.KeyResponse.push('-');
        }
        else
        {
            results.Number.push(t.id);
            results.Time.push(endTime - startTime);
            results.KeyResponse.push(resp);
        }
        console.log(current + ' ' + resp) ;
    }
    var Finish = function()
    {
        if ($("#main_canvas__ID").is(':hidden')) //hacky and ugly way :(
            return;
        if (!finished)
        {
            finished = true;
            
            responce.NNO = results.Number.join(",");
            responce.NRT = results.Time.join(",");
            responce.NAC = results.KeyResponse.join(",");
            callback(responce);
        }
    }
    $(document).keypress(function(e){
        if ($("#main_canvas__ID").is(':hidden')) //hacky and ugly way :(
            return;
        if (!responded)
        {
            var t = trials[current];
            var rt = trials[ReferenceTrial(current)];
            var key = e.key.toLowerCase();
            console.log(key)
            if (key == 'm')
            {
                if (rt.p == t.p)
                    SaveResults('CM');
                else
                    SaveResults('FN');
            }
            if (key == 'n')
            {
                if (rt.p == t.p)
                    SaveResults('FM');
                else
                    SaveResults('CN');
            }
            if (key != 'n' && key != 'm') SaveResults('W');
        }
        e.preventDefault();
    });
    Instructions();
    $('.start-button').on('click',function(){
        Start();
    });
    //------------------------------------
}
//-------------------------------------
function standardDeviation(values){
    var avg = average(values); 
    var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });
    var avgSquareDiff = average(squareDiffs)*values.length/(values.length-1);
    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}
//-------------------------------------
function median(values){
    if(values.length ===0) return 0;
    values.sort(function(a,b){
        return a-b;
    });
    var half = Math.floor(values.length / 2);
    if (values.length % 2){
        return values[half]/1.0;
    }
    return ((values[half - 1])/1.0 + (values[half])/1.0) / 2.0;
}            
//-------------------------------------
function average(data){
    var sum = data.reduce(function(sum, value){
        return sum + Math.abs(value);
    }, 0);
    var avg = sum / data.length;
    return avg;
}
//-------------------------------------
function getmin(values){
    values.sort(function(a, b){return b - a})
    return values[values.length-1];
}
//-------------------------------------
function getmax(values){
    values.sort(function(a, b){return b - a})
    return values[0];
}
//-------------------------------------
function top10pc(values){
    if(values.length ===0) return 0;
    values.sort(function(a,b){
        return a-b;
    });
    var tenpc = Math.round(values.length / 10);
    return values.slice(0,tenpc);
}            
//-------------------------------------
function bottom10pc(values){
    if(values.length ===0) return 0;
    values.sort(function(a,b){
        return a-b;
    });
    var tenpc = Math.round(values.length / 10);
    return values.slice(values.length-tenpc-1,values.length);
}            
//------------------------------------
