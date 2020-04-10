const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')
const Express = require('express')
const seneca = Seneca()
const BodyParser = require('body-parser')


var Routes = [
    {
        prefix: '/api/wr/stats', // creer une route vers stats
        pin: 'role:stats,cmd:*', // indique qu'il vas generer un json seneca pour les stats
        map: {
            get :{GET:true,name:'',suffix:'/:applicant?'} //  on peut acceder cette routes qu'avec une method GET où l'applicant est OPTIONNELLE
        }
    },
    {
        prefix: '/api/wr',// creer une route
        pin: 'role:wr,cmd:*',// indique qu'il vas generer un json seneca pour les work
        map: {
            get: {GET: true, name: '', suffix: '/:id?'}, // les requetes GET seront redigirer vers les cmd:get. L'id est OPTIONNELLE
            update: {PUT: true, name: '', suffix: '/:id?'},// les requetes PUT seront redigirer vers les cmd:update. L'id est OPTIONNELLE
            create: {POST: true, name: ''}, // les requetes POST seront redigirer vers les cmd:create.
            delete: {DELETE: true, name: '', suffix: '/:id?'} // les requetes DEL seront redigirer vers les cmd:delete. L'id est OPTIONNELLE
    }
}
];



seneca.use(SenecaWeb, {
    options: { parseBody: false }, // desactive l'analyseur JSON de Seneca
    routes: Routes,
    context: Express().use(BodyParser.json()),     // utilise le parser d'Express pour lire les donnees
    adapter: require('seneca-web-adapter-express') // des requetes PUT
})
seneca.use('entity')
seneca.client({      // ce module enverra les messages 'role:stats,cmd:*"
    port: 5000,   // sur le port 4000 qui est le port du microservice Stats
    pin:'role:stats,cmd:*'
})
seneca.client({      // ce module enverra les messages 'role:wr,cmd:*"
    port: 4000, // sur le port 4000 qui est le port du microservice works
    pin: 'role:wr,cmd:*',
})

// ecoute le port 3000
seneca.ready(() => {
    const app = seneca.export('web/context')()
    app.listen(3000)
})

