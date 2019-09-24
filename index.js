const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'senha',
        database: 'contabilidade'
    }
})

const obj = JSON.parse(fs.readFileSync('database.json', 'utf8'));

const buscaTotalCurso = async (whereParam) => {
    const [result] = await knex('pesquisa').count('curso as total').where({ 'curso': whereParam })
    return result.total
}

app
    .get('/', (req, res) => res.render('home', { obj }))
    .post('/', async (req, res) => {
        try {
            await knex('pesquisa').insert(req.body)
            res.redirect('/success')
        } catch (e) {
            res.send('Ocorreu um erro. Cadastre Novamente.')
        }
    })
    .get('/success', (req, res) => res.render('success'))
    .get('/lista', async (req, res) => {
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
    })

app.listen(80, () => console.log('Running...'))