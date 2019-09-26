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

const TotalCursos = async () => {
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
        return item
    } catch (e) {
        console.log('Error..')
    }
}

const TotalCampo = async (campo, curso) => {
    const [result] = await knex.raw(`
    select ${campo} as item, count(${campo}) as result from contabilidade where 
    ${curso} GROUP BY ${campo}
    `)
    return result
}

const loopGroup = (item, renda = null) => {
    const result = {}
    result.value = item.map(i => i.result).join(',')
    result.label = item.map(i => renda ? i.item.replace(/,/g, '.') : i.item).join(',')
    result.label = result.label.replace(/,/g, '","')
    //console.log(result)
    return result
}

const Charts = async (req, res) => {
    const { id } = req.params
    let curso = `curso = 'Administração' or curso = 'Economia' or curso = 'Contabilidade'`
    if (id === 'icsa')
        curso = `curso = 'Arquivologia' or curso = 'Biblioteconomia' or curso = 'Servico Social' or curso = 'Turismo'`
    try {
        const turno = await TotalCampo('turno', curso)
        const sexo = await TotalCampo('sexo', curso)
        const idade = await TotalCampo('idade', curso)
        const planejamento = await TotalCampo('planejamento', curso)
        const valorrenda = await TotalCampo('valorrenda', curso)
        const usacartao = await TotalCampo('usacartao', curso)
        const inadimplente = await TotalCampo('inadimplente', curso)
        const teriacontrole = await TotalCampo('teriacontrole', curso)
        const chartTurn = loopGroup(turno)
        const chartSex = loopGroup(sexo)
        const chartIda = loopGroup(idade)
        const chartPlan = loopGroup(planejamento)
        const chartVal = loopGroup(valorrenda, 'renda')
        const chartUsa = loopGroup(usacartao)
        const chartIna = loopGroup(inadimplente)
        const chartTer = loopGroup(teriacontrole)
        res.render('resultados', {
            curso: id,
            turno,
            sexo,
            idade,
            planejamento,
            valorrenda,
            usacartao,
            inadimplente,
            teriacontrole,
            chartTurn,
            chartSex,
            chartIda,
            chartPlan,
            chartVal,
            chartUsa,
            chartIna,
            chartTer
        })
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