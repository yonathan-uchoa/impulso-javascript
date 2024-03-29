// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction

let apiKey:string = 'bb0e5cab69c4b3502ab1a75cd9c7f371';
let requestToken: string;
let username: string;
let password: string;
let sessionId: number;
let listId = '7101979';

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let logoutButton = document.getElementById('logout-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button') as HTMLButtonElement
let searchContainer = document.getElementById('search-container') as HTMLDivElement;
let loginContainer = document.getElementById('login-container') as HTMLDivElement;
let logoutContainer = document.getElementById('logout-container') as HTMLDivElement;


type http = {
  url: string;
  method: string;
  body?: any;
}

if (loginButton){
  loginButton.addEventListener('click', async () => {
    await criarRequestToken();
    await logar();
    await criarSessao();
  })
}

if (logoutButton){
  logoutButton.addEventListener('click', () =>{
    fecharSessao();
  })
}

searchButton?.addEventListener('click', async () => {
  let lista = document.getElementById("lista") as HTMLInputElement;
  if (lista) {
    lista.outerHTML = "";
  }
  let query = (document.getElementById('search') as HTMLInputElement).value;
  let listaDeFilmes = await procurarFilme(query);
  let ul = document.createElement('ul');
  ul.id = "lista"
  ul.style.display = 'wrap'
  if(listaDeFilmes?.results){
    for (const item of listaDeFilmes.results) {
      let li = document.createElement('li')
      let adicionar = document.createElement('button')
      adicionar.innerHTML = 'Adicionar';
      adicionar.addEventListener('click', () => {
        adicionar.style.display = 'none';
      })
      li.style.display = 'flex'
      li.style.margin = '5px'
      li.appendChild(document.createTextNode(item.original_title))
      li.appendChild(adicionar)
      ul.appendChild(li)
      console.log(listaDeFilmes);
      searchContainer.appendChild(ul);
    }
  }
})
function preencherSenha() {
  password = (document.getElementById('senha') as HTMLInputElement).value;
  validateLoginButton();
}

function preencherLogin() {
  username =  (document.getElementById('login') as HTMLInputElement).value;
  validateLoginButton();
}

function preencherApi() {
  apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

class HttpClient {
  static async get({url, method, body = null}:http) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(query: string): Promise<any> {
  query = encodeURI(query)
  const result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })
  return result as any
  console.log(result)

}

async function adicionarFilme(filmeId: number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: "GET"
  })
  console.log(result);
}

async function criarRequestToken () {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  }) as any
  requestToken = result.request_token
  
  
}

async function logar() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  }) as any
  console.log(result)
}

async function criarSessao() {
  try { 
    let result = await HttpClient.get({
      url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
      method: "GET"
    }) as any;
    console.log(result)  
    sessionId = result.session_id;
    loginContainer.style.display = 'none';
    logoutContainer.style.display = 'flex';
  } catch (e){
    console.log(e);
  }
}

function fecharSessao(){
  logoutContainer.style.display = 'none';
  loginContainer.style.display = 'flex';
}

async function criarLista(nomeDaLista: string, descricao: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  })
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId: number, listaId: number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
  console.log(result);
}