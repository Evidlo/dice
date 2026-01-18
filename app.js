(function() {
  'use strict';

  const roller = new rpgDiceRoller.DiceRoller();
  let diceEntries = [];
  let nextId = 1;

  // DOM elements
  const diceEntriesContainer = document.getElementById('diceEntries');
  const newLabelInput = document.getElementById('newLabel');
  const newNotationInput = document.getElementById('newNotation');
  const addBtn = document.getElementById('addBtn');
  const helpBtn = document.getElementById('helpBtn');
  const helpModal = document.getElementById('helpModal');
  const closeHelpBtn = document.getElementById('closeHelpBtn');

  function addEntry(label, notation, updateUrlFlag = true) {
    const entry = {
      id: nextId++,
      label: label || 'Roll',
      notation: notation || '1d6'
    };
    diceEntries.push(entry);
    renderEntries();
    if (updateUrlFlag) {
      updateUrl();
    }
  }

  function removeEntry(id) {
    diceEntries = diceEntries.filter(e => e.id !== id);
    renderEntries();
    updateUrl();
  }

  function updateUrl() {
    const params = new URLSearchParams();
    if (diceEntries.length > 0) {
      const diceParam = diceEntries.map(e =>
        `${encodeURIComponent(e.label)}:${encodeURIComponent(e.notation)}`
      ).join(',');
      params.set('dice', diceParam);
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    history.replaceState(null, '', newUrl);
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const diceParam = params.get('dice');
    if (diceParam) {
      const entries = diceParam.split(',');
      entries.forEach(entry => {
        const colonIndex = entry.indexOf(':');
        if (colonIndex !== -1) {
          const label = decodeURIComponent(entry.substring(0, colonIndex));
          const notation = decodeURIComponent(entry.substring(colonIndex + 1));
          addEntry(label, notation, false);
        }
      });
      updateUrl();
    }
  }

  function rollDice(id) {
    const entry = diceEntries.find(e => e.id === id);
    if (!entry) return;

    const resultsDiv = document.getElementById(`results-${id}`);
    if (!resultsDiv) return;

    // Show loading bar
    resultsDiv.innerHTML = '<progress></progress>';

    // After 0.5s, show results
    setTimeout(() => {
      try {
        const roll = roller.roll(entry.notation);
        const diceResults = extractDiceResults(roll);
        const total = roll.total;

        let html = '';
        diceResults.forEach(value => {
          html += `<span class="die-result">${value}</span>`;
        });
        html += `<span class="roll-total">Sum ${total}</span>`;
        resultsDiv.innerHTML = html;
      } catch (err) {
        resultsDiv.innerHTML = `<span style="color: var(--pico-del-color);">Error: ${err.message}</span>`;
      }
    }, 500);
  }

  function extractDiceResults(roll) {
    const results = [];
    if (roll.rolls) {
      roll.rolls.forEach(rollPart => {
        if (rollPart.rolls) {
          rollPart.rolls.forEach(die => {
            if (typeof die.value === 'number') {
              results.push(die.value);
            } else if (typeof die === 'number') {
              results.push(die);
            }
          });
        }
      });
    }
    return results;
  }

  function renderEntries() {
    diceEntriesContainer.innerHTML = '';

    diceEntries.forEach(entry => {
      const article = document.createElement('article');
      article.className = 'dice-entry';
      article.innerHTML = `
        <div class="entry-header">
          <span class="label">${escapeHtml(entry.label)}</span>
          <span class="notation">(${escapeHtml(entry.notation)})</span>
          <button class="blue roll-btn" data-id="${entry.id}">Roll</button>
          <button class="red remove-btn" data-id="${entry.id}">×</button>
        </div>
        <div class="entry-results" id="results-${entry.id}"></div>
      `;
      diceEntriesContainer.appendChild(article);
    });

    // Attach event listeners
    document.querySelectorAll('.roll-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        rollDice(id);
      });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        removeEntry(id);
      });
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function openHelpModal() {
    helpModal.showModal();
  }

  function closeHelpModal() {
    helpModal.close();
  }

  // Event listeners
  addBtn.addEventListener('click', () => {
    const label = newLabelInput.value.trim();
    const notation = newNotationInput.value.trim();
    if (notation) {
      addEntry(label, notation);
      newLabelInput.value = '';
      newNotationInput.value = '1d6';
      newLabelInput.focus();
    }
  });

  // Allow Enter key to add entry
  newNotationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addBtn.click();
    }
  });
  newLabelInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addBtn.click();
    }
  });

  helpBtn.addEventListener('click', openHelpModal);
  closeHelpBtn.addEventListener('click', closeHelpModal);

  // Close modal when clicking outside
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      closeHelpModal();
    }
  });

  // Load dice from URL on page load
  loadFromUrl();
})();
