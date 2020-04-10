module.exports = function(options) {

    var id = 0;
    var test = 0;

    this.add('role:wr,cmd:get', function (msg, respond) {

        if( msg.args === undefined){

            this.make("work").list$( {}, function(err,list){
                respond(null,{success:true,data:list})
            })

        }else{
            if( Object.getOwnPropertyNames(msg.args.params).length === 0 ){

                this.make("work").list$( {}, function(err,list){
                    respond(null,{success:true,data:list})
                })
            }else {
                let id = Number(msg.args.params.id);
                this.make( 'work' ).load$(id, function( err, result ) {
                    if( err ) return respond( null,{success:false,data:err})
                    respond(null,{success:true,data:[result]} )

                })
            }
        }



    })
    this.add('role:wr,cmd:create', function (msg, respond) {
        let applicant = msg.args.body.applicant;
        let work_decription =  msg.args.body.work;
        if (applicant!= null && work_decription!=null){
            id = id+1;
            var work = {id:id , applicant:applicant, work:work_decription,state:'created',date_souhaite:null,date_effective:null}
            this.make('work').data$(work).save$(function (err,result) {

                this.act('role:stats,cmd:create',{applicant:applicant},function (err,fe) {
                    if (err) respond(err)
                });
                respond(null,{success:true,data:[result]})
            })

        }
        else {
            respond(null, {success:false,msg:"Erreur sur la saisie des informations",data: works})
        }


    })
    this.add('role:wr,cmd:update', function (msg, respond) {
        let id = msg.args.params.id;
        let work = msg.args.body.work;
        let state = msg.args.body.state;
        if( id === undefined){
            respond({success:false,msg:"wr id not provided"})
        }
        else {
            if (isNaN(id)){
                respond({success:false,msg:"wr not found"})
            }
            else{
                this.make$('work').load$(Number(id),function (err,result) {
                    if (err) respond({success:false,msg:"wr not found"})
                    if(result.state != "closed"){
                        if (work != null){
                            result.data$({work:work}).save$(function (err,resultat) {
                                respond(null,{success:true,data:[resultat]})
                            });
                        }else {
                            result.data$({state:state}).save$(function (err,resultat) {
                                this.act('role:stats,cmd:update',{applicant:result.applicant},function (err,fe) {
                                    if (err) respond(err)
                                });
                                respond(null,{success:true,data:[resultat]})
                            });
                        }

                    }
                    else{
                        respond(null,{success:false,msg:"wr is already closed"})
                    }
                })
            }
        }


    })
    this.add('role:wr,cmd:delete', function (msg, respond) {

        console.log(msg)
        let id = Number(msg.args.params.id);
        if (!isNaN(id)){
            this.make$('work').load$(id,function (err,result) {
                if(result.state != "closed"){
                    result.remove$({id:id}, function (err) {
                        this.act('role:stats,cmd:delete',{applicant:result.applicant},function (err,fe) {
                            if (err) respond(err)
                        });
                        respond(null,{success:true,data:[result]})
                    } )
                }
                else {
                    respond({success:false,msg:"wr is already closed"})
                }
            })

        }else{
                if(Object.getOwnPropertyNames(msg.args.params).length === 0){
            this.make$('work').remove$( {state:"created"},function (err) {
                if (err) respond(err)
                this.act('role:stats,cmd:delete',function (err,fe) {
                    if (err) respond(err)
                });
                respond(null,{success:true})
            } )
            }else{
                respond(null,{success:false,msg:"wr not found"})
            }

        }
    })

}
