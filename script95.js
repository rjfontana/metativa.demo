// Simulador Win95

document.addEventListener('DOMContentLoaded', function() {
  // Relógio Win95
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const clock = document.getElementById('clock');
    if (clock) clock.textContent = h + ':' + m;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Botão da barra de tarefas para abrir a calculadora de magnitude
  const magnitudeBtn = document.getElementById('btn-magnitude');
  if (magnitudeBtn) {
    magnitudeBtn.onclick = function() {
      // Cria janela Win95 para a calculadora de magnitude
      const win = document.createElement('div');
      win.className = 'window movable';
      win.style.position = 'fixed';
      win.style.left = '120px';
      win.style.top = '120px';
      win.style.minWidth = '370px';
      win.style.maxWidth = '98vw';
      win.style.zIndex = 4000 + Math.floor(Math.random()*1000);
      win.innerHTML = `
        <div class="title-bar" style="display:flex;align-items:center;">
          <img src="https://img.icons8.com/color/24/000000/star--v1.png" alt="Estrela" style="margin-right:8px;">
          <span style="font-weight:bold;">Calculadora de Magnitude Aparente</span>
          <span style="flex:1"></span>
          <button aria-label="Fechar" class="magnitude-close-btn" style="margin-left:8px;">×</button>
        </div>
        <div class="window-body" style="padding:16px;">
          <form id="magnitude-form" style="font-family:'MS Sans Serif',Arial,sans-serif;">
            <fieldset style="border:2px groove #b0c4de; border-radius:8px; padding:10px; background:#f6f6f6;">
              <legend style="font-weight:bold; color:#003366;">Dados da Estrela</legend>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                  <label for="x">X:</label>
                  <input type="number" id="x" style="width:80%;" required>
                </div>
                <div>
                  <label for="y">Y:</label>
                  <input type="number" id="y" style="width:80%;" required>
                </div>
                <div>
                  <label for="intensidade">Intensidade:</label>
                  <input type="number" id="intensidade" style="width:80%;" required>
                </div>
                <div>
                  <label for="raio">Raio (px):</label>
                  <input type="number" id="raio" style="width:80%;" required>
                </div>
                <div>
                  <label for="ceu">Intensidade do Céu:</label>
                  <input type="number" id="ceu" style="width:80%;" required>
                </div>
                <div>
                  <label for="raioceu">Raio do Céu (px):</label>
                  <input type="number" id="raioceu" style="width:80%;" required>
                </div>
              </div>
            </fieldset>
            <div style="margin-top:16px;text-align:center;">
              <button type="button" id="calcular-btn" class="win95-btn" style="font-weight:bold;">
                <img src="https://img.icons8.com/color/18/000000/star--v1.png" style="vertical-align:middle;"> Calcular Magnitude
              </button>
            </div>
          </form>
          <div id="resultado-magnitude" style="margin-top:18px;font-size:1.1em;color:#003366;text-align:center;"></div>
          <div id="explicacao-magnitude" style="margin-top:18px;font-size:0.98em;color:#222;background:#eaf2fb;border-radius:8px;padding:10px;">
            <b>Fórmula utilizada:</b><br>
            <span style="font-family:monospace;">m = -2.5 × log₁₀((I<sub>estrela</sub> - I<sub>céu</sub>) / I<sub>ref</sub>)</span><br>
            <b>Explicação:</b> A magnitude aparente é uma medida do brilho da estrela observada. Calculamos subtraindo o fundo do céu da intensidade da estrela, dividindo pelo valor de referência (padrão: 10000), e aplicando a fórmula logarítmica. Quanto menor o valor, mais brilhante a estrela.
          </div>
        </div>
      `;
      document.body.appendChild(win);

      // Fechar janela
      win.querySelector('.magnitude-close-btn').onclick = function() {
        win.remove();
      };

      // Movimentar janela estilo Win95
      let isDragging = false, offsetX = 0, offsetY = 0;
      win.querySelector('.title-bar').addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        function dragMove(ev) {
          if (!isDragging) return;
          win.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
          win.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
        }
        function dragUp() {
          isDragging = false;
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', dragMove);
          document.removeEventListener('mouseup', dragUp);
        }
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragUp);
      });
      win.addEventListener('mousedown', () => {
        win.style.zIndex = 4000 + Math.floor(Math.random()*1000);
      });

      // Cálculo da magnitude aparente
      win.querySelector('#calcular-btn').onclick = function() {
        const intensidade = parseFloat(win.querySelector('#intensidade').value);
        const ceu = parseFloat(win.querySelector('#ceu').value);
        const referencia = 10000; // valor padrão
        if (isNaN(intensidade) || isNaN(ceu) || intensidade <= 0 || ceu < 0) {
          win.querySelector('#resultado-magnitude').innerHTML = '<span style="color:red;">Preencha os campos corretamente.</span>';
          return;
        }
        const sinal = intensidade - ceu;
        if (sinal <= 0) {
          win.querySelector('#resultado-magnitude').innerHTML = '<span style="color:red;">A intensidade da estrela deve ser maior que o fundo do céu.</span>';
          return;
        }
        const mag = -2.5 * Math.log10(sinal / referencia);
        win.querySelector('#resultado-magnitude').innerHTML =
          `<b>Magnitude aparente:</b> <span style="color:#006400;font-size:1.2em;">${mag.toFixed(3)}</span>`;
      };
    };
  }

  // Botão da barra de tarefas para abrir a calculadora de magnitude por fotometria Salsaj
  const salsajBtn = document.getElementById('btn-salsaj');
  if (salsajBtn) {
    salsajBtn.onclick = function() {
      // Cria janela Win95 para cálculo de magnitude por fotometria Salsaj
      const win = document.createElement('div');
      win.className = 'window movable';
      win.style.position = 'fixed';
      win.style.left = '160px';
      win.style.top = '160px';
      win.style.minWidth = '370px';
      win.style.maxWidth = '98vw';
      win.style.zIndex = 4000 + Math.floor(Math.random()*1000);
      win.innerHTML = `
        <div class="title-bar" style="display:flex;align-items:center;">
          <img src="https://img.icons8.com/color/24/000000/star--v1.png" alt="Estrela" style="margin-right:8px;">
          <span style="font-weight:bold;">Fotometria Salsaj - Magnitude Relativa</span>
          <span style="flex:1"></span>
          <button aria-label="Fechar" class="salsaj-close-btn" style="margin-left:8px;">×</button>
        </div>
        <div class="window-body" style="padding:16px;">
          <form id="salsaj-form" style="font-family:'MS Sans Serif',Arial,sans-serif;">
            <fieldset style="border:2px groove #b0c4de; border-radius:8px; padding:10px; background:#f6f6f6;">
              <legend style="font-weight:bold; color:#003366;">Dados da Fotometria</legend>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                  <label for="mag2">Magnitude da estrela de referência (m₂):</label>
                  <input type="number" id="mag2" style="width:80%;" required>
                </div>
                <div>
                  <label for="fluxo1">Fluxo da estrela alvo (f₁):</label>
                  <input type="number" id="fluxo1" style="width:80%;" required>
                </div>
                <div>
                  <label for="fluxo2">Fluxo da estrela de referência (f₂):</label>
                  <input type="number" id="fluxo2" style="width:80%;" required>
                </div>
              </div>
            </fieldset>
            <div style="margin-top:16px;text-align:center;">
              <button type="button" id="calcular-salsaj-btn" class="win95-btn" style="font-weight:bold;">
                <img src="https://img.icons8.com/color/18/000000/star--v1.png" style="vertical-align:middle;"> Calcular Magnitude
              </button>
            </div>
          </form>
          <div id="resultado-salsaj" style="margin-top:18px;font-size:1.1em;color:#003366;text-align:center;"></div>
          <div id="explicacao-salsaj" style="margin-top:18px;font-size:0.98em;color:#222;background:#eaf2fb;border-radius:8px;padding:10px;">
            <b>Fórmula utilizada:</b><br>
            <span style="font-family:monospace;">m₁ - m₂ = -2.5 × log₁₀(f₁ / f₂)</span><br>
            <b>Explicação:</b> A magnitude da estrela alvo (m₁) é calculada usando a magnitude conhecida da estrela de referência (m₂) e os fluxos medidos das duas estrelas. O resultado mostra a magnitude relativa da estrela alvo.
          </div>
        </div>
      `;
      document.body.appendChild(win);

      // Fechar janela
      win.querySelector('.salsaj-close-btn').onclick = function() {
        win.remove();
      };

      // Movimentar janela estilo Win95
      let isDragging = false, offsetX = 0, offsetY = 0;
      win.querySelector('.title-bar').addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        function dragMove(ev) {
          if (!isDragging) return;
          win.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
          win.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
        }
        function dragUp() {
          isDragging = false;
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', dragMove);
          document.removeEventListener('mouseup', dragUp);
        }
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragUp);
      });
      win.addEventListener('mousedown', () => {
        win.style.zIndex = 4000 + Math.floor(Math.random()*1000);
      });

      // Cálculo da magnitude relativa Salsaj
      win.querySelector('#calcular-salsaj-btn').onclick = function() {
        const mag2 = parseFloat(win.querySelector('#mag2').value);
        const fluxo1 = parseFloat(win.querySelector('#fluxo1').value);
        const fluxo2 = parseFloat(win.querySelector('#fluxo2').value);

        if (isNaN(mag2) || isNaN(fluxo1) || isNaN(fluxo2) || fluxo1 <= 0 || fluxo2 <= 0) {
          win.querySelector('#resultado-salsaj').innerHTML = '<span style="color:red;">Preencha todos os campos corretamente.</span>';
          return;
        }

        const mag1 = mag2 - 2.5 * Math.log10(fluxo1 / fluxo2);
        win.querySelector('#resultado-salsaj').innerHTML =
          `<b>Magnitude da estrela alvo:</b> <span style="color:#006400;font-size:1.2em;">${mag1.toFixed(3)}</span>`;
      };
    };
  }

  // Gera HTML da pasta Observações para download dos arquivos
  function gerarHtml(pasta, rel_path = "") {
    let html = "<ul>";
    const items = Array.from(pasta).sort((a, b) => a.name.localeCompare(b.name));
    for (const item of items) {
      const nome = item.name;
      const caminho = item.webkitRelativePath || nome;
      const rel = rel_path + nome;
      if (item.isDirectory) {
        html += `<li><img src="https://img.icons8.com/fluency/20/000000/folder-invoices.png" style="vertical-align:middle;margin-right:4px;"><b>${nome}</b>${gerarHtml(item.files, rel + "/")}</li>`;
      } else {
        const ext = nome.split('.').pop().toLowerCase();
        let icon = "https://img.icons8.com/fluency/20/000000/file.png";
        if (ext === "txt") {
          icon = "https://img.icons8.com/fluency/20/000000/txt.png";
        } else if (["doc", "docx"].includes(ext)) {
          icon = "https://img.icons8.com/fluency/20/000000/ms-word.png";
        } else if (["fit", "fits"].includes(ext)) {
          icon = "https://img.icons8.com/fluency/20/000000/file.png";
        }
        html += `<li><a href="${rel}" download style="text-decoration:none;color:#1565c0;"><img src="${icon}" style="vertical-align:middle;margin-right:4px;">${nome}</a></li>`;
      }
    }
    html += "</ul>";
    return html;
  }

  // Exemplo de uso: substituir pelo seu código de obtenção da lista de arquivos
  const pastaExemplo = [
    { name: "Documento1.docx", isDirectory: false },
    { name: "Imagem1.png", isDirectory: false },
    { name: "Pasta1", isDirectory: true, files: [
        { name: "Documento2.txt", isDirectory: false },
        { name: "Imagem2.png", isDirectory: false }
      ]
    }
  ];

  // Gera e exibe o HTML na janela de Observações
  const htmlObservacoes = gerarHtml(pastaExemplo);
  const winObs = window.open("", "Observações", "width=600,height=400");
  winObs.document.write(`
    <html>
      <head>
        <title>Observações</title>
        <style>
          body { font-family: 'MS Sans Serif', Arial, sans-serif; margin: 0; padding: 0; }
          h1 { font-size: 1.5em; color: #003366; text-align: center; margin: 16px 0; }
          ul { list-style-type: none; padding: 0; }
          li { padding: 8px 0; }
          a { text-decoration: none; color: #1565c0; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Observações</h1>
        ${htmlObservacoes}
      </body>
    </html>
  `);
  winObs.document.close();
});