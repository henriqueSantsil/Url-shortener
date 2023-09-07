const conn = require('../db/conn')
const URL = require('../model/url')

//Insert no banco de dados
async function insertUrlDb(url, urlEncurtada) {

    try {
         // Crie um novo registro na tabela urls
        const newURL = await URL.create({
            url_origin: url,
            new_url: urlEncurtada,
            validade: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000), // Adiciona 15 dias à data atual
      });

      console.log('URL encurtada criada:', newURL.toJSON());
    } catch (error) {
        console.log(`Algo deu errado: ${error}`)
    }

}

async function shortenURL(req, res){
      var { url } = req.body;
      var shortUrl = shortener();
      var validade = await urlValida();
    
      while (validade.some((el) => el == shortUrl) == true) {
        shortUrl = shortener();
      }
    
      await insertUrlDb(url, shortUrl);
    
      res
        .send({
          newUrl: "http://localhost:3000/" + shortUrl,
        })
        .status(201);
    }

//Consulta no BD 
async function consultURL(req, res) {
    try {
        const url = await URL.findAll({
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({ url: url});

        return url

    } catch (error) {
        console.log(`Algo deu errado \n ${error}`)
    }
}

//Validar URL
async function urlValida() {

    const urls = await URL.findAll({
        order: [['createdAt', 'DESC']],
    });

    if (!urls) {
        // Tratar caso em que nenhum URL foi encontrado
        return [];
    }

    var url = urls.map(el => el.new_url)
    return url
}

function shortener() {
  var caracteres = [
    ["a", "e", "i", "o", "u", "q", "w", "e", "r", "t"],
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ];

  var comprimento = Math.random().toFixed(1) * 10;

  do {
    comprimento = Math.random().toFixed(1) * 10;
  } while (comprimento < 5 || comprimento > 10);

  var url = "";

  for (let i = 1; i <= comprimento; i++) {
    var index = Math.random().toFixed(1) * 10 - 1;
    do {
      (index = Math.random().toFixed(1) * 10) - 1;
    } while (index < 0 || index >= 10);

    var index2 = Math.random().toFixed(1) * 10;

    url += caracteres[index2 % 2][index];
  }

  return url;
}

async function deletURL(req, res){
    const new_url = req.params.new_url

    const url = await URL.findOne({
        where: {new_url: new_url}
    })
    
    if(!url){
        res.status(422).json({ message: 'A url não existe' })
        return
    }

    await URL.destroy({ where: { new_url: new_url} })
    res.status(200).json({ message: 'Link removido com sucesso' })
}

async function redirect(req, res){
   const new_url = req.params.new_url;

    try {
        const url = await URL.findOne({
            where: { new_url: new_url }
        });

        if (url) {
            // Se o URL for encontrado, redirecione para o URL original
            res.redirect(url.url_origin);
        } else {
            // Se o URL não for encontrado, retorne um erro 404
            res.status(404).json({ error: 'URL não encontrada' });
        }
    } catch (error) {
        console.log(`Algo deu errado \n ${error}`);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


module.exports = { consultURL, shortenURL, redirect, deletURL }