var express = require('express');
var router = express.Router();

// todos os dados são carregados no load
data_2012 = require('../models/2012')();
data_2013 = require('../models/2013')();
data_2014 = require('../models/2014')();
data_total = data_2012.concat(data_2013).concat(data_2014);


//realizando reduce para otimizar perfomance em consultas posteriores




function formatData(list){
        //"orgao":"RÁDIO E TELEVISÃO ESPÍRITO SANTO ",
        //"favorecido":"CESAN-COMP.ESP.SANTENSE DE SANEAMENTO",
        //"strdescricaoelementodespesa":"OUTROS SERVICOS DE TERCEIROS-PESSOA JURIDICA",
        //"strdescricaosubelementodespesa":"SERVICOS DE AGUA E ESGOTO                    ",
        //"strnomeprograma":"APOIO ADMINISTRATIVO",
        //"strfonterecurso":"RECURSOS ORDINARIOS                          ",
        //"strnomeacao":"ADMINISTRACAO DA UNIDADE ",
        //"datdocumento":"2012-11",
        //"despesa_repasse":"DESPESA",
        //"valor_empenhado":0,
        //"valor_liquidacao":0,
        //"valor_pago":342.6,
        //"mes_descritivo":"11 - Novembro",
        //"ano":2012  
     //var ret = { "ano" :
     //}
    
}



router.get('/data/:ano', function(req, res, next) {
    var year = req.param('ano');
    
    if  (year == '2012'){
        res.json(data_2012);
        
    } else if  (year == '2013'){
        res.json(data_2013);
        
    }else if  (year == '2014'){
        res.json(data_2014);
        
    }else{
        res.json(data_total);
        
    }
});



router.get('/data', function(req, res, next) {
    soma = 0;
    data_base.forEach(function(el) {
        soma = soma + el.valor_pago;
    });
    
    res.json(data_total);
});






/* GET home page. */
router.get('/', function(req, res, next) {
  var data = require('../models/2012')();
    
  res.render('index', { title: 'Express' });
});

module.exports = router;
