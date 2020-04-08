module.exports = function(options) {

    var id = 0;

    this.add('role:wr,cmd:get', function (msg, respond) {

        if (msg.id != null){
            this.make( 'work' ).load$(msg.id, function( err, result ) {
                if( err ) return respond( null,{success:false,data:err} )

                respond(null,{success:true,data:result})
            })
        }
        else {
           this.make("work").list$( {}, function(err,list){
               respond(null,list)
           })
        }


    })
    this.add('role:wr,cmd:create', function (msg, respond) {
        console.log(msg.args.body.applicant)
        let applicant = msg.args.body.applicant;
        let work_decription =  msg.args.body.work;
        if (applicant!= null && work_decription!=null){
            id = id+1;
            var work = {id:id , applicant:applicant, work:work_decription,etat:'created'}
            this.make('work').data$(work).save$(respond)

        }
        else {
            respond(null, {success:false,msg:"Erreur sur la saisie des informations",data: works})
        }


    })
    this.add('role:wr,cmd:update', function (msg, respond) {
        if (msg.id != null && msg.work!=null){

            this.make$('work').load$(msg.id,function (err,result) {
                if(result.etat != "closed"){
                    result.data$({work:msg.work,etat:"closed"}).save$(respond);
                }
                else{
                    respond(null,{success:false,msg:"Travaille Cloturer",data: ""})
                }
            })
        }
        else {
            respond(null, {success:false,msg:"Erreur sur la saisie des informations",data: ""})
        }

    })
    this.add('role:wr,cmd:delete', function (msg, respond) {


        if (msg.id != null){


            this.make( 'work' ).remove$({id:msg.id,etat:"closed"}, function (err) {
                respond(err)
            } )
        }


    })

}
