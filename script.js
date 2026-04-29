// ==========================
// UTIL
// ==========================
function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function salvarUsuarios(lista) {
  localStorage.setItem("usuarios", JSON.stringify(lista));
}

function getTarefas() {
  return JSON.parse(localStorage.getItem("tarefas")) || [];
}

function salvarTarefas(lista) {
  localStorage.setItem("tarefas", JSON.stringify(lista));
}

// ==========================
// NOTIFICAÇÃO (REQ 2)
// ==========================
function notificar(msg) {
  alert(msg);
}

// ==========================
// LOGIN (REQ 3)
// ==========================
function fazerLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email) {
    notificar("O campo Email não pode ser nulo");
    return;
  }

  if (!senha) {
    notificar("O campo Senha não pode ser nulo");
    return;
  }

  const usuarios = getUsuarios();

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (!usuario) {
    notificar("Email ou senha inválidos");
    return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  notificar("Login realizado com sucesso");

  window.location.href = "dashboard.html";
}

// ==========================
// CADASTRO (REQ 4)
// ==========================
function cadastrarUsuario(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  // Nome: mínimo 5 + espaço
  if (nome.length < 5 || !nome.includes(" ")) {
    notificar("Nome deve ter pelo menos 5 caracteres e sobrenome");
    return;
  }

  // Email válido
  const regexEmail = /^[^\s@]+@[^\s@]+\.com(\.br)?$/;
  if (!regexEmail.test(email)) {
    notificar("Email inválido (ex: algo@algo.com ou .com.br)");
    return;
  }

  // Senha mínimo 8
  if (senha.length < 8) {
    notificar("Senha deve ter no mínimo 8 caracteres");
    return;
  }

  const usuarios = getUsuarios();

  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    notificar("Usuário já cadastrado");
    return;
  }

  usuarios.push({ nome, email, senha });
  salvarUsuarios(usuarios);

  notificar("Usuário cadastrado com sucesso");

  window.location.href = "login.html";
}

// ==========================
// CRIAR TAREFA (REQ 5)
// ==========================
function criarTarefa() {
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if (titulo.length < 5) {
    notificar("Título deve ter pelo menos 5 caracteres");
    return;
  }

  if (descricao && descricao.length < 3) {
    notificar("Descrição deve ter pelo menos 3 caracteres");
    return;
  }

  const tarefas = getTarefas();

  tarefas.push({
    id: Date.now(),
    titulo,
    descricao
  });

  salvarTarefas(tarefas);

  notificar("Tarefa criada com sucesso");

  window.location.href = "dashboard.html";
}

// ==========================
// LISTAR TAREFAS (REQ 1)
// ==========================
function carregarDashboard() {
  const lista = document.getElementById("listaTarefas");
  if (!lista) return;

  const tarefas = getTarefas();

  lista.innerHTML = "";

  tarefas.forEach(t => {
    lista.innerHTML += `
      <div class="card">
        ${t.titulo}
        <span onclick="verDetalhes(${t.id})">👁</span>
      </div>
    `;
  });
}

// ==========================
// DETALHES
// ==========================
function verDetalhes(id) {
  localStorage.setItem("tarefaAtual", id);
  window.location.href = "detalhes.html";
}

function carregarDetalhes() {
  const id = localStorage.getItem("tarefaAtual");
  if (!id) return;

  const tarefas = getTarefas();
  const tarefa = tarefas.find(t => t.id == id);

  if (!tarefa) return;

  document.getElementById("titulo").innerText = tarefa.titulo;
  document.getElementById("desc").innerText = tarefa.descricao;
}

// ==========================
// EDITAR
// ==========================
function carregarEditar() {
  const id = localStorage.getItem("tarefaAtual");
  if (!id) return;

  const tarefas = getTarefas();
  const tarefa = tarefas.find(t => t.id == id);

  if (!tarefa) return;

  document.getElementById("titulo").value = tarefa.titulo;
  document.getElementById("descricao").value = tarefa.descricao;
}

function salvarEdicao() {
  const id = localStorage.getItem("tarefaAtual");
  const tarefas = getTarefas();

  const tarefa = tarefas.find(t => t.id == id);

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if (titulo.length < 5) {
    notificar("Título deve ter pelo menos 5 caracteres");
    return;
  }

  if (descricao && descricao.length < 3) {
    notificar("Descrição deve ter pelo menos 3 caracteres");
    return;
  }

  tarefa.titulo = titulo;
  tarefa.descricao = descricao;

  salvarTarefas(tarefas);

  notificar("Tarefa alterada com sucesso");

  window.location.href = "dashboard.html";
}

// ==========================
// EXCLUIR (REQ 2)
// ==========================
function excluirTarefa() {
  const id = localStorage.getItem("tarefaAtual");
  let tarefas = getTarefas();

  tarefas = tarefas.filter(t => t.id != id);

  salvarTarefas(tarefas);

  notificar("Tarefa excluída com sucesso");

  window.location.href = "dashboard.html";
}

// ==========================
// PROTEGER ROTAS (EXTRA)
// ==========================
function verificarLogin() {
  const usuario = localStorage.getItem("usuarioLogado");

  const pagina = window.location.pathname;

  if (!usuario && !pagina.includes("login.html") && !pagina.includes("cadastro.html")) {
    window.location.href = "login.html";
  }
}

// ==========================
// INICIALIZAÇÃO
// ==========================
verificarLogin();
carregarDashboard();
carregarDetalhes();
carregarEditar();