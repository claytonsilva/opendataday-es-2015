_ = require("underscore")





var express = require('express');
var router = express.Router();

// todos os dados são carregados no load
data_2012 = require('../models/2012')();
data_2013 = require('../models/2013')();
data_2014 = require('../models/2014')();
data_total = data_2012.concat(data_2013).concat(data_2014);


// agrupando datas
_.groupByMulti = function (obj, values, context) {
    if (!values.length)
        return obj;
    var byFirst = _.groupBy(obj, values[0], context),
        rest = values.slice(1);
    for (var prop in byFirst) {
        byFirst[prop] = _.groupByMulti(byFirst[prop], rest, context);
    }
    return byFirst;
};

// quebra o resultado em periodos
function toPeriodList(list) {
    var periodos = [];
    var l_periodos = _.groupBy(list, 'datdocumento');
    for (var periodo  in l_periodos) {
        var reg_periodo = {};
        
        reg_periodo.datdocumento = function(){
            var saida = periodo.split('-');
            return saida[1] + ' ' + saida[0];
        }();
        reg_periodo.valor_empenhado = _(l_periodos[periodo]).reduce(function (m, x) {
            return m + x.valor_empenhado;
        }, 0);
        reg_periodo.valor_pago = _(l_periodos[periodo]).reduce(function (m, x) {
            return m + x.valor_pago;
        }, 0);

        periodos.push(reg_periodo)
    }
    
    return _.sortBy(periodos,'datdocumento');
}

function sumValue_empenhado (list){
    return _(list).reduce(function(m,x) {return m + x.valor_empenhado; }, 0);
}

function sumValue_pago (list){
    return _(list).reduce(function(m,x) {return m + x.valor_pago; }, 0);
}


function formatDataByOrgao(list,top){

    var l_ano =  _.groupBy(list,'ano');
    var xreturn_ano = [];
    
    for (var ano in l_ano){

        var reg_ano = {};
        reg_ano.ano = ano;
        reg_ano.valor_empenhado = sumValue_empenhado(l_ano[ano]);
        reg_ano.valor_pago = sumValue_pago(l_ano[ano]);

        reg_ano.orgaos = function(){
            var l_g_orgao = _.groupBy(l_ano[ano],'orgao');
            var xreturn_orgao = [];
            for (var orgao in l_g_orgao ){

                var reg_orgao = {};
                reg_orgao.orgao = orgao.trim();
                reg_orgao.valor_empenhado = sumValue_empenhado(l_g_orgao[orgao]);
                reg_orgao.valor_pago = sumValue_pago(l_g_orgao[orgao]);
                reg_orgao.periodos = toPeriodList(l_g_orgao[orgao]);


                reg_orgao.favorecidos = function () {
                    // agrupamento por favorecidos
                    var l_g_favorecido = _.groupBy(l_g_orgao[orgao],'favorecido');
                    var xreturn_favorecido = [];
                    for (var favorecido in l_g_favorecido){
                        var reg_favorecido = {};
                        reg_favorecido.favorecido = favorecido.trim();
                        reg_favorecido.valor_empenhado = sumValue_empenhado(l_g_favorecido[favorecido]);
                        reg_favorecido.valor_pago = sumValue_pago(l_g_favorecido[favorecido]);
                        reg_favorecido.periodos = toPeriodList(l_g_favorecido[favorecido]);
                        xreturn_favorecido.push(reg_favorecido);
                    }
                    return _.sortBy(xreturn_favorecido,'favorecido');
                }();


                reg_orgao.acoes = function () {
                    // agrupamento por favorecidos
                    var l_g_acao = _.groupBy(l_g_orgao[orgao],'strnomeprograma');
                    var xreturn_acao = [];
                    for (var acao in l_g_acao){
                        var reg_acao = {};
                        reg_acao.acao = acao.trim();
                        reg_acao.valor_empenhado = sumValue_empenhado(l_g_acao[acao]);
                        reg_acao.valor_pago = sumValue_pago(l_g_acao[acao]);
                        reg_acao.periodos = toPeriodList(l_g_acao[acao]);
                        xreturn_acao.push(reg_acao);
                    }
                    return _.sortBy(xreturn_acao,'strnomeprograma');
                }();

                xreturn_orgao.push(reg_orgao);
            }

            //filtrando os orgaos restritos aos top n elementos
            return _.sortBy(xreturn_orgao,'valor_pago').reverse();

        }();

        reg_ano.orgaos =   (top)? reg_ano.orgaos.slice(0,top) : reg_ano.orgaos;
        
        xreturn_ano.push(reg_ano)
        
    } 
    


    return xreturn_ano;
}


function formatDataByFavorecido(list,top){

    var l_ano =  _.groupBy(list,'ano');
    var xreturn_ano = [];

    for (var ano in l_ano){

        var reg_ano = {};
        reg_ano.ano = ano;
        reg_ano.valor_empenhado = sumValue_empenhado(l_ano[ano]);
        reg_ano.valor_pago = sumValue_pago(l_ano[ano]);

        reg_ano.favorecidos = function(){
            var l_g_favorecido = _.groupBy(l_ano[ano],'favorecido');
            var xreturn_favorecido = [];
            for (var favorecido in l_g_favorecido ){

                var reg_favorecido = {};
                reg_favorecido.favorecido = favorecido.trim();
                reg_favorecido.valor_empenhado = sumValue_empenhado(l_g_favorecido[favorecido]);
                reg_favorecido.valor_pago = sumValue_pago(l_g_favorecido[favorecido]);
                reg_favorecido.periodos = toPeriodList(l_g_favorecido[favorecido]);



                reg_favorecido.orgaos = function () {
                    // agrupamento por orgaos
                    var l_g_orgao = _.groupBy(l_g_favorecido[favorecido],'orgao');
                    var xreturn_orgao = [];
                    for (var orgao in l_g_orgao){
                        var reg_orgao = {};
                        reg_orgao.orgao = orgao.trim();
                        reg_orgao.valor_empenhado = sumValue_empenhado(l_g_orgao[orgao]);
                        reg_orgao.valor_pago = sumValue_pago(l_g_orgao[orgao]);
                        reg_orgao.periodos = toPeriodList(l_g_orgao[orgao]);
                        xreturn_orgao.push(reg_orgao);
                    }
                    return _.sortBy(xreturn_orgao,'favorecido');
                }();


                reg_favorecido.acoes = function () {
                    // agrupamento por acoes
                    var l_g_acao = _.groupBy(l_g_favorecido[favorecido],'strnomeprograma');
                    var xreturn_acao = [];
                    for (var acao in l_g_acao){
                        var reg_acao = {};
                        reg_acao.acao = acao.trim();
                        reg_acao.valor_empenhado = sumValue_empenhado(l_g_acao[acao]);
                        reg_acao.valor_pago = sumValue_pago(l_g_acao[acao]);
                        reg_acao.periodos = toPeriodList(l_g_acao[acao]);
                        xreturn_acao.push(reg_acao);
                    }
                    return _.sortBy(xreturn_acao,'strnomeprograma');
                }();


                

                xreturn_favorecido.push(reg_favorecido);
            }

            //filtrando os orgaos restritos aos top n elementos
            return _.sortBy(xreturn_favorecido,'valor_pago').reverse();

        }();

        reg_ano.favorecidos =   (top)? reg_ano.favorecidos.slice(0,top) : reg_ano.favorecidos;

        xreturn_ano.push(reg_ano)

    }



    return xreturn_ano;
}



function formatDataByAcao(list,top){

    var l_ano =  _.groupBy(list,'ano');
    var xreturn_ano = [];

    for (var ano in l_ano){

        var reg_ano = {};
        reg_ano.ano = ano;
        reg_ano.valor_empenhado = sumValue_empenhado(l_ano[ano]);
        reg_ano.valor_pago = sumValue_pago(l_ano[ano]);

        reg_ano.acoes = function(){
            var l_g_acao = _.groupBy(l_ano[ano],'strnomeprograma');
            var xreturn_acao = [];
            for (var acao in l_g_acao ){

                var reg_acao = {};
                reg_acao.acao = acao.trim();
                reg_acao.valor_empenhado = sumValue_empenhado(l_g_acao[acao]);
                reg_acao.valor_pago = sumValue_pago(l_g_acao[acao]);
                reg_acao.periodos = toPeriodList(l_g_acao[acao]);



                reg_acao.orgaos = function () {
                    // agrupamento por orgaos
                    var l_g_orgao = _.groupBy(l_g_acao[acao],'orgao');
                    var xreturn_orgao = [];
                    for (var orgao in l_g_orgao){
                        var reg_orgao = {};
                        reg_orgao.orgao = orgao.trim();
                        reg_orgao.valor_empenhado = sumValue_empenhado(l_g_orgao[orgao]);
                        reg_orgao.valor_pago = sumValue_pago(l_g_orgao[orgao]);
                        reg_orgao.periodos = toPeriodList(l_g_orgao[orgao]);
                        xreturn_orgao.push(reg_orgao);
                    }
                    return _.sortBy(xreturn_orgao,'favorecido');
                }();


                reg_acao.favorecidos = function () {
                    // agrupamento por favorecidos
                    var l_g_favorecido = _.groupBy(l_g_acao[acao],'favorecido');
                    var xreturn_favorecido = [];
                    for (var favorecido in l_g_favorecido){
                        var reg_favorecido = {};
                        reg_favorecido.favorecido = favorecido.trim();
                        reg_favorecido.valor_empenhado = sumValue_empenhado(l_g_favorecido[favorecido]);
                        reg_favorecido.valor_pago = sumValue_pago(l_g_favorecido[favorecido]);
                        reg_favorecido.periodos = toPeriodList(l_g_favorecido[favorecido]);
                        xreturn_favorecido.push(reg_favorecido);
                    }
                    return _.sortBy(xreturn_favorecido,'favorecido');
                }();

                




                xreturn_acao.push(reg_acao);
            }

            //filtrando os orgaos restritos aos top n elementos
            return _.sortBy(xreturn_acao,'valor_pago').reverse();

        }();

        reg_ano.acoes =   (top)? reg_ano.acoes.slice(0,top) : reg_ano.acoes;

        xreturn_ano.push(reg_ano)

    }



    return xreturn_ano;
}







router.get('/api/despesas/orgao', function(req, res, next) {
    var year = req.param('ano');
    var top = req.param('top');
    
    if  (year == '2012'){
        res.json(formatDataByOrgao(data_2012,top));
    } else if  (year == '2013'){
        res.json(formatDataByOrgao(data_2013,top));
    }else if  (year == '2014'){
        res.json(formatDataByOrgao(data_2014,top));
    }
    else if  (!year){
        res.json(formatDataByOrgao(data_total,top));
    } else{
        res.json({"msg" : "Ano não disponível"});
    }
});


router.get('/api/despesas/favorecido', function(req, res, next) {
    var year = req.param('ano');
    var top = req.param('top');

    if  (year == '2012'){
        res.json(formatDataByFavorecido(data_2012,top));
    } else if  (year == '2013'){
        res.json(formatDataByFavorecido(data_2013,top));
    }else if  (year == '2014'){
        res.json(formatDataByFavorecido(data_2014,top));
    }
    else if  (year == '2015'){
        res.json(formatDataByFavorecido(data_2015,top));
    } else{
        res.json(formatDataByFavorecido(data_total,top));
    }
});


router.get('/api/despesas/acao', function(req, res, next) {
    var year = req.param('ano');
    var top = req.param('top');

    if  (year == '2012'){
        res.json(formatDataByAcao(data_2012,top));
    } else if  (year == '2013'){
        res.json(formatDataByAcao(data_2013,top));
    }else if  (year == '2014'){
        res.json(formatDataByAcao(data_2014,top));
    }
    else if  (year == '2015'){
        res.json(formatDataByAcao(data_2015,top));
    } else{
        res.json(formatDataByAcao(data_total,top));
    }
});



router.get('/help', function(req, res, next) {
    res.render('help', { title: 'Ajuda' });
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('help', { title: 'Ajuda' });
});

module.exports = router;
