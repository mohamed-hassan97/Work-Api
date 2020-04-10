module.exports = function(options) {

    var id = 0;
    var test = 0;
    this.add('role:stats,cmd:create', function (msg, respond) {
        let applicant = msg.applicant;
        if (applicant!= undefined){
            this.make('stats').load$({applicant:applicant},function (err,result) {

                if(result != null){
                    var temp1 = result.stats_wr_created;
                    temp1++;
                    var temp2 = result.stats_wr_opened;
                    temp2++;
                    var temp3 = result.stats_wr_closed;
                    temp3++;
                    var work = {applicant:applicant, stats_wr_created:temp1,stats_wr_opened:temp2,stats_wr_closed:temp3}
                    this.make('stats').data$(work).save$(function (err,result) {
                        respond(null,{success:true,data:[result]})
                    })
                }else {
                    var work = {applicant:applicant, stats_wr_created:1,stats_wr_opened:1,stats_wr_closed:0}
                    this.make('stats').data$(work).save$(function (err,result) {
                        respond(null,{success:true,data:[result]})
                    })
                }

            })

        }
        else {
            respond(null, {success:false,msg:"Erreur sur la saisie des informations"})
        }


    })
    this.add('role:stats,cmd:update', function (msg, respond) {
        let applicant = msg.applicant;
        if (applicant!= undefined){
            this.make('stats').load$({applicant:applicant},function (err,result) {

                    var temp2 = result.stats_wr_opened;
                    temp2--;
                    var temp3 = result.stats_wr_closed;
                    temp3++;
                    var work = {stats_wr_opened:temp2,stats_wr_closed:temp3}
                    result.data$(work).save$(function (err,result) {
                        respond(null,{success:true,data:[result]})
                    })
            })

        }
        else {
            respond(null, {success:false,msg:"Erreur sur la saisie des informations"})
        }


    })
    this.add('role:stats,cmd:delete', function (msg, respond) {
        let applicant = msg.applicant;
        console.log(msg)
        if (applicant != undefined){
            this.make('stats').load$({applicant:applicant},function (err,result) {
                //console.log("update of ",applicant,"==",result)
                var temp2 = result.stats_wr_opened;
                temp2--;

                var work = {stats_wr_opened:temp2}
                result.data$(work).save$(function (err,result) {
                    respond(null,{success:true,data:[result]})
                })
            })

        }
        else {
            this.make('stats').list$({stats_wr_closed:0},function (err,result) {
                console.log("delete of ",applicant,"==",result)
                var work = {stats_wr_opened:0}
                result.forEach(function (item) {
                    item.data$(work).save$(function (err,result) {
                        respond(null,{success:true,data:[result]})
                    })
                })

            })
        }


    })
    this.add('role:stats,cmd:get', function (msg, respond) {
        var applicant = msg.args.params.applicant;

            if(applicant != undefined){
                this.make("stats").list$( {applicant:applicant}, function(err,list){
                    respond({success:true,data:list[0]})
                })
            }
            else{
                this.make("stats").list$( {}, function(err,list){
                    var opened = 0;
                    var created=0;
                    var closed =0;
                    list.forEach(function (item) {

                        opened=opened+item.stats_wr_opened;
                        closed=closed+item.stats_wr_closed;
                        created=created+item.stats_wr_created;
                    })
                    respond(null,{success:true,data:{
                            global_stats_wr_created:created,
                            global_stats_wr_opened:opened,
                            global_stats_wr_closed:closed
                        }})
                })
            }




    })

    /*seneca.add('role:wr,cmd:stats', function (msg, respond) {

        var applicant=msg.args.params.applicant;
        test++;
        //console.log("applicant",test++,msg.args.params.applicant);
        if(applicant === undefined){
            seneca.act('role:wr,cmd:get',function (err,result) {
                var closed = 0;
                var created = 0;
                var opened = 0;
                result.data.forEach(function (item) {

                    if(item.state == "closed"){
                        closed++;
                    }
                    created = item.id;

                })
                console.log("je rentre ici",test)
                opened = result.data.length - closed;
                respond({success:true,data:{
                        global_stats_wr_created:created,
                        global_stats_wr_opened:opened,
                        global_stats_wr_closed:closed
                    }
                });
                //respond(result)
            })
        }else{
            seneca.act('role:wr,cmd:get',{applicant:applicant},function (err,result) {
                var closed = 0;
                var created = 0;
                var opened = 0;
                result.data.forEach(function (item) {

                    if(item.state == "closed"){
                        closed++;
                        opened--;
                    }
                    created++

                })
                opened = result.data.length - closed;
                respond({success:true,data:{
                        applicant:applicant,
                        stats_wr_created:created,
                        stats_wr_opened:opened,
                        stats_wr_closed:closed
                    }
                });
                //respond(result)
            })
        }


    })*/


}


