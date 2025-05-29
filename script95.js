// script95.js - Funcionalidades Win95 para o Buscador de Planos de Aula
// Este arquivo separa e organiza o JS do projeto, mantendo o HTML limpo.
// Plataforma MetAtiva (anteriormente chamada de index)

document.addEventListener('DOMContentLoaded', function() {
  // --- Dados e elementos principais ---
  const RESOURCES = [
    "Lousa digital", "Projetor", "Computadores", "Tablets", "Internet",
    "Arduino", "Robótica", "Impressora 3D", "Câmeras", "Kits de realidade virtual"
  ];
  const PLANS = [
    {
      "title": "Aula Integrada com Lousa digital",
      "space": "Biblioteca",
      "resources": ["Lousa digital"],
      "theme": "Geografia",
      "description": "Plano de aula usando Lousa digital para atividades interativas no tema de geografia."
    },
    {
      "title": "Aula Integrada com Projetor",
      "space": "Sala de aula",
      "resources": ["Projetor"],
      "theme": "Ciências",
      "description": "Plano de aula usando Projetor para atividades interativas no tema de ciências."
    }
    // Adicione mais planos conforme necessário
  ];
  const resourceContainer = document.getElementById("resource-checkboxes");
  const spaceSelect = document.getElementById("space-select");
  const themeSelect = document.getElementById("theme-select");
  const resultsContainer = document.getElementById("results");

  // --- Preenche os checkboxes de recursos ---
  RESOURCES.forEach(resource => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = resource;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(resource));
    resourceContainer.appendChild(label);
  });

  // --- Atualiza os resultados do buscador ---
  function updateResults() {
    const selectedSpace = spaceSelect.value;
    const selectedTheme = themeSelect.value;
    const selectedResources = Array.from(resourceContainer.querySelectorAll("input:checked")).map(cb => cb.value);
    if (!selectedSpace && !selectedTheme && selectedResources.length === 0) {
      resultsContainer.innerHTML = '';
      PLANS.forEach(plan => resultsContainer.appendChild(renderCard(plan)));
      return;
    }
    const exact = PLANS.filter(plan =>
      (!selectedSpace || plan.space === selectedSpace) &&
      (!selectedTheme || plan.theme === selectedTheme) &&
      selectedResources.every(r => plan.resources.includes(r))
    );
    resultsContainer.innerHTML = "";
    if (exact.length > 0) {
      exact.forEach(plan => resultsContainer.appendChild(renderCard(plan)));
    } else {
      const partial = PLANS.map(plan => {
        let matchCount = 0;
        if (selectedSpace && plan.space === selectedSpace) matchCount++;
        if (selectedTheme && plan.theme === selectedTheme) matchCount++;
        const commonResources = selectedResources.filter(r => plan.resources.includes(r)).length;
        matchCount += commonResources;
        return { plan, matchCount };
      }).filter(item => item.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount);
      if (partial.length > 0) {
        partial.forEach(({ plan }) => resultsContainer.appendChild(renderCard(plan, true)));
      } else {
        resultsContainer.innerHTML = '<p style="color:#888">Nenhum plano corresponde exatamente, mas veja sugestões abaixo:</p>';
        PLANS.forEach(plan => resultsContainer.appendChild(renderCard(plan, true)));
      }
    }
  }

  // --- Renderiza um card de plano ---
  function renderCard(plan, isPartial = false) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <button class="copy" title="Copiar">📋</button>
      <h3>${plan.title}</h3>
      <p><strong>Espaço:</strong> ${plan.space}</p>
      <p><strong>Temática:</strong> ${plan.theme}</p>
      <p><strong>Recursos:</strong> ${plan.resources.join(", ")}</p>
      <p>${plan.description}</p>
      ${isPartial ? '<p class="partial-note">Plano sugerido com base em critérios parciais.</p>' : ''}
    `;
    const copyBtn = card.querySelector(".copy");
    copyBtn.onclick = () => {
      const texto = `${plan.title}\nEspaço: ${plan.space}\nTemática: ${plan.theme}\nRecursos: ${plan.resources.join(", ")}\n${plan.description}`;
      navigator.clipboard.writeText(texto);
      copyBtn.classList.add("copied");
      copyBtn.textContent = "✔";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "📋";
      }, 1200);
    };
    return card;
  }

  // --- Eventos do buscador ---
  spaceSelect.addEventListener("change", updateResults);
  themeSelect.addEventListener("change", updateResults);
  resourceContainer.addEventListener("change", updateResults);

  // --- Relógio Win95 ---
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = h + ':' + m;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- Drag and drop da janela principal ---
  (function() {
    const windowEl = document.getElementById('main-window');
    const titleBar = document.getElementById('title-bar');
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let dragMouseMove, dragMouseUp;
    titleBar.style.cursor = 'move';
    titleBar.addEventListener('mousedown', function(e) {
      if (e.button !== 0) return; // só botão esquerdo
      isDragging = true;
      const rect = windowEl.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.body.style.userSelect = 'none';
      dragMouseMove = function(ev) {
        if (!isDragging) return;
        windowEl.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
        windowEl.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
      };
      dragMouseUp = function() {
        isDragging = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', dragMouseMove);
        document.removeEventListener('mouseup', dragMouseUp);
      };
      document.addEventListener('mousemove', dragMouseMove);
      document.addEventListener('mouseup', dragMouseUp);
    });
  })();

  // --- Fechar/minimizar janela do Buscador de Planos de Aula ---
  const mainWindow = document.getElementById('main-window');
  const mainCloseBtn = document.getElementById('close-btn');
  const mainMinimizeBtn = document.getElementById('minimize-btn');
  if (mainCloseBtn) mainCloseBtn.addEventListener('click', function() {
    mainWindow.style.display = 'none';
  });
  if (mainMinimizeBtn) mainMinimizeBtn.addEventListener('click', function() {
    mainWindow.style.display = 'none';
  });

  // --- Atalhos da área de trabalho ---
  const planosBtn = document.getElementById('icon-planos');
  if (planosBtn) {
    planosBtn.addEventListener('click', function(e) {
      const win = document.getElementById('main-window');
      win.style.display = 'block';
      win.style.zIndex = 2000;
      planosBtn.focus();
    });
    planosBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        planosBtn.click();
      }
    });
  }

  // --- Atalho de Recursos: abre janela com várias pastas, incluindo Taxonomia de Bloom ---
  const recursosBtn = document.getElementById('icon-recursos');
  const recursosWindow = document.getElementById('recursos-window');
  const recursosTitleBar = document.getElementById('recursos-title-bar');
  const recursosCloseBtn = document.getElementById('recursos-close-btn');
  const recursosMinimizeBtn = document.getElementById('recursos-minimize-btn');

  if (recursosBtn) {
    recursosBtn.addEventListener('click', function(e) {
      e.preventDefault();
      recursosWindow.style.display = 'block';
      recursosWindow.style.zIndex = 2100;
      recursosBtn.focus();
    });
    recursosBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        recursosBtn.click();
      }
    });
  }
  if (recursosCloseBtn) recursosCloseBtn.addEventListener('click', function() {
    recursosWindow.style.display = 'none';
  });
  if (recursosMinimizeBtn) recursosMinimizeBtn.addEventListener('click', function() {
    recursosWindow.style.display = 'none';
  });
  // Drag da janela de recursos
  if (recursosTitleBar) {
    (function() {
      let isDragging = false;
      let offsetX = 0, offsetY = 0;
      let dragMouseMove, dragMouseUp;
      recursosTitleBar.style.cursor = 'move';
      recursosTitleBar.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = recursosWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        dragMouseMove = function(ev) {
          if (!isDragging) return;
          recursosWindow.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
          recursosWindow.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
        };
        dragMouseUp = function() {
          isDragging = false;
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', dragMouseMove);
          document.removeEventListener('mouseup', dragMouseUp);
        };
        document.addEventListener('mousemove', dragMouseMove);
        document.addEventListener('mouseup', dragMouseUp);
      });
    })();
  }
  // Pasta do Drive: só ela é clicável
  const pastaDrive = recursosWindow ? recursosWindow.querySelector('a[href^="https://drive.google.com/"]') : null;
  if (pastaDrive) {
    pastaDrive.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '_blank');
    });
    pastaDrive.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pastaDrive.click();
      }
    });
  }
  // --- Taxonomia de Bloom ---
  const openBloomBtn = document.getElementById('open-bloom-btn');
  const bloomWindow = document.getElementById('bloom-window');
  const bloomTitleBar = document.getElementById('bloom-title-bar');
  const bloomCloseBtn = document.getElementById('bloom-close-btn');
  const bloomMinimizeBtn = document.getElementById('bloom-minimize-btn');
  const bloomContent = document.getElementById('bloom-content');

  if (openBloomBtn) {
    openBloomBtn.addEventListener('click', function() {
      bloomWindow.style.display = 'block';
      bloomWindow.style.zIndex = 2200;
      renderBloomRoot();
      openBloomBtn.focus();
    });
    openBloomBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBloomBtn.click();
      }
    });
  }
  if (bloomCloseBtn) bloomCloseBtn.addEventListener('click', function() {
    bloomWindow.style.display = 'none';
  });
  if (bloomMinimizeBtn) bloomMinimizeBtn.addEventListener('click', function() {
    bloomWindow.style.display = 'none';
  });
  // Drag da janela de bloom
  if (bloomTitleBar) {
    (function() {
      let isDragging = false;
      let offsetX = 0, offsetY = 0;
      let dragMouseMove, dragMouseUp;
      bloomTitleBar.style.cursor = 'move';
      bloomTitleBar.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = bloomWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        dragMouseMove = function(ev) {
          if (!isDragging) return;
          bloomWindow.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
          bloomWindow.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
        };
        dragMouseUp = function() {
          isDragging = false;
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', dragMouseMove);
          document.removeEventListener('mouseup', dragMouseUp);
        };
        document.addEventListener('mousemove', dragMouseMove);
        document.addEventListener('mouseup', dragMouseUp);
      });
    })();
  }
  // --- Renderização dinâmica da Taxonomia de Bloom ---
  function renderBloomRoot() {
    bloomContent.innerHTML = `
      <h2 style="color:#003366;">Taxonomia de Bloom</h2>
      <div style="display:flex; flex-wrap:wrap; gap:24px; justify-content:center;">
        <div style="display:flex;flex-direction:column;align-items:center;">
          <button class="bloom-folder" data-folder="infantil" aria-label="Ensino Infantil (4 a 5 anos)" title="Ensino Infantil (4 a 5 anos)">
            <img src="https://img.icons8.com/fluency/48/000000/folder-invoices.png" alt="Ensino Infantil"/>
            <div style="margin-top:2px;font-weight:bold;">Ensino Infantil<br><span style='font-size:12px;font-weight:normal;'>(4 a 5 anos)</span></div>
          </button>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <button class="bloom-folder" data-folder="fund1" aria-label="Ensino Fundamental I (6 a 10 anos)" title="Ensino Fundamental I (6 a 10 anos)">
            <img src="https://img.icons8.com/fluency/48/000000/folder-invoices.png" alt="Fundamental I"/>
            <div style="margin-top:2px;font-weight:bold;">Fundamental I<br><span style='font-size:12px;font-weight:normal;'>(6 a 10 anos)</span></div>
          </button>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <button class="bloom-folder" data-folder="fund2" aria-label="Ensino Fundamental II (11 a 14 anos)" title="Ensino Fundamental II (11 a 14 anos)">
            <img src="https://img.icons8.com/fluency/48/000000/folder-invoices.png" alt="Fundamental II"/>
            <div style="margin-top:2px;font-weight:bold;">Fundamental II<br><span style='font-size:12px;font-weight:normal;'>(11 a 14 anos)</span></div>
          </button>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <button class="bloom-folder" data-folder="medio" aria-label="Ensino Médio (15 a 17 anos)" title="Ensino Médio (15 a 17 anos)">
            <img src="https://img.icons8.com/fluency/48/000000/folder-invoices.png" alt="Ensino Médio"/>
            <div style="margin-top:2px;font-weight:bold;">Ensino Médio<br><span style='font-size:12px;font-weight:normal;'>(15 a 17 anos)</span></div>
          </button>
        </div>
      </div>
      <div style="text-align:center;margin-top:18px;">
        <button class="bloom-back" style="display:none;">← Voltar</button>
      </div>
    `;
    setBloomFolderEvents();
  }
  function setBloomFolderEvents() {
    bloomContent.querySelectorAll('.bloom-folder').forEach(btn => {
      btn.addEventListener('click', function() {
        const folder = btn.getAttribute('data-folder');
        renderBloomFolder(folder);
      });
      btn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
    const backBtn = bloomContent.querySelector('.bloom-back');
    if (backBtn) {
      backBtn.style.display = 'none';
    }
  }
  function renderBloomFolder(folder) {
    let html = '';
    let backLabel = '← Voltar';
    if (folder === 'infantil') {
      html = `
        <h3 style='color:#003366;'>Ensino Infantil (4 a 5 anos)</h3>
        <div style='display:flex;gap:24px;flex-wrap:wrap;justify-content:center;'>
          <div style='display:flex;flex-direction:column;align-items:center;'>
            <button class='bloom-folder' data-folder='infantil-lembrar' aria-label='Lembrar'>
              <img src='https://img.icons8.com/fluency/48/000000/folder-invoices.png' alt='Lembrar'/>
              <div style='margin-top:2px;'>Lembrar</div>
            </button>
          </div>
          <div style='display:flex;flex-direction:column;align-items:center;'>
            <button class='bloom-folder' data-folder='infantil-compreender' aria-label='Compreender'>
              <img src='https://img.icons8.com/fluency/48/000000/folder-invoices.png' alt='Compreender'/>
              <div style='margin-top:2px;'>Compreender</div>
            </button>
          </div>
        </div>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'infantil-lembrar') {
      html = `
        <h4 style='color:#003366;'>Lembrar (Infantil)</h4>
        <ul style='margin-left:18px;'>
          <li>📝 Atividades</li>
          <li>💡 Estratégias Metodológicas</li>
          <li>📚 Recursos Visuais e Lúdicos</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'infantil-compreender') {
      html = `
        <h4 style='color:#003366;'>Compreender (Infantil)</h4>
        <ul style='margin-left:18px;'>
          <li>📝 Atividades</li>
          <li>💡 Estratégias Metodológicas</li>
          <li>🎲 Jogos Didáticos</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'fund1') {
      html = `
        <h3 style='color:#003366;'>Ensino Fundamental I (6 a 10 anos)</h3>
        <div style='display:flex;gap:18px;flex-wrap:wrap;justify-content:center;'>
          <button class='bloom-folder' data-folder='fund1-lembrar'>Lembrar</button>
          <button class='bloom-folder' data-folder='fund1-compreender'>Compreender</button>
          <button class='bloom-folder' data-folder='fund1-aplicar'>Aplicar</button>
          <button class='bloom-folder' data-folder='fund1-analisar'>Analisar</button>
        </div>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'fund1-lembrar') {
      html = `
        <h4 style='color:#003366;'>Lembrar (Fundamental I)</h4>
        <ul style='margin-left:18px;'>
          <li>Atividades</li>
          <li>Metodologias (ex: repetição espaçada, cantigas)</li>
          <li>Recursos</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'fund1-compreender') {
      html = `
        <h4 style='color:#003366;'>Compreender (Fundamental I)</h4>
        <ul style='margin-left:18px;'>
          <li>Atividades (ex: reconto, analogias simples)</li>
          <li>Metodologias (ex: mapas mentais)</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'fund1-aplicar') {
      html = `
        <h4 style='color:#003366;'>Aplicar (Fundamental I)</h4>
        <ul style='margin-left:18px;'>
          <li>Atividades (problemas simples, experimentos guiados)</li>
          <li>Metodologias (aprendizagem baseada em projetos)</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'fund1-analisar') {
      html = `
        <h4 style='color:#003366;'>Analisar (Fundamental I)</h4>
        <ul style='margin-left:18px;'>
          <li>Atividades (classificações, comparações)</li>
          <li>Metodologias (estudos de caso simplificados)</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'fund2') {
      html = `
        <h3 style='color:#003366;'>Ensino Fundamental II (11 a 14 anos)</h3>
        <div style='display:flex;gap:18px;flex-wrap:wrap;justify-content:center;'>
          <button class='bloom-folder' data-folder='fund2-lembrar'>Lembrar</button>
          <button class='bloom-folder' data-folder='fund2-compreender'>Compreender</button>
          <button class='bloom-folder' data-folder='fund2-aplicar'>Aplicar</button>
          <button class='bloom-folder' data-folder='fund2-analisar'>Analisar</button>
          <button class='bloom-folder' data-folder='fund2-avaliar'>Avaliar</button>
          <button class='bloom-folder' data-folder='fund2-criar'>Criar</button>
        </div>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'fund2-avaliar') {
      html = `
        <h4 style='color:#003366;'>Avaliar (Fundamental II)</h4>
        <ul style='margin-left:18px;'>
          <li>Atividades (debates, justificativas)</li>
          <li>Metodologias (socratic method, rubricas)</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'fund2-criar') {
      html = `
        <h4 style='color:#003366;'>Criar (Fundamental II)</h4>
        <ul style='margin-left:18px;'>
          <li>Atividades (criação de maquetes, podcasts)</li>
          <li>Metodologias (sala de aula invertida, gamificação)</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'medio') {
      html = `
        <h3 style='color:#003366;'>Ensino Médio (15 a 17 anos)</h3>
        <div style='display:flex;gap:18px;flex-wrap:wrap;justify-content:center;'>
          <button class='bloom-folder' data-folder='medio-lembrar'>Lembrar</button>
          <button class='bloom-folder' data-folder='medio-compreender'>Compreender</button>
          <button class='bloom-folder' data-folder='medio-aplicar'>Aplicar</button>
          <button class='bloom-folder' data-folder='medio-analisar'>Analisar</button>
          <button class='bloom-folder' data-folder='medio-avaliar'>Avaliar</button>
          <button class='bloom-folder' data-folder='medio-criar'>Criar</button>
          <button class='bloom-folder' data-folder='medio-desafios'>Desafios e Avaliações Integradas</button>
        </div>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'medio-criar') {
      html = `
        <h4 style='color:#003366;'>Criar (Ensino Médio)</h4>
        <ul style='margin-left:18px;'>
          <li>Projetos Interdisciplinares</li>
          <li>Gincanas Científicas</li>
          <li>Simulações e Protótipos</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else if (folder === 'medio-desafios') {
      html = `
        <h4 style='color:#003366;'>Desafios e Avaliações Integradas (Ensino Médio)</h4>
        <ul style='margin-left:18px;'>
          <li>Gincanas avaliativas</li>
          <li>Trilhas gamificadas</li>
        </ul>
        <div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>
      `;
    } else {
      html = `<div style='text-align:center;color:#888;'>Conteúdo em desenvolvimento.</div><div style='text-align:center;margin-top:18px;'><button class='bloom-back'>${backLabel}</button></div>`;
    }
    bloomContent.innerHTML = html;
    setBloomFolderEvents();
    bloomContent.querySelector('.bloom-back').addEventListener('click', function() {
      if (folder.includes('-')) {
        // Volta para o nível anterior
        const parent = folder.split('-')[0];
        renderBloomFolder(parent);
      } else {
        renderBloomRoot();
      }
    });
  }

  // --- Atalho do disquete: abre janela de registro de metodologias ---
  const metodologiasBtn = document.getElementById('icon-metodologias');
  const metodologiasWindow = document.getElementById('metodologias-window');
  const metodologiasTitleBar = document.getElementById('metodologias-title-bar');
  const metodologiasCloseBtn = document.getElementById('metodologias-close-btn');
  const metodologiasMinimizeBtn = document.getElementById('metodologias-minimize-btn');

  if (metodologiasBtn) {
    metodologiasBtn.addEventListener('click', function() {
      metodologiasWindow.style.display = 'block';
      metodologiasWindow.style.zIndex = 2100;
      metodologiasBtn.focus();
    });
    metodologiasBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        metodologiasBtn.click();
      }
    });
  }
  if (metodologiasCloseBtn) metodologiasCloseBtn.addEventListener('click', function() {
    metodologiasWindow.style.display = 'none';
  });
  if (metodologiasMinimizeBtn) metodologiasMinimizeBtn.addEventListener('click', function() {
    metodologiasWindow.style.display = 'none';
  });
  // Drag da janela de metodologias
  if (metodologiasTitleBar) {
    (function() {
      let isDragging = false;
      let offsetX = 0, offsetY = 0;
      let dragMouseMove, dragMouseUp;
      metodologiasTitleBar.style.cursor = 'move';
      metodologiasTitleBar.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = metodologiasWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        dragMouseMove = function(ev) {
          if (!isDragging) return;
          metodologiasWindow.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
          metodologiasWindow.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
        };
        dragMouseUp = function() {
          isDragging = false;
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', dragMouseMove);
          document.removeEventListener('mouseup', dragMouseUp);
        };
        document.addEventListener('mousemove', dragMouseMove);
        document.addEventListener('mouseup', dragMouseUp);
      });
    })();
  }

  // --- Atalho da carta: abre janela de envio de atividades ---
  const emailBtn = document.getElementById('icon-email');
  const emailWindow = document.getElementById('email-window');
  const emailTitleBar = document.getElementById('email-title-bar');
  const emailCloseBtn = document.getElementById('email-close-btn');
  const emailMinimizeBtn = document.getElementById('email-minimize-btn');

  if (emailBtn) {
    emailBtn.addEventListener('click', function(e) {
      e.preventDefault();
      emailWindow.style.display = 'block';
      emailWindow.style.zIndex = 2100;
      emailBtn.focus();
    });
    emailBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        emailBtn.click();
      }
    });
  }
  if (emailCloseBtn) emailCloseBtn.addEventListener('click', function() {
    emailWindow.style.display = 'none';
  });
  if (emailMinimizeBtn) emailMinimizeBtn.addEventListener('click', function() {
    emailWindow.style.display = 'none';
  });
  // Drag da janela de email
  if (emailTitleBar) {
    (function() {
      let isDragging = false;
      let offsetX = 0, offsetY = 0;
      let dragMouseMove, dragMouseUp;
      emailTitleBar.style.cursor = 'move';
      emailTitleBar.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = emailWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        dragMouseMove = function(ev) {
          if (!isDragging) return;
          emailWindow.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
          emailWindow.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
        };
        dragMouseUp = function() {
          isDragging = false;
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', dragMouseMove);
          document.removeEventListener('mouseup', dragMouseUp);
        };
        document.addEventListener('mousemove', dragMouseMove);
        document.addEventListener('mouseup', dragMouseUp);
      });
    })();
  }

  // --- Bloco de Notas Win95 funcional ---
  const notepadBtn = document.getElementById('icon-notepad');
  const notepadWindow = document.getElementById('notepad-window');
  const notepadTitleBar = document.getElementById('notepad-title-bar');
  const notepadCloseBtn = document.getElementById('notepad-close-btn');
  const notepadMinimizeBtn = document.getElementById('notepad-minimize-btn');
  const notepadTextarea = document.getElementById('notepad-textarea');

  function openNotepad() {
    notepadWindow.style.display = 'block';
    notepadWindow.style.zIndex = 2100;
    notepadBtn.focus();
    const saved = localStorage.getItem('notepad-content');
    notepadTextarea.value = saved !== null ? saved : `📚 Planejamento e Preparação\nPlanejar aulas com objetivos claros e alinhados à BNCC ou currículo local.\n\nOrganizar conteúdos de forma progressiva e contextualizada.\n\nPreparar materiais didáticos (apresentações, vídeos, atividades, etc.).\n\nDesenvolver avaliações diagnósticas, formativas e somativas.\n\nAdaptar planos para alunos com necessidades específicas.\n\n🧑‍🏫 Em sala de aula\nEstimular a participação ativa dos alunos.\n\nCriar um ambiente acolhedor e seguro para a aprendizagem.\n\nUtilizar diferentes metodologias (tradicional, ativa, tecnológica, lúdica).\n\nMonitorar o progresso dos alunos durante as atividades.\n\nCorrigir atividades e fornecer feedback construtivo.\n\n🔄 Relacionamento e Comunicação\nManter boa comunicação com os alunos e suas famílias.\n\nTrabalhar em parceria com colegas e equipe pedagógica.\n\nParticipar de reuniões pedagógicas e conselhos de classe.\n\nPraticar a escuta ativa e o respeito às diversidades.\n\nEstimular a empatia e a cooperação entre os alunos.\n\n🔍 Avaliação e Reflexão\nAnalisar os resultados das avaliações para ajustar a prática.\n\nRefletir sobre o próprio desempenho como educador.\n\nRegistrar e acompanhar o desenvolvimento dos alunos.\n\nAplicar estratégias de recuperação e reforço.\n\nUsar indicadores de aprendizagem para replanejar quando necessário.\n\n🚀 Crescimento Profissional\nParticipar de cursos, oficinas e formações continuadas.\n\nAtualizar-se com as tendências educacionais e tecnológicas.\n\nLer artigos, livros e materiais pedagógicos.\n\nCompartilhar experiências e boas práticas com colegas.\n\nDesenvolver projetos interdisciplinares ou inovadores.\n\n❤️ Cuidado com o Bem-Estar\nManter equilíbrio entre trabalho e vida pessoal.\n\nPraticar autocuidado físico e emocional.\n\nBuscar apoio quando sentir sobrecarga.\n\nCelebrar conquistas, mesmo as pequenas.\n\nLembrar-se constantemente da importância do seu papel.`;
  }
  if (notepadBtn) {
    notepadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openNotepad();
    });
    notepadBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openNotepad();
      }
    });
  }
  if (notepadCloseBtn) notepadCloseBtn.addEventListener('click', function() {
    notepadWindow.style.display = 'none';
  });
  if (notepadMinimizeBtn) notepadMinimizeBtn.addEventListener('click', function() {
    notepadWindow.style.display = 'none';
  });
  if (notepadTextarea) {
    notepadTextarea.addEventListener('input', function() {
      localStorage.setItem('notepad-content', notepadTextarea.value);
    });
  }
  if (notepadTitleBar) {
    (function() {
      let isDragging = false;
      let offsetX = 0, offsetY = 0;
      let dragMouseMove, dragMouseUp;
      notepadTitleBar.style.cursor = 'move';
      notepadTitleBar.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = notepadWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        dragMouseMove = function(ev) {
          if (!isDragging) return;
          notepadWindow.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
          notepadWindow.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
        };
        dragMouseUp = function() {
          isDragging = false;
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', dragMouseMove);
          document.removeEventListener('mouseup', dragMouseUp);
        };
        document.addEventListener('mousemove', dragMouseMove);
        document.addEventListener('mouseup', dragMouseUp);
      });
    })();
  }

  // --- Atalho do navegador: abre janela de ferramentas digitais ---
  const navegadorBtn = document.getElementById('icon-navegador');
  const navegadorWindow = document.getElementById('navegador-window');
  const navegadorTitleBar = document.getElementById('navegador-title-bar');
  const navegadorCloseBtn = document.getElementById('navegador-close-btn');
  const navegadorMinimizeBtn = document.getElementById('navegador-minimize-btn');

  if (navegadorBtn) {
    navegadorBtn.addEventListener('click', function(e) {
      e.preventDefault();
      navegadorWindow.style.display = 'block';
      navegadorWindow.style.zIndex = 2200;
      navegadorBtn.focus();
    });
    navegadorBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navegadorBtn.click();
      }
    });
  }
  if (navegadorCloseBtn) navegadorCloseBtn.addEventListener('click', function() {
    navegadorWindow.style.display = 'none';
  });
  if (navegadorMinimizeBtn) navegadorMinimizeBtn.addEventListener('click', function() {
    navegadorWindow.style.display = 'none';
  });
  if (navegadorTitleBar) {
    (function() {
      let isDragging = false;
      let offsetX = 0, offsetY = 0;
      let dragMouseMove, dragMouseUp;
      navegadorTitleBar.style.cursor = 'move';
      navegadorTitleBar.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = navegadorWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        dragMouseMove = function(ev) {
          if (!isDragging) return;
          navegadorWindow.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
          navegadorWindow.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
        };
        dragMouseUp = function() {
          isDragging = false;
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', dragMouseMove);
          document.removeEventListener('mouseup', dragMouseUp);
        };
        document.addEventListener('mousemove', dragMouseMove);
        document.addEventListener('mouseup', dragMouseUp);
      });
    })();
  }

  // --- Fantasminha que segue o cursor ---
  const ghost = document.createElement('div');
  ghost.className = 'ghost-ghostie';
  ghost.innerHTML = '👻';
  document.body.appendChild(ghost);

  const ghostToggle = document.getElementById('ghost-toggle');
  let ghostActive = false;

  function moveGhost(x, y) {
    ghost.style.transform = `translate(${x - 24}px, ${y - 24}px)`;
  }

  function enableGhost() {
    ghost.style.display = 'block';
    ghostActive = true;
    ghostToggle.setAttribute('aria-pressed', 'true');
    window.addEventListener('mousemove', ghostFollowMouse);
    window.addEventListener('touchmove', ghostFollowTouch);
  }
  function disableGhost() {
    ghost.style.display = 'none';
    ghostActive = false;
    ghostToggle.setAttribute('aria-pressed', 'false');
    window.removeEventListener('mousemove', ghostFollowMouse);
    window.removeEventListener('touchmove', ghostFollowTouch);
  }
  function ghostFollowMouse(e) {
    moveGhost(e.clientX, e.clientY);
  }
  function ghostFollowTouch(e) {
    if (e.targetTouches && e.targetTouches[0]) {
      moveGhost(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
  }
  if (ghostToggle) {
    ghostToggle.addEventListener('click', function() {
      if (!ghostActive) {
        enableGhost();
      } else {
        disableGhost();
      }
    });
    ghostToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ghostToggle.click();
      }
    });
    window.addEventListener('blur', disableGhost);
  }

  // --- Botão de telefone: abre painel de contatos rápidos ---
  const phoneToggle = document.getElementById('phone-toggle');
  const phonePanel = document.getElementById('phone-panel');
  const phonePanelClose = document.getElementById('phone-panel-close');

  if (phoneToggle && phonePanel) {
    phoneToggle.addEventListener('click', function() {
      const isOpen = phonePanel.style.display === 'block';
      phonePanel.style.display = isOpen ? 'none' : 'block';
      phoneToggle.setAttribute('aria-pressed', isOpen ? 'false' : 'true');
    });
    phoneToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        phoneToggle.click();
      }
    });
  }
  if (phonePanelClose) phonePanelClose.addEventListener('click', function() {
    phonePanel.style.display = 'none';
    phoneToggle.setAttribute('aria-pressed', 'false');
  });
  // Fecha painel ao clicar fora
  document.addEventListener('mousedown', function(e) {
    if (phonePanel && phonePanel.style.display === 'block' && !phonePanel.contains(e.target) && e.target !== phoneToggle) {
      phonePanel.style.display = 'none';
      phoneToggle.setAttribute('aria-pressed', 'false');
    }
  });

  // --- Tooltip customizado para o botão LabLink ---
  const lablinkBtn = document.querySelector('.lablink-taskbar-btn');
  if (lablinkBtn) {
    let lablinkTooltip;
    lablinkBtn.addEventListener('mouseenter', function() {
      lablinkTooltip = document.createElement('div');
      lablinkTooltip.textContent = 'Lab Link – uma rede internacional de laboratórios escolares de Ciências! Aqui você poderá interagir com professores, estudantes e coordenadores do Brasil e do mundo.';
      lablinkTooltip.style.position = 'fixed';
      lablinkTooltip.style.background = '#ffffe1';
      lablinkTooltip.style.color = '#222';
      lablinkTooltip.style.border = '1.5px solid #b0c4de';
      lablinkTooltip.style.borderRadius = '6px';
      lablinkTooltip.style.padding = '10px 14px';
      lablinkTooltip.style.fontSize = '1em';
      lablinkTooltip.style.fontFamily = 'inherit';
      lablinkTooltip.style.boxShadow = '2px 4px 12px #0002';
      lablinkTooltip.style.zIndex = 9999;
      lablinkTooltip.style.maxWidth = '340px';
      lablinkTooltip.style.pointerEvents = 'none';
      document.body.appendChild(lablinkTooltip);
      const rect = lablinkBtn.getBoundingClientRect();
      lablinkTooltip.style.left = (rect.left + window.scrollX + rect.width/2 - lablinkTooltip.offsetWidth/2) + 'px';
      lablinkTooltip.style.top = (rect.top + window.scrollY - lablinkTooltip.offsetHeight - 12) + 'px';
      // Ajuste para centralizar após renderização
      setTimeout(() => {
        lablinkTooltip.style.left = (rect.left + window.scrollX + rect.width/2 - lablinkTooltip.offsetWidth/2) + 'px';
      }, 10);
    });
    lablinkBtn.addEventListener('mouseleave', function() {
      if (lablinkTooltip) {
        lablinkTooltip.remove();
        lablinkTooltip = null;
      }
    });
    lablinkBtn.addEventListener('focus', function() {
      lablinkBtn.dispatchEvent(new Event('mouseenter'));
    });
    lablinkBtn.addEventListener('blur', function() {
      lablinkBtn.dispatchEvent(new Event('mouseleave'));
    });
  }

  // --- Menu Iniciar estilo Win95 com lista de botões ---
  const startBtn = document.querySelector('.start-button');
  let startMenu = null;
  if (startBtn) {
    startBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (startMenu && startMenu.style.display === 'block') {
        startMenu.style.display = 'none';
        return;
      }
      if (!startMenu) {
        startMenu = document.createElement('div');
        startMenu.className = 'win95-start-menu';
        startMenu.style.position = 'fixed';
        startMenu.style.left = (startBtn.getBoundingClientRect().left + window.scrollX) + 'px';
        startMenu.style.bottom = '38px';
        startMenu.style.background = '#eaf2fb';
        startMenu.style.border = '2px solid #b0c4de';
        startMenu.style.borderRadius = '8px 8px 12px 12px';
        startMenu.style.boxShadow = '2px 4px 16px #0003';
        startMenu.style.padding = '12px 18px 10px 18px';
        startMenu.style.zIndex = 3002;
        startMenu.style.minWidth = '270px';
        startMenu.innerHTML = `
          <div style='font-weight:bold; color:#003366; margin-bottom:10px; font-size:1.1em;'>Iniciar</div>
          <button class='start-link' onclick="window.open('https://y43dl9fd46.app.yourware.so','_blank')">🔹 Simulador de Ondulatória</button><br>
          <button class='start-link' onclick="window.open('https://ejeu0w3i3k.app.yourware.so','_blank')">🔹 Repertórium</button><br>
          <button class='start-link' onclick="window.open('https://nf1h2g2gg6.app.yourware.so','_blank')">🔹 Binti</button><br>
          <button class='start-link' onclick="window.open('https://i07pp4r3zz.app.yourware.so','_blank')">🔹 Forense Each</button><br>
          <button class='start-link' onclick="window.open('https://docs.google.com/forms/d/e/1FAIpQLSfKrSP6qLYliIQVzpe9JRC1pjxgoq7GQIAPsUZzLCCEUI1KQA/viewform','_blank')">🔹 Eolipia</button><br>
          <button class='start-link' onclick="window.open('https://forms.gle/dyvZUrTKx6zuTXYz8','_blank')">🔹 PixelGases</button><br>
          <button class='start-link' onclick="window.open('https://www.canva.com/design/DAGigvD2BtU/BQnzZN-qHyxq34EWdLoDAQ/edit?utm_content=DAGigvD2BtU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton','_blank')">🔹 RPG de Física</button><br>
          <button class='start-link' onclick="window.open('https://view.genially.com/6539a6b282fa920012e1b012/interactive-content-escape-room-halloween','_blank')">🔹 Escape Room Halloween</button><br>
          <button class='start-link' onclick="window.open('https://drive.google.com/file/d/1MaX7E0XvfPwWHOVTaNAkjWZYpoJg59pc/view?usp=sharing','_blank')">🔹 Livro de Física</button>
        `;
        document.body.appendChild(startMenu);
      }
      startMenu.style.display = 'block';
      // Fecha ao clicar fora
      setTimeout(() => {
        document.addEventListener('mousedown', closeStartMenu, { once: true });
      }, 0);
    });
    function closeStartMenu(e) {
      if (startMenu && !startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.style.display = 'none';
      }
    }
  }
  // Estilo básico para os botões do menu iniciar
  const style = document.createElement('style');
  style.textContent = `
    .win95-start-menu button.start-link {
      display: block;
      width: 100%;
      text-align: left;
      background: #fff;
      border: 1.5px solid #b0c4de;
      border-radius: 5px;
      margin-bottom: 7px;
      padding: 7px 10px;
      font-size: 1em;
      color: #003366;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .win95-start-menu button.start-link:hover, .win95-start-menu button.start-link:focus {
      background: #dbeafe;
      color: #000080;
      outline: 2px solid #003366;
    }
  `;
  document.head.appendChild(style);

  // --- Imagens do carrossel de atividades enviadas por e-mail ---
  // Adicione os arquivos de imagem na pasta do projeto e ajuste os nomes conforme necessário.
  const emailCarouselImages = [
    "atividade1.png", // Experimento de Física
    "atividade2.png", // Aula Interativa
    "atividade3.png", // Projeto em Grupo
    "atividade4.jpg", // Apresentação de Aluno
    "atividade5.jpg"  // Atividade Lúdica
  ];

  // --- Atalho do Jogo Prof Ronaldo: abre janela com iframe e upload de avatar ---
  const jogoBtn = document.getElementById('icon-jogo');
  const jogoWindow = document.getElementById('jogo-window');
  const jogoTitleBar = document.getElementById('jogo-title-bar');
  const jogoCloseBtn = document.getElementById('jogo-close-btn');
  const jogoMinimizeBtn = document.getElementById('jogo-minimize-btn');
  const jogoIframe = document.getElementById('jogo-iframe');
  const jogoAvatarUpload = document.getElementById('jogo-avatar-upload');
  const jogoAvatarPreview = document.getElementById('jogo-avatar-preview');

  // Corrige o caminho do iframe do jogo para garantir compatibilidade máxima
  if (jogoIframe) {
    // Caminho relativo seguro, usando encoding para espaços
    const jogoPath = encodeURIComponent('Jogo prof ronaldo/index.html').replace(/%20/g, ' ');
    // Testa se o arquivo existe, senão tenta variações
    let tried = false;
    function setIframeSrc() {
      // Tenta com %20
      jogoIframe.src = 'Jogo%20prof%20ronaldo/index.html';
      jogoIframe.onerror = function() {
        if (!tried) {
          tried = true;
          // Tenta com espaço normal
          jogoIframe.src = 'Jogo prof ronaldo/index.html';
        }
      };
    }
    setIframeSrc();
  }

  if (jogoBtn) {
    jogoBtn.addEventListener('click', function(e) {
      e.preventDefault();
      jogoWindow.style.display = 'block';
      jogoWindow.style.zIndex = 2300;
      jogoBtn.focus();
    });
    jogoBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        jogoBtn.click();
      }
    });
  }
  if (jogoCloseBtn) jogoCloseBtn.addEventListener('click', function() {
    jogoWindow.style.display = 'none';
  });
  if (jogoMinimizeBtn) jogoMinimizeBtn.addEventListener('click', function() {
    jogoWindow.style.display = 'none';
  });
  // Drag da janela do jogo
  if (jogoTitleBar) {
    (function() {
      let isDragging = false;
      let offsetX = 0, offsetY = 0;
      let dragMouseMove, dragMouseUp;
      jogoTitleBar.style.cursor = 'move';
      jogoTitleBar.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = jogoWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        dragMouseMove = function(ev) {
          if (!isDragging) return;
          jogoWindow.style.left = (ev.clientX - offsetX + window.scrollX) + 'px';
          jogoWindow.style.top = (ev.clientY - offsetY + window.scrollY) + 'px';
        };
        dragMouseUp = function() {
          isDragging = false;
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', dragMouseMove);
          document.removeEventListener('mouseup', dragMouseUp);
        };
        document.addEventListener('mousemove', dragMouseMove);
        document.addEventListener('mouseup', dragMouseUp);
      });
    })();
  }
  // Upload de avatar para o jogo
  if (jogoAvatarUpload) {
    jogoAvatarUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        // Exibe preview
        jogoAvatarPreview.innerHTML = `<img src='${ev.target.result}' alt='Avatar' style='max-width:80px;max-height:80px;border-radius:8px;border:2px solid #b0c4de;'>`;
        // Envia para o iframe do jogo (se implementado no jogo)
        if (jogoIframe && jogoIframe.contentWindow) {
          jogoIframe.contentWindow.postMessage({ type: 'avatar', data: ev.target.result }, '*');
        }
      };
      reader.readAsDataURL(file);
    });
  }
});