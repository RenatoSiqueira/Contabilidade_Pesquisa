const obj = require('./database')

var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.host || '127.0.0.1',
        user: process.env.user || 'root',
        password: process.env.password || 'senha',
        database: process.env.database || 'contabilidade'
    }
})

const buscaTotalCurso = async (whereParam) => {
    const [result] = await knex('contabilidade').count('curso as total').where({ 'curso': whereParam })
    return result.total
}

const Home = (req, res) => res.render('home', { obj })

const SaveData = async (req, res) => {
    try {
        await knex('contabilidade').insert(req.body)
        res.redirect('/success')
    } catch (e) {
        res.send('Ocorreu um erro. Cadastre Novamente. ' + e)
    }
}

const Success = (req, res) => res.render('success')

const Charts = async (req, res) => {
    const item = {
        curso: {}
    }
    try {
        item.curso.Administracao = await buscaTotalCurso('Administracao')
        item.curso.Contabilidade = await buscaTotalCurso('Contabilidade')
        item.curso.Economia = await buscaTotalCurso('Economia')
        item.curso.Arquivologia = await buscaTotalCurso('Arquivologia')
        item.curso.Biblioteconomia = await buscaTotalCurso('Biblioteconomia')
        item.curso.ServicoSocial = await buscaTotalCurso('Serviço Social')
        item.curso.Turismo = await buscaTotalCurso('Turismo')
        item.values = [
            item.curso.Administracao,
            item.curso.Contabilidade,
            item.curso.Economia,
            item.curso.Arquivologia,
            item.curso.Biblioteconomia,
            item.curso.ServicoSocial,
            item.curso.Turismo
        ]
        item.labels = ["Administração", "Contabilidade", "Economia", "Arquivologia", "Biblioteconomia", "Servico Social", "Turismo"]
        res.render('lista', { item })
    } catch (e) {
        res.send('Ocorreu um erro.')
    }
}

module.exports = {
    Home,
    SaveData,
    Success,
    Charts
}