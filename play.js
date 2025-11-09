let socket = io.connect("https://api.grupobright.com");
let lastAuthToken = null;

socket.on("criado", async function (mesg) {
  $("#jogos")[0].style.display = "none";
  $("#vm-criada")[0].style.display = "flex";
  $("#form-field-ip")[0].value = mesg.ip;
  $("#form-field-senha")[0].value = mesg.password;

  let ipURI;
  let gameURI;

  if (mesg.node) {
    ipURI = mesg.internalip;
    gameURI = "1";
  } else {
    ipURI = mesg.ip;
    gameURI = "2";
  }

  if (mesg.internalip) {
    $("#form-field-ipmoonlight")[0].value = mesg.internalip;
  } else {
    $("#form-field-ipmoonlight")[0].value = mesg.ip;
  }
});

socket.on("RecCreated", async function (mesg) {
  $("#jogos")[0].style.display = "none";
  $("#vm-criada")[0].style.display = "flex";
  $("#form-field-ip")[0].value = mesg.ip;
  $("#form-field-senha")[0].value = mesg.password;

  let ipURI;
  let gameURI;

  if (mesg.node) {
    ipURI = mesg.internalip;
    gameURI = "1";
  } else {
    ipURI = mesg.ip;
    gameURI = "2";
  }

  if (mesg.internalip) {
    $("#form-field-ipmoonlight")[0].value = mesg.internalip;
  } else {
    $("#form-field-ipmoonlight")[0].value = mesg.ip;
  }
});

socket.on("reconnect", async function (msg) {
  var parentElement = document.getElementById("status_text");
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");

  if (msg != "NADA") {
    $("#loading")[0].style.display = "flex";
    $("#jogos")[0].style.display = "none";
    firstItem.innerHTML = msg;
  }
});

socket.on("interrompido", async function (msg) {
  var parentElement = document.getElementById("status_text");
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
  firstItem.innerHTML = "Carregando";
  $("#loading")[0].style.display = "none";
  $("#jogos")[0].style.display = "flex";
});

socket.on("error", async function (msg) {
  var parentElement = document.getElementById("status_text");
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
  firstItem.innerHTML = "Carregando";
  $("#loading")[0].style.display = "none";
  $("#jogos")[0].style.display = "flex";
  if (msg.code != "") {
    elementorProFrontend.modules.popup.showPopup({ id: 49478 });
    $("#label-erro")[0].innerHTML = msg.code;
  }
});

socket.on("authed", async function (msg) {
  elementorProFrontend.modules.popup.showPopup({ id: 12648 });
});

socket.on("connect", async function (msg) {
  socket.emit("getVms", "");

  while (true) {
    try {
      const response = await fetch("https://grupobright.com/userlogin.php", { cache: "no-store" });
      const token = await response.text();
      lastAuthToken = token;
      socket.emit("newAuth", token);
    } catch (e) {
      console.error("Falha ao obter token", e);
    }

    await new Promise((res) => setTimeout(res, 4 * 60 * 60 * 1000));

    socket.disconnect();
    await new Promise((res) => setTimeout(res, 3000));
    socket = io.connect("https://api.grupobright.com");
  }

  /*
  await fetch('https://grupobright.com/customcheck.php')
    .then(async function(response) {
      tokenCustom=await response.text();
      socket.emit("authenticateCustom", tokenCustom)
    })
  */
});

socket.on("created", async function (msg) {
  $("#loading")[0].style.display = "none";
  $("#vm-criada")[0].style.display = "flex";
  $("#form-field-ip")[0].value = msg.ip;
  $("#form-field-senha")[0].value = msg.password;

  let ipURI;
  let gameURI;

  if (msg.node) {
    ipURI = msg.internalip;
    gameURI = "1";
  } else {
    ipURI = msg.ip;
    gameURI = "2";
  }

  if (msg.internalip) {
    $("#form-field-ipmoonlight")[0].value = msg.internalip;
  } else {
    $("#form-field-ipmoonlight")[0].value = msg.ip;
  }
});

socket.on("infoUser", async function (msg) {
  var elementosInfo = document.querySelectorAll('#infoscliente .elementor-icon-list-items b');
  elementosInfo[0].textContent = msg.vmsGeradas;
  elementosInfo[1].textContent = msg.tempoUltimaVM;
  elementosInfo[2].textContent = msg.horasTotaisUtilizadas;
  elementosInfo[3].textContent = msg.assinaturaAtual;
});

socket.on("vms", async function (msg) {
  console.log(msg);
  socket.emit("vmCommand", { evento: "CreateVM", game: gameSelecionado });
  // socket.emit("vmCommand", { "evento": "List" })
});

socket.on("status", async function (msg) {
  var parentElement = document.getElementById("status_text");
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
  firstItem.innerHTML = msg;
});

socket.on("avaliable", function (msg) {
  const gtxY = parseInt(msg.gtx.split(': ')[1], 10);
  const rtxY = parseInt(msg.rtx.split(': ')[1], 10);
  const total = gtxY + rtxY;
  $("#label_total")[0].querySelector("span").innerHTML = `RTX: ${rtxY} e Total: ${total}`;
});

socket.on("assinatura", async function (msg) {
  console.log(`Status assinatura - ${msg}`);
  if (msg == false) {
    elementorProFrontend.modules.popup.showPopup({ id: 49498 });
  } else {
    socket.emit("choose", "fisica");
    socket.emit("vmCommand", { evento: "List" });

    $("#jogos")[0].style.display = "none";
    $("#loading")[0].style.display = "flex";

    var parentElement = document.getElementById("status_text");
    var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
    firstItem.innerHTML = "Aguarde, sua máquina será iniciada";
  }
});

socket.on("changeRegion", async function (msg) {
  // abrir popup
  elementorProFrontend.modules.popup.showPopup({ id: 49573 });

  $("#southamerica-east1-a")[0].onclick = function () {
    socket.emit("region", "yes");
    socket.emit("choose", "google");
    socket.emit("vmCommand", { evento: "List" });
  };

  $("#southamerica-east1-c")[0].onclick = function () {
    socket.emit("region", "yes1");
    socket.emit("choose", "google");
    socket.emit("vmCommand", { evento: "List" });
  };

  $("#us-east4-c")[0].onclick = function () {
    socket.emit("region", "no");
    socket.emit("choose", "google");
    socket.emit("vmCommand", { evento: "List" });
  };
});

socket.on("fisica2", async function (msg) {
  var parentElement = document.getElementById("status_text");
  var firstItem = parentElement.querySelector(".ekit-fancy-prefix-text");
  firstItem.innerHTML = "Carregando sua máquina";

  socket.emit("vmCommand", { evento: "CreateVM" });
});

socket.on("vmCheckStatus", function (msg) {
  const statuses = {
    RUNNING: `<font color="#ffffff"><text>Status da máquina:</text></font> <font color="#33cc33"><text>Ligada</text></font>`,
    TERMINATED: `<font color="#ffffff"><text>Status da máquina:</text></font> <font color="#ffcc00"><text>Desligada</text></font>`,
    DELETED: `<font color="#ffffff"><text>Status da máquina:</text></font> <font color="#ff3300"><text>Deletada</text></font>`,
  };
  $("#statusmaquina")[0].children[0].innerHTML = statuses[msg];
});

$(document).ready(function () {
  console.log("Pagina carregada");

  $("#priority-botao")[0].onclick = async function () {
    try {
      let url;
      if (lastAuthToken && typeof lastAuthToken === "string" && lastAuthToken.length > 10) {
        url = `https://grupobright.com/checkpriority.php?json=1&token=${encodeURIComponent(lastAuthToken)}`;
      } else {
        url = "https://grupobright.com/checkpriority.php";
      }

      const resp = await fetch(url, { method: "GET", cache: "no-store" });
      const body = await resp.text();

      if (!resp.ok) {
        console.error("Erro checkpriority", resp.status, body);
        return;
      }

      let tokenPriority = body;
      try {
        const parsed = JSON.parse(body);
        if (parsed && parsed.token) tokenPriority = parsed.token;
      } catch (_) { /* não era JSON, segue com texto */ }

      console.log("Response checagem priority:", tokenPriority);
      socket.emit("checarAssinatura", tokenPriority);
    } catch (e) {
      console.error("Falha ao checar priority:", e);
    }
  };

  // SETANDO JOGOS QUANDO CLICA NO BOTAO
  $("#launcher-botao")[0].onclick = function () { gameSelecionado = "bcg"; };
  $("#fifa23-botao")[0].onclick = function () { gameSelecionado = "fifa23"; };
  $("#csgo-botao")[0].onclick = function () { gameSelecionado = "cs-go"; };
  $("#bdo-botao")[0].onclick = function () { gameSelecionado = "blackdesert"; };
  $("#warzone-botao")[0].onclick = function () { gameSelecionado = "cod"; };
  $("#warzonesteam-botao")[0].onclick = function () { gameSelecionado = "cod-steam"; };
  $("#eldenring-botao")[0].onclick = function () { gameSelecionado = "eldenring"; };
  $("#gtav-steam-botao")[0].onclick = function () { gameSelecionado = "gtav-steam"; };
  $("#gtav-epic-botao")[0].onclick = function () { gameSelecionado = "gtav-epic"; };
  $("#gtav-rockstar-botao")[0].onclick = function () { gameSelecionado = "gtav-rockstar"; };
  $("#hlegacy-botao")[0].onclick = function () { gameSelecionado = "hoglegacy"; };
  $("#god-of-war-botao")[0].onclick = function () { gameSelecionado = "god-of-war"; };
  $("#fifa22-botao")[0].onclick = function () { gameSelecionado = "fifa22"; };
  $("#lostark-botao")[0].onclick = function () { gameSelecionado = "lostark"; };
  $("#reddead-botao")[0].onclick = function () { gameSelecionado = "reddead"; };
  $("#rleague-epic-botao")[0].onclick = function () { gameSelecionado = "rleague-epic"; };
  $("#rleague-steam-botao")[0].onclick = function () { gameSelecionado = "rleague-steam"; };
  $("#reddead-epic-botao")[0].onclick = function () { gameSelecionado = "reddead-epic"; };
  $("#reddead-botao")[0].onclick = function () { gameSelecionado = "reddead"; };
  $("#horizonzerodawn-botao")[0].onclick = function () { gameSelecionado = "horizonzerodawn"; };
  $("#overwatch-botao")[0].onclick = function () { gameSelecionado = "overwatch"; };
  $("#baldurs-botao")[0].onclick = function () { gameSelecionado = "baldurs-gate3"; };
  $("#starfield-botao")[0].onclick = function () { gameSelecionado = "starfield"; };
  $("#starfield-xbox-botao")[0].onclick = function () { gameSelecionado = "starfield-xbox"; };
  $("#forzahorizon5-botao")[0].onclick = function () { gameSelecionado = "forza-horizon"; };
  $("#seaofthieves-botao")[0].onclick = function () { gameSelecionado = "seaofthieves"; };
  $("#seaofthieves-steam-botao")[0].onclick = function () { gameSelecionado = "sea-steam"; };
  $("#wow-botao")[0].onclick = function () { gameSelecionado = "wow"; };
  $("#cyberpunk-botao")[0].onclick = function () { gameSelecionado = "cyberpunk"; };
  $("#mortalkombat1-botao")[0].onclick = function () { gameSelecionado = "morta-kombat1"; };

  // SETANDO PIN MOON
  $("#pair-button")[0].onclick = function () {
    socket.emit("auth", $("#form-field-pin")[0].value);
  };

  // BAIXANDO CONF WIREGUARD
  socket.on("wireguardConfig", function (data) {
    try {
      const blob = new Blob([data.config], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar configuração WireGuard:', error);
    }
  });

  $("#wireguard-conf")[0].onclick = function () {
    socket.emit("wireguard");
  };

  // DESLIGAR VM
  $("#desligarvm-botao")[0].onclick = function () {
    socket.emit("interromper", {
      feedback: "Feedback setado automaticamente (site novo)",
      stars: "star-5",
    });
    $("#vm-criada")[0].style.display = "none";
    $("#jogos")[0].style.display = "flex";
  };

  // RESETAR VM (botão na VM criada)
  $("#popupreset-botao")[0].onclick = function () {
    elementorProFrontend.modules.popup.showPopup({ id: 49488 });
    $("#resetar-botao")[0].onclick = function () {
      socket.emit("reset", "");
      $("#loading")[0].style.display = "flex";
      $("#vm-criada")[0].style.display = "none";
    };
  };

  // RESETAR VM (botão na tela de loading)
  $("#loading-reset")[0].onclick = function () {
    elementorProFrontend.modules.popup.showPopup({ id: 49488 });
    $("#resetar-botao")[0].onclick = function () {
      socket.emit("reset", "");
      $("#loading")[0].style.display = "flex";
      $("#vm-criada")[0].style.display = "none";
    };
  };

  $("#interromper-botao")[0].onclick = function () {
    socket.emit("sair", "sairFila");
  };

  // CUSTOM (mesmos mapeamentos dos botões “custom”)
  $("#launcher-botao-custom")[0].onclick = function () { gameSelecionado = "bcg"; };
  $("#fifa23-botao-custom")[0].onclick = function () { gameSelecionado = "fifa23"; };
  $("#csgo-botao-custom")[0].onclick = function () { gameSelecionado = "cs-go"; };
  $("#bdo-botao-custom")[0].onclick = function () { gameSelecionado = "blackdesert"; };
  $("#warzone-botao-custom")[0].onclick = function () { gameSelecionado = "cod"; };
  $("#warzonesteam-botao-custom")[0].onclick = function () { gameSelecionado = "cod-steam"; };
  $("#eldenring-botao-custom")[0].onclick = function () { gameSelecionado = "eldenring"; };
  $("#gtav-steam-botao-custom")[0].onclick = function () { gameSelecionado = "gtav-steam"; };
  $("#gtav-epic-botao-custom")[0].onclick = function () { gameSelecionado = "gtav-epic"; };
  $("#gtav-rockstar-botao-custom")[0].onclick = function () { gameSelecionado = "gtav-rockstar"; };
  $("#hlegacy-botao-custom")[0].onclick = function () { gameSelecionado = "hlegacy"; };
  $("#god-of-war-botao-custom")[0].onclick = function () { gameSelecionado = "god-of-war"; };
  $("#fifa22-botao-custom")[0].onclick = function () { gameSelecionado = "fifa22"; };
  $("#lostark-botao-custom")[0].onclick = function () { gameSelecionado = "lostark"; };
  $("#reddead-botao-custom")[0].onclick = function () { gameSelecionado = "reddead"; };
  $("#rleague-epic-botao-custom")[0].onclick = function () { gameSelecionado = "rleague-epic"; };
  $("#rleague-steam-botao-custom")[0].onclick = function () { gameSelecionado = "rleague-steam"; };
  $("#reddead-epic-botao-custom")[0].onclick = function () { gameSelecionado = "reddead-epic"; };
  $("#reddead-botao-custom")[0].onclick = function () { gameSelecionado = "reddead"; };
  $("#horizonzerodawn-botao-custom")[0].onclick = function () { gameSelecionado = "horizonzerodawn"; };
  $("#overwatch-botao-custom")[0].onclick = function () { gameSelecionado = "overwatch"; };
  $("#baldurs-botao-custom")[0].onclick = function () { gameSelecionado = "baldurs-gate3"; };
  $("#starfield-botao-custom")[0].onclick = function () { gameSelecionado = "starfield"; };
  $("#starfield-xbox-botao-custom")[0].onclick = function () { gameSelecionado = "starfield-xbox"; };
  $("#seaofthieves-botao-custom")[0].onclick = function () { gameSelecionado = "seaofthieves"; };
  $("#seaofthieves-steam-botao-custom")[0].onclick = function () { gameSelecionado = "sea-steam"; };
  $("#forzahorizon5-botao-custom")[0].onclick = function () { gameSelecionado = "forza-horizon"; };
  $("#wow-botao-custom")[0].onclick = function () { gameSelecionado = "wow"; };
  $("#cyberpunk-botao-custom")[0].onclick = function () { gameSelecionado = "cyberpunk"; };
  $("#mortalkombat1-botao-custom")[0].onclick = function () { gameSelecionado = "morta-kombat1"; };
});
