module.exports = function(options) {

    /**
     * cette methode gère les affichage des stats d'un applicant si le nom de l'applicant est saisie ou
     * retourne tout les stats (globale)
     * ex : https://localhost:3000/api/wr/stats/paule ou ex : https://localhost:3000/api/wr/stats
     * METHOD : GET
     */
    this.add('role:stats,cmd:get', function (msg, respond) {
        // recupere le nom de l'applicant
        var applicant = msg.args.params.applicant;

        // verifie si le nom de l'applicant est bien saisie.
        if(applicant != undefined){
            // retourne la statistique de l'applicant
            this.make("stats").list$( {applicant:applicant}, function(err,list){
                respond({success:true,data:list[0]})
            })
        }
        else{
            //retourne une statistique globale
            this.make("stats").list$( {}, function(err,list){
                // variable qui permettent de faire la somme totalbe
                var opened = 0;
                var created=0;
                var closed =0;
                // parcours la bd stats
                list.forEach(function (item) {
                    // fait une sommme pour chaque stats
                    opened=opened+item.stats_wr_opened;
                    closed=closed+item.stats_wr_closed;
                    created=created+item.stats_wr_created;
                })

                //retourne la reponse
                respond(null,{success:true,data:{
                        global_stats_wr_created:created,
                        global_stats_wr_opened:opened,
                        global_stats_wr_closed:closed
                    }})
            })
        }
    })
/**
 * cette methode est appel lors d'une creation d'un wr
 * elle n'est pas accessible en tant que tel et retourne rien
 */
    this.add('role:stats,cmd:create', function (msg, respond) {

        let applicant = msg.applicant;
        // verifie si l'applicant est envoi
        if (applicant!= undefined){
            this.make('stats').load$({applicant:applicant},function (err,result) {

                // verifie si s'est la 1ere creation
                if(result != null){
                    // incremment si l'applicant à dèjà des wr
                    var temp1 = result.stats_wr_created;
                    temp1++;
                    var temp2 = result.stats_wr_opened;
                    temp2++;
                    var temp3 = result.stats_wr_closed;
                    temp3++;
                    // remplis tout dans un objet
                    var work = {applicant:applicant, stats_wr_created:temp1,stats_wr_opened:temp2,stats_wr_closed:temp3}

                    this.make('stats').data$(work).save$(function (err,result) {
                        respond(null,{success:true,data:[result]})
                    })
                }else {
                    // initialise tout à 1
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

    /**
     * cette methode est appel lors d'une modification d'un wr
     * elle n'est pas accessible en tant que tel et retourne rien
     */
    this.add('role:stats,cmd:update', function (msg, respond) {

        let applicant = msg.applicant;
        // verifie si l'applicant est envoi
        if (applicant!= undefined){
            //recherche d'abord l'applicant avec load
            this.make('stats').load$({applicant:applicant},function (err,result) {

                    var temp2 = result.stats_wr_opened;
                    temp2--; // si l'etat à été modifie en closed alors l'openeed est DEC
                    var temp3 = result.stats_wr_closed;
                    temp3++; // si l'etat à été modifie en closed alors le closed est INC

                    // sauvegarde le changement
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
    /**
     * cette methode est appel lors d'une suppression d'un wr
     * elle n'est pas accessible en tant que tel et retourne rien
     */
    this.add('role:stats,cmd:delete', function (msg, respond) {
        let applicant = msg.applicant;
        // verifie si l'applicant est envoie
        if (applicant != undefined){
            //recherche l'applicant
            this.make('stats').load$({applicant:applicant},function (err,result) {

                var temp2 = result.stats_wr_opened;
                temp2--; // si on supprime un wr cad qu'il était en etat created. donc on decremente seulement le opened

                var work = {stats_wr_opened:temp2}
                // sauvegarde de la modifications
                result.data$(work).save$(function (err,result) {
                    respond(null,{success:true,data:[result]})
                })
            })

        }
        else {
            // tout les wr created sont supprimer cad que leur closed est à 0. Donc on recherche les stats avec closed = 0
            this.make('stats').list$({stats_wr_closed:0},function (err,result) {
                // met le opened à 0
                var work = {stats_wr_opened:0}

                // sauvegarder les modifications pour chacun
                result.forEach(function (item) {
                    item.data$(work).save$(function (err,result) {
                        respond(null,{success:true,data:[result]})
                    })
                })

            })
        }
    })

}


