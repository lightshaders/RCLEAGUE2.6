(function () {
  const PRIVATE_SIZES = [
    { id: '1v1', label: '1v1', teams: 1 },
    { id: '2v2', label: '2v2', teams: 2 },
    { id: '3v3', label: '3v3', teams: 3 },
    { id: '4v4', label: '4v4', teams: 4 },
    { id: '5v5', label: '5v5', teams: 5 },
    { id: '6v6', label: '6v6', teams: 6 }
  ];

  const TRAINING_ACTIONS = [
    { id: 'takePossession', label: 'Take Possession' },
    { id: 'startDribble', label: 'Start Dribble' },
    { id: 'passBall', label: 'Pass Ball' },
    { id: 'launchBall', label: 'Launch Ball' }
  ];

  function injectStyles() {
    if (document.getElementById('turball-custom-match-patches-style')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'turball-custom-match-patches-style';
    style.textContent = `
      .turball-custom-size-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .turball-custom-size-btn,
      .turball-practice-btn {
        appearance: none;
        border: 1px solid rgba(255,255,255,0.28);
        background: rgba(8, 19, 27, 0.86);
        color: #edf6ff;
        border-radius: 999px;
        padding: 7px 12px;
        font-size: 12px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        cursor: pointer;
      }
      .turball-custom-size-btn.is-active,
      .turball-practice-btn.is-active {
        background: linear-gradient(135deg, rgba(74, 190, 255, 0.25), rgba(214, 176, 255, 0.25));
        border-color: rgba(125, 212, 255, 0.9);
      }
      .turball-practice-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
    `;
    document.head.appendChild(style);
  }

  function addSizeControls(target) {
    if (!target || target.dataset.turballSizesPatched === 'true') {
      return;
    }

    const sizeGrid = document.createElement('div');
    sizeGrid.className = 'turball-custom-size-grid';

    PRIVATE_SIZES.forEach((size) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'turball-custom-size-btn';
      button.textContent = size.label;
      button.dataset.turballSize = size.id;
      button.addEventListener('click', () => {
        target.dataset.privateSize = size.id;
        target.dataset.matchSize = size.id;
        target.dataset.size = size.id;
        target.setAttribute('data-match-size', size.id);

        sizeGrid.querySelectorAll('.turball-custom-size-btn').forEach((btn) => {
          btn.classList.toggle('is-active', btn === button);
        });
      });
      sizeGrid.appendChild(button);
    });

    target.appendChild(sizeGrid);
    target.dataset.turballSizesPatched = 'true';
  }

  function addPracticeControls(target) {
    if (!target || target.dataset.turballPracticePatched === 'true') {
      return;
    }

    const actionRow = document.createElement('div');
    actionRow.className = 'turball-practice-actions';

    TRAINING_ACTIONS.forEach((action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'turball-practice-btn';
      button.textContent = action.label;
      button.dataset.turballPracticeAction = action.id;
      button.addEventListener('click', () => {
        button.classList.toggle('is-active');
        target.dataset.practiceAction = action.id;
      });
      actionRow.appendChild(button);
    });

    target.appendChild(actionRow);
    target.dataset.turballPracticePatched = 'true';
  }

  function patchMatchUI() {
    const matchPanels = document.querySelectorAll(
      '[data-private-mode], [data-rule], [data-mode-id], [data-private-game], [data-game-type], [data-match-type]'
    );

    matchPanels.forEach((panel) => {
      const text = (panel.textContent || '').toLowerCase();
      const isGameType = /low gravity|fast ball|dropshot|heatseeker|chaos|hoops|rumble|snow|duel|doubles|standard/.test(text);
      if (isGameType) {
        addSizeControls(panel);
      }
    });

    const practiceTargets = document.querySelectorAll(
      '[data-match-settings], [data-private-settings], [data-settings-panel], .match-settings, .private-menu, .match-setup, .settings-panel'
    );

    practiceTargets.forEach((target) => {
      const text = (target.textContent || '').toLowerCase();
      const isMatchContext = /match|private|training|practice/.test(text);
      if (isMatchContext) {
        addPracticeControls(target);
      }
    });
  }

  function init() {
    injectStyles();
    patchMatchUI();

    const observer = new MutationObserver(() => {
      patchMatchUI();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-private-mode', 'data-game-type']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
