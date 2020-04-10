/**
 * le plugin qui gère les "wr"
 * @param options
 */
module.exports = function(options) {

    var id = 0; // variable qui permet d'avoir un identifiant unique et croissant

    /**
     * methode qui permet d'afficher les "wr" d'un applicant si rentre en parametre id
     * sinon retour tout les "wr"
     * ex : https://localhost:3000/api/wr/2 ou ex : https://localhost:3000/api/wr
     * METHOD : GET
     */
    this.add('role:wr,cmd:get', function (msg, respond) {

        if( msg.args === undefined){ // verification lorsque stats appel la methode, sans args.

            //retour tout la liste pour stats
            this.make("work").list$( {}, function(err,list){
                respond(null,{success:true,data:list})
            })

        }else{
            // retour tout les wr si rien a été saisie en paramétre
            if( Object.getOwnPropertyNames(msg.args.params).length === 0 ){

                this.make("work").list$( {}, function(err,list){
                    respond(null,{success:true,data:list})
                })
            }else {

                let id = Number(msg.args.params.id); // transforme l' id en un nombre car il est une chaine de caractère

                this.make( 'work' ).load$(id, function( err, result ) {
                    if( err ) return respond( null,{success:false,data:err})

                    if (result === null){
                        respond(null,{success:false,msg:"id not found"}) // si result est tourjours vide c'est à dire que l'id est pas trouver
                    }

                    respond(null,{success:true,data:[result]} )

                })
            }
        }
    })

    /**
     * cette methode gère la creation des "wr"
     * retour le "wr" creer
     * ex : https://localhost:3000/api/wr
     * METHOD : POST
     */
    this.add('role:wr,cmd:create', function (msg, respond) {
        // on recupere les valeurs envoyé
        let applicant = msg.args.body.applicant;
        let work_decription =  msg.args.body.work;

        if (applicant!= null && work_decription!=null){

            id = id+1; // je incremente pour chaque création

            var work = {id:id , applicant:applicant, work:work_decription,state:'created',date_souhaite:null,date_effective:null} // je crée un objet et le remplis de tout les données

            this.make('work').data$(work).save$(function (err,result) {
                // notifie les stats pour une creation et envoie le nom de l'applicant
                this.act('role:stats,cmd:create',{applicant:applicant},function (err,fe) {
                    if (err) respond(err)
                });

                respond(null,{success:true,data:[result]})
            })

        }
        else {
            respond(null, {success:false,msg:"Erreur sur la saisie des informations"})
        }
    })

    /**
     * cette methode gère la modification d'un wr
     * retourne le wr modifier
     * id est obligatoire
     * ex : https://localhost:3000/api/wr/2
     * METHOD : PUT
     */
    this.add('role:wr,cmd:update', function (msg, respond) {
        // on recupere les valeurs envoyé
        let id = msg.args.params.id;
        let work = msg.args.body.work;
        let state = msg.args.body.state;

        if( id === undefined){
            // retourne un msg d'erreur si l'id est pas fourni
            respond({success:false,msg:"wr id not provided"})
        }
        else {
            if (isNaN(id)){
                // retourne un msg d'erreur si l'id n'est pas un NUMBER
                respond({success:false,msg:"wr not found"})
            }
            else{
                this.make$('work').load$(Number(id),function (err,result) {
                    if (err) respond({success:false,msg:"wr not found"})

                    if(result.state != "closed"){ // verifie si l'etat de la wr n'est pas closed

                        if (work != null){ // verifie le work est envoie ou pas.

                            result.data$({work:work}).save$(function (err,resultat) {
                                respond(null,{success:true,data:[resultat]})
                            });
                        }else {
                            result.data$({state:state}).save$(function (err,resultat) {

                                // notifie les stats que le wr est closed et envoi qui s'est
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
    /**
     * cette methode gère la suppresion d'un wr si l'id n'est pas saisie supprime tout les wr !!! "non closed" !!!
     * retourne le wr supprimée
     *  ex : https://localhost:3000/api/wr/2 ou https://localhost:3000/api/wr
     * METHOD : DEL
     */
    this.add('role:wr,cmd:delete', function (msg, respond) {

        let id = Number(msg.args.params.id);

        // verifie si l'id envoyé est bien saisie
        if (!isNaN(id)){
            this.make$('work').load$(id,function (err,result) {
                if(result.state != "closed"){ // verifie si l'etat de la wr est closed

                    result.remove$({id:id}, function (err) {

                        // notifie le stat d'une suppresion d'un wr et envoi qui s'est
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
            // si aucun paramtre est saisie supprime tout les created
            if(Object.getOwnPropertyNames(msg.args.params).length === 0){
                this.make$('work').remove$( {state:"created"},function (err) {
                    if (err) respond(err)

                    // notifie le stat d'une suppresion des wr created
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


