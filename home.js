document.addEventListener("DOMContentLoaded", () => {

  // =======================
  // ELEMENTOS
  // =======================
  const sections = document.querySelectorAll(".content-section");
  const links = document.querySelectorAll("#navbar a");
  const btnProcurar = document.querySelector("#home .btn");
  const btnRegistrar = document.querySelector("#home .btn.secondary");
  const miniPerfil = document.getElementById("mini-perfil");

  // =======================
  // EXIBIÇÃO DE SEÇÕES
  // =======================
  function showSection(sectionId) {
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");
  }

  showSection("home");

  // =======================
  // NAVEGAÇÃO
  // =======================
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-section");
      showSection(target);
    });
  });

  // Botão "Cadastre-se" na tela de login (CORRIGIDO)
  const linkCadastro = document.getElementById("link-cadastro");
  if (linkCadastro) {
    linkCadastro.addEventListener("click", (e) => {
      e.preventDefault();
      showSection("cadastro");
    });
  }

  // Botão Procurar desaparecido
  btnProcurar.addEventListener("click", (e) => {
    e.preventDefault();
    showSection("desaparecidos");
  });

  // Botão Registrar desaparecimento
  btnRegistrar.addEventListener("click", (e) => {
    e.preventDefault();

    const usuario = getUsuarioLogado();
    if (!usuario) {
      showSection("cadastro");
      return;
    }

    showSection("desaparecidos");
    atualizarVisibilidadeFormularioDesaparecido();

    const form = document.getElementById("form-desaparecido");
    if (form) {
      setTimeout(() => {
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  });

// ===========================
// ALTERAR BOTÃO AO ESCOLHER FOTO
// ===========================
const fotoInput = document.getElementById("foto-desaparecido");
const labelFoto = document.getElementById("label-foto");

fotoInput.addEventListener("change", () => {
    if (fotoInput.files.length > 0) {
        labelFoto.textContent = "📷 Foto selecionada ✓";
        labelFoto.style.backgroundColor = "#0a7a20"; // verde
    } else {
        labelFoto.textContent = "📸 Escolher foto";
        labelFoto.style.backgroundColor = "#333";
    }
});


// =======================
// BOTÕES DOS CARDS FIXOS DA HOME
// =======================
const botoesHomeCards = document.querySelectorAll("#desaparecidos-home .btn-card");

botoesHomeCards.forEach(btn => {
  btn.addEventListener("click", () => {
    showSection("desaparecidos");
    renderDesaparecidos();

    // scroll suave
    setTimeout(() => {
      document.getElementById("cards-desaparecidos")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  });
});


  // =======================
  // LOCALSTORAGE
  // =======================
  function getUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  }

  function salvarUsuarios(lista) {
    localStorage.setItem("usuarios", JSON.stringify(lista));
  }

  function getUsuarioLogado() {
    return JSON.parse(localStorage.getItem("usuarioLogado")) || null;
  }

  function setUsuarioLogado(usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  }

  // =======================
  // MINI PERFIL
  // =======================
  function mostrarMiniPerfil() {
    const usuario = getUsuarioLogado();
    const itemLogin = document.getElementById("item-login");

    if (usuario) {
      itemLogin.style.display = "none";
      miniPerfil.style.display = "flex";
    } else {
      itemLogin.style.display = "block";
      miniPerfil.style.display = "none";
    }
  }

  function atualizarVisibilidadeMeusRegistros() {
    const usuario = getUsuarioLogado();
    const btnMeus = document.getElementById("btn-meus-registros");
    if (!btnMeus) return;

    btnMeus.style.display = usuario ? "inline-block" : "none";
  }

  function atualizarVisibilidadeFormularioDesaparecido() {
    const usuario = getUsuarioLogado();
    const form = document.getElementById("form-desaparecido");
    const msg = document.getElementById("msg-login-registro");

    if (!form) return;

    if (usuario) {
      form.style.display = "flex";
      if (msg) msg.style.display = "none";
    } else {
      form.style.display = "none";
      if (msg) msg.style.display = "block";
    }
  }

  // Inicializa
  mostrarMiniPerfil();
  atualizarVisibilidadeMeusRegistros();
  atualizarVisibilidadeFormularioDesaparecido();

  // =======================
  // CADASTRO
  // =======================
  document.getElementById("form-cadastro").addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome-cadastro").value.trim();
    const email = document.getElementById("email-cadastro").value.trim();
    const senha = document.getElementById("senha-cadastro").value.trim();
    const confirmarSenha = document.getElementById("confirmar-senha").value.trim();
    const msgCadastro = document.getElementById("mensagem-cadastro");

    msgCadastro.className = "";

    if (senha !== confirmarSenha) {
      msgCadastro.textContent = "As senhas não conferem!";
      msgCadastro.classList.add("erro");
      msgCadastro.style.display = "block";
      return;
    }

    let usuarios = getUsuarios();
    if (usuarios.some(u => u.email === email)) {
      msgCadastro.textContent = "Email já cadastrado!";
      msgCadastro.classList.add("erro");
      msgCadastro.style.display = "block";
      return;
    }

    usuarios.push({ nome, email, senha });
    salvarUsuarios(usuarios);

    msgCadastro.textContent = "Cadastro realizado com sucesso! Você já pode fazer login.";
    msgCadastro.classList.add("sucesso");
    msgCadastro.style.display = "block";
    e.target.reset();

    setTimeout(() => msgCadastro.style.display = "none", 3000);
  });

const linkVoltarLogin = document.getElementById("voltar-login");

if (linkVoltarLogin) {
  linkVoltarLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showSection("login");
  });
}


  // =======================
  // LOGIN
  // =======================
  document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email-login").value.trim();
    const senha = document.getElementById("senha-login").value.trim();
    const msgLogin = document.getElementById("mensagem-login");

    msgLogin.className = "";

    const usuarios = getUsuarios();
    const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

    if (!usuario) {
      msgLogin.textContent = "Email ou senha incorretos!";
      msgLogin.classList.add("erro");
      msgLogin.style.display = "block";
      return;
    }

    setUsuarioLogado(usuario);

    document.getElementById("avatar-perfil").src = usuario.foto || "default-avatar.png";

    msgLogin.textContent = "Login realizado com sucesso!";
    msgLogin.classList.add("sucesso");
    msgLogin.style.display = "block";

    e.target.reset();

    mostrarMiniPerfil();
    atualizarVisibilidadeMeusRegistros();
    atualizarVisibilidadeFormularioDesaparecido();

    showSection("desaparecidos");

    setTimeout(() => msgLogin.style.display = "none", 3000);
  });

// =======================
// CARDS FIXOS DA HOME
// =======================
const registrosFixos  = [
  {
    id: "fixo1",
    nome: "Edgar Tomé",
    idade: 33,
    cidade: "São Mateus",
    estado: "SP",
    status: "missing",
    foto: "edgar.jpg",
    criado_por: "sistema"
  },
  {
    id: "fixo2",
    nome: "Maria Souza",
    idade: 73,
    cidade: "Belo Horizonte",
    estado: "MG",
    status: "missing",
    foto: "idosa.jpg",
    criado_por: "sistema"
  },
  {
    id: "fixo3",
    nome: "Carlos Lima",
    idade: 23,
    cidade: "Recife",
    estado: "PE",
    status: "found",
    foto: "carlos.jpg",
    criado_por: "sistema"
  }
];


  // =======================
  // DESAPARECIDOS
  // =======================
  function getDesaparecidos() {
    return JSON.parse(localStorage.getItem("desaparecidos")) || [];
  }

  function salvarDesaparecidos(lista) {
    localStorage.setItem("desaparecidos", JSON.stringify(lista));
  }

// Renderizar todos os registros + os cards fixos
function renderDesaparecidos() {
  const cardsContainer = document.getElementById("cards-desaparecidos");
  if (!cardsContainer) return;
  cardsContainer.innerHTML = "";

  // juntar fixos + storage
  const lista = [...registrosFixos, ...getDesaparecidos()];
  const usuario = getUsuarioLogado();

  lista.forEach(pessoa => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${pessoa.foto}" alt="Foto de ${pessoa.nome}">
      <h3>${pessoa.nome}</h3>
      <p>Idade: ${pessoa.idade}</p>
      <p>Visto por último: ${pessoa.cidade} - ${pessoa.estado}</p>
      <p>Status: 
        <span class="status ${pessoa.status}">
          ${pessoa.status === "missing" ? "Desaparecido" : "Encontrado"}
        </span>
      </p>
      <p><strong>Registrado por:</strong> ${pessoa.criado_por}</p>
    `;

    // botão excluir só para registros do LocalStorage (não para os fixos)
    if (pessoa.id && usuario && usuario.email === pessoa.criado_por) {
      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.classList.add("btn", "small");
      btnExcluir.style.background = "#d90429";
      btnExcluir.style.color = "#fff";
      btnExcluir.style.marginTop = "10px";

      btnExcluir.addEventListener("click", () => {
        if (confirm(`Excluir o registro de ${pessoa.nome}?`)) {
          excluirRegistro(pessoa.id);
          renderDesaparecidos();
        }
      });

      card.appendChild(btnExcluir);
    }

    cardsContainer.appendChild(card);
  });
}

// =======================
// BOTÕES DA HOME — MEUS E TODOS
// =======================
const btnTodos = document.getElementById("btn-todos-registros");
const btnMeus = document.getElementById("btn-meus-registros");

if (btnTodos) {
  btnTodos.addEventListener("click", () => {
    showSection("desaparecidos");
    renderDesaparecidos();
  });
}

if (btnMeus) {
  btnMeus.addEventListener("click", () => {
    showSection("desaparecidos");
    renderMeusRegistros();
  });
}


  renderDesaparecidos();

// FILTRAR DESAPARECIDOS
function filtrarDesaparecidos() {
  const nomeFiltro = document.getElementById("buscar-nome").value.trim().toLowerCase();
  const estadoFiltro = document.getElementById("filtro-estado").value;
  const statusFiltro = document.getElementById("filtro-status").value;

  const cardsContainer = document.getElementById("cards-desaparecidos");
  if (!cardsContainer) return;
  cardsContainer.innerHTML = "";

  // construir lista a partir do array fixos + storage (mantemos os campos já corretos)
  let lista = [...registrosFixos, ...getDesaparecidos()];

  lista = lista.filter(p => {
    const nomeOk = nomeFiltro === "" || (p.nome && p.nome.toLowerCase().includes(nomeFiltro));
    const estadoOk = estadoFiltro === "" || (p.estado && p.estado === estadoFiltro);
    const statusOk = statusFiltro === "" || (p.status && p.status === statusFiltro);
    return nomeOk && estadoOk && statusOk;
  });

  if (lista.length === 0) {
    cardsContainer.innerHTML = "<p>Nenhum registro encontrado.</p>";
    return;
  }

  const usuario = getUsuarioLogado();

  lista.forEach(pessoa => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${pessoa.foto}" alt="Foto de ${pessoa.nome}">
      <h3>${pessoa.nome}</h3>
      <p>Idade: ${pessoa.idade}</p>
      <p>Visto por último: ${pessoa.cidade} - ${pessoa.estado}</p>
      <p>Status:
        <span class="status ${pessoa.status}">
          ${pessoa.status === "missing" ? "Desaparecido" : "Encontrado"}
        </span>
      </p>
      <p><strong>Registrado por:</strong> ${pessoa.criado_por}</p>
    `;

    // excluir apenas se for registro do LocalStorage
    if (pessoa.id && usuario && usuario.email === pessoa.criado_por) {
      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.classList.add("btn", "small");
      btnExcluir.style.background = "#d90429";
      btnExcluir.style.color = "#fff";
      btnExcluir.style.marginTop = "10px";

      btnExcluir.addEventListener("click", () => {
        if (confirm(`Deseja excluir o registro de ${pessoa.nome}?`)) {
          excluirRegistro(pessoa.id);
          filtrarDesaparecidos(); // mantém o filtro aplicado
        }
      });

      card.appendChild(btnExcluir);
    }

    cardsContainer.appendChild(card);
  });
}





// BOTÃO FILTRAR - FUNCIONAL
document.getElementById("btn-filtrar").addEventListener("click", () => {
    filtrarDesaparecidos();
});

 // =======================
// Meus registros
// =======================
function renderMeusRegistros() {
  const usuario = getUsuarioLogado();
  const cardsContainer = document.getElementById("cards-desaparecidos");

  cardsContainer.innerHTML = "";

  const lista = getDesaparecidos().filter(p => p.criado_por === usuario.email);

  if (lista.length === 0) {
    cardsContainer.innerHTML = "<p>Nenhum registro seu encontrado.</p>";
    return;
  }

  lista.forEach((pessoa) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${pessoa.foto}" alt="Foto de ${pessoa.nome}">
      <h3>${pessoa.nome}</h3>
      <p>Idade: ${pessoa.idade}</p>
      <p>Visto por último: ${pessoa.cidade} - ${pessoa.estado}</p>
      <p>Status: <span class="status ${pessoa.status}">
        ${pessoa.status === "missing" ? "Desaparecido" : "Encontrado"}
      </span></p>
      <p><strong>Registrado por você</strong></p>
    `;

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("btn", "small");
    btnExcluir.style.background = "#d90429";
    btnExcluir.style.color = "#fff";
    btnExcluir.style.marginTop = "10px";

    btnExcluir.addEventListener("click", () => {
      if (confirm(`Tem certeza que deseja excluir ${pessoa.nome}?`)) {
        excluirRegistro(pessoa.id);
        renderMeusRegistros();
      }
    });

    card.appendChild(btnExcluir);
    cardsContainer.appendChild(card);
  });
}


// Botões Home — funcional
document.getElementById("btn-meus-registros").addEventListener("click", () => {
  renderMeusRegistros();
});

document.getElementById("btn-todos-registros").addEventListener("click", () => {
  renderDesaparecidos();
});


  // =======================
  // REGISTRAR DESAPARECIDO
  // =======================
  document.getElementById("form-desaparecido").addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = getUsuarioLogado();
    const msgRegistro = document.getElementById("mensagem-registro");
    msgRegistro.className = "";

    if (!usuario) {
      msgRegistro.textContent = "Você precisa estar logado para registrar.";
      msgRegistro.classList.add("erro");
      msgRegistro.style.display = "block";
      return;
    }

    const nome = document.getElementById("nome-desaparecido").value.trim();
    const idade = parseInt(document.getElementById("idade-desaparecido").value);
    const cidade = document.getElementById("cidade-desaparecido").value.trim();
    const estado = document.getElementById("estado-desaparecido").value.trim();
    const data = document.getElementById("data-desaparecimento").value;
    const detalhes = document.getElementById("detalhes-desaparecimento").value.trim();
    const fotoInput = document.getElementById("foto-desaparecido").files[0];

    const lista = getDesaparecidos();

    function salvarRegistro(fotoBase64) {
      lista.push({
        id: Date.now(),
        nome,
        idade,
        cidade,
        estado,
        data,
        detalhes,
        foto: fotoBase64 || "placeholder.jpg",
        criado_por: usuario.email,
        status: "missing"
      });

      salvarDesaparecidos(lista);
      renderDesaparecidos();

      msgRegistro.textContent = "Registro inserido com sucesso!";
      msgRegistro.classList.add("sucesso");
      msgRegistro.style.display = "block";

      e.target.reset();

      setTimeout(() => msgRegistro.style.display = "none", 3000);
    }

    if (fotoInput) {
      const leitor = new FileReader();
      leitor.onload = () => salvarRegistro(leitor.result);
      leitor.readAsDataURL(fotoInput);
    } else {
      salvarRegistro(null);
    }
  });

// EXCLUIR REGISTRO — remove apenas dos registros do localStorage
function excluirRegistro(id) {
  const listaLS = getDesaparecidos();
  const nova = listaLS.filter(item => item.id !== id);
  salvarDesaparecidos(nova);
}



  // =======================
  // PERFIL
  // =======================
  const avatar = document.getElementById("avatar-perfil");
  if (avatar) {
    avatar.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("mini-perfil").classList.toggle("ativo");
    });
  }

  document.addEventListener("click", (e) => {
    const mini = document.getElementById("mini-perfil");
    if (!mini.contains(e.target)) mini.classList.remove("ativo");
  });

  const btnPerfil = document.getElementById("btn-perfil");
  if (btnPerfil) {
    btnPerfil.addEventListener("click", () => {
      document.getElementById("mini-perfil").classList.remove("ativo");

      const usuario = getUsuarioLogado();
      if (!usuario) {
        showSection("login");
        return;
      }

      document.getElementById("perfil-nome").textContent = usuario.nome;
      document.getElementById("perfil-email").textContent = usuario.email;
      document.getElementById("perfil-telefone").textContent = usuario.telefone || "—";
      document.getElementById("perfil-regiao").textContent = usuario.regiao || "—";
      document.getElementById("avatar-perfil").src = usuario.foto || "default-avatar.png";

      showSection("perfil");
    });
  }

  // EDITAR PERFIL
  const btnEditarPerfil = document.getElementById("btn-editar-perfil");
  const formEditarPerfil = document.getElementById("form-editar-perfil");
  const msgPerfil = document.getElementById("mensagem-perfil");

  btnEditarPerfil.addEventListener("click", () => {
    formEditarPerfil.style.display = "flex";
    btnEditarPerfil.style.display = "none";
  });

  const btnCancelar = document.getElementById("btn-cancelar-edicao");
  btnCancelar.addEventListener("click", () => {
    formEditarPerfil.reset();
    formEditarPerfil.style.display = "none";
    btnEditarPerfil.style.display = "inline-block";
  });

  formEditarPerfil.addEventListener("submit", (e) => {
    e.preventDefault();

    const novoTelefone = document.getElementById("editar-telefone").value.trim();
    const novaRegiao = document.getElementById("editar-regiao").value.trim();
    const usuario = getUsuarioLogado();

    if (!usuario) {
      msgPerfil.textContent = "Erro: você não está logado.";
      msgPerfil.className = "erro";
      msgPerfil.style.display = "block";
      return;
    }

    if (novoTelefone) usuario.telefone = novoTelefone;
    if (novaRegiao) usuario.regiao = novaRegiao;

    setUsuarioLogado(usuario);

    const usuarios = getUsuarios().map((u) =>
      u.email === usuario.email ? usuario : u
    );
    salvarUsuarios(usuarios);

    document.getElementById("perfil-telefone").textContent = usuario.telefone || "—";
    document.getElementById("perfil-regiao").textContent = usuario.regiao || "—";

    msgPerfil.textContent = "Informações atualizadas com sucesso!";
    msgPerfil.className = "sucesso";
    msgPerfil.style.display = "block";

    formEditarPerfil.reset();
    formEditarPerfil.style.display = "none";
    btnEditarPerfil.style.display = "inline-block";

    setTimeout(() => msgPerfil.style.display = "none", 3000);
  });

  // FOTO DE PERFIL
  const inputFoto = document.getElementById("input-foto");
  const imgPerfil = document.getElementById("foto-perfil");

  inputFoto.addEventListener("change", (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = () => {
      const imagemBase64 = leitor.result;

      document.getElementById("avatar-perfil").src = imagemBase64;
      imgPerfil.src = imagemBase64;

      const usuario = getUsuarioLogado();
      if (usuario) {
        usuario.foto = imagemBase64;
        setUsuarioLogado(usuario);

        const usuarios = getUsuarios().map((u) =>
          u.email === usuario.email ? usuario : u
        );
        salvarUsuarios(usuarios);
      }
    };

    leitor.readAsDataURL(arquivo);
  });

  // LOGOUT
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      mostrarMiniPerfil();
      atualizarVisibilidadeMeusRegistros();
      atualizarVisibilidadeFormularioDesaparecido();
      document.getElementById("mini-perfil").classList.remove("ativo");
      showSection("login");
    });
  }

document.getElementById("btn-limpar-filtro")?.addEventListener("click", () => {
  document.getElementById("buscar-nome").value = "";
  document.getElementById("filtro-estado").value = "";
  document.getElementById("filtro-status").value = "";
  renderDesaparecidos();
});


});

