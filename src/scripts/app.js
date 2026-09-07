/**
 * Mind Odyssey - Main Application Controller
 */

class MindOdysseyApp {
  constructor() {
    this.currentStep = 1; // 1: Dilemma, 2: Core, 3: Takeaway, 4: Three Doors
    this.activeNode = null;
    this.selectedOption = null;
    this._syncBadgeTimer = null;

    this.initElements();
    this.initEvents();
    this.loadActiveNode();
    this.updateHUD();
    this.renderMap();
    this.renderProfile();

    // Non-blocking: pull latest cloud state on startup (silent merge)
    window.syncManager.initCloudPull().then(() => {
      this.updateHUD();
      this.renderMap();
      this.renderProfile();
    });
  }

  initElements() {
    // Nav
    this.navBtns = document.querySelectorAll('.nav-item');
    this.views = document.querySelectorAll('.page-view');

    // HUD
    this.muteBtn = document.getElementById('btn-toggle-sound');
    this.settingsBtn = document.getElementById('btn-open-settings');
    this.streakCount = document.getElementById('hud-streak-count');
    this.relicCount = document.getElementById('hud-relic-count');
    this.levelTag = document.getElementById('hud-level-tag');

    // Expedition Views
    this.heroDomain = document.getElementById('exp-hero-domain');
    this.heroEn = document.getElementById('exp-hero-en');
    this.heroTitle = document.getElementById('exp-hero-title');
    this.heroSubtitle = document.getElementById('exp-hero-subtitle');
    this.readTimer = document.getElementById('exp-reading-time');

    // Stepper
    this.stepDots = document.querySelectorAll('.step-dot');

    // Stages
    this.stageDilemma = document.getElementById('stage-dilemma');
    this.stageCore = document.getElementById('stage-core');
    this.stageTakeaway = document.getElementById('stage-takeaway');
    this.threeDoorsSection = document.getElementById('three-doors-section');

    // Dilemma elements
    this.dilemmaPrompt = document.getElementById('dilemma-prompt-text');
    this.dilemmaOptionsContainer = document.getElementById('dilemma-options-container');
    this.dilemmaResult = document.getElementById('dilemma-result-box');
    this.btnToCore = document.getElementById('btn-to-core');

    // Core elements
    this.coreEssence = document.getElementById('core-essence-text');
    this.coreAnalogy = document.getElementById('core-analogy-text');
    this.jargonLexiconBox = document.getElementById('jargon-lexicon-box');
    this.jargonLexiconChips = document.getElementById('jargon-lexicon-chips');
    this.btnToTakeaway = document.getElementById('btn-to-takeaway');
    this.btnBackToDilemma = document.getElementById('btn-back-to-dilemma');

    // Takeaway elements
    this.takeawayAction = document.getElementById('takeaway-action-text');
    this.artifactPreviewIcon = document.getElementById('artifact-preview-icon');
    this.artifactPreviewName = document.getElementById('artifact-preview-name');
    this.btnCompleteNode = document.getElementById('btn-complete-node');
    this.btnBackToCore = document.getElementById('btn-back-to-core');

    // Doors elements
    this.doorsContainer = document.getElementById('doors-list-container');
    this.btnPassDoors = document.getElementById('btn-pass-doors');

    // Jargon Bubble
    this.jargonBubble = document.getElementById('jargon-bubble-popover');
    this.jargonTermTitle = document.getElementById('jargon-title-text');
    this.jargonTermDesc = document.getElementById('jargon-desc-text');
    this.jargonCloseBtn = document.getElementById('btn-close-jargon');

    // Settings Modal
    this.settingsModal = document.getElementById('modal-settings');
    this.closeSettingsBtn = document.getElementById('btn-close-settings');
    this.saveSettingsBtn = document.getElementById('btn-save-settings');
    this.btnSyncNow = document.getElementById('btn-sync-now');
    this.gistTokenInput = document.getElementById('input-gist-token');
    this.gistIdInput = document.getElementById('input-gist-id');
    this.btnExportJson = document.getElementById('btn-export-json');
    this.btnImportJson = document.getElementById('btn-import-json');
    this.btnResetProgress = document.getElementById('btn-reset-progress');
    this.fileImportInput = document.getElementById('file-import-input');
    this.geminiKeyInput = document.getElementById('input-gemini-key');
    this.openrouterKeyInput = document.getElementById('input-openrouter-key');


    // Codex Modal (好讀模式)
    this.codexModal = document.getElementById('codex-modal');
    this.btnCloseCodex = document.getElementById('btn-close-codex');
    this.btnCodexReplay = document.getElementById('btn-codex-replay');
    this.codexContentBody = document.getElementById('codex-content-body');
    this.codexHeaderTitle = document.getElementById('codex-header-title');

    // Radar Modal
    this.radarModal = document.getElementById('radar-modal');
    this.btnOpenRadar = document.getElementById('btn-open-radar');
    this.btnCloseRadar = document.getElementById('btn-close-radar');
    this.radarDomainsContainer = document.getElementById('radar-domains-container');
    this.probeInput = document.getElementById('probe-input');
    this.btnLaunchProbe = document.getElementById('btn-launch-probe');
    this.probeTagBtns = document.querySelectorAll('.probe-tag-btn');

    // Deep Inquiry Terminal
    this.inquiryTerminal = document.getElementById('inquiry-terminal');
    this.inquiryChipsContainer = document.getElementById('inquiry-chips-container');
    this.inquiryCustomInput = document.getElementById('inquiry-custom-input');
    this.btnSubmitInquiry = document.getElementById('btn-submit-inquiry');
    this.inquiryResponseBox = document.getElementById('inquiry-response-box');
    this.inquiryResponseText = document.getElementById('inquiry-response-text');
    this.inquiryResponseTitle = document.getElementById('inquiry-response-title');
    this.inquirySourceTag = document.getElementById('inquiry-source-tag');

    // Toast
    this.toast = document.getElementById('toast-msg');
  }

  initEvents() {
    // Codex Modal close
    if (this.btnCloseCodex) {
      this.btnCloseCodex.addEventListener('click', () => {
        if (this.codexModal) this.codexModal.classList.remove('active');
      });
    }
    if (this.codexModal) {
      this.codexModal.addEventListener('click', (e) => {
        if (e.target === this.codexModal) this.codexModal.classList.remove('active');
      });
    }

    // Navigation
    this.navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playCardFlip();
        const targetViewId = btn.dataset.view;
        this.switchView(targetViewId);
      });
    });

    // Deep Inquiry Terminal Events
    if (this.btnSubmitInquiry) {
      this.btnSubmitInquiry.addEventListener('click', () => {
        const q = this.inquiryCustomInput ? this.inquiryCustomInput.value.trim() : '';
        if (q) this.handleInquiry(q);
      });
    }

    if (this.inquiryCustomInput) {
      this.inquiryCustomInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = this.inquiryCustomInput.value.trim();
          if (q) this.handleInquiry(q);
        }
      });
    }

    // Audio Toggle
    if (this.muteBtn) {
      this.updateSoundBtn();
      this.muteBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        this.updateSoundBtn();
        this.showToast(isMuted ? '🔇 音效已靜音' : '🔊 音效已開啟');
      });
    }

    // Stage 1 -> 2
    if (this.btnToCore) {
      this.btnToCore.addEventListener('click', () => {
        window.soundEngine.playCardFlip();
        this.setStep(2);
      });
    }

    // Stage 2 -> 3
    if (this.btnToTakeaway) {
      this.btnToTakeaway.addEventListener('click', () => {
        window.soundEngine.playCardFlip();
        this.setStep(3);
      });
    }

    if (this.btnBackToDilemma) {
      this.btnBackToDilemma.addEventListener('click', () => {
        window.soundEngine.playCardFlip();
        this.setStep(1);
      });
    }

    // Stage 3 -> Complete & Reveal Doors
    if (this.btnCompleteNode) {
      this.btnCompleteNode.addEventListener('click', () => {
        window.soundEngine.playUnlockNode();
        this.completeActiveNode();
      });
    }

    if (this.btnBackToCore) {
      this.btnBackToCore.addEventListener('click', () => {
        window.soundEngine.playCardFlip();
        this.setStep(2);
      });
    }

    // Pass Doors (Random exploration)
    if (this.btnPassDoors) {
      this.btnPassDoors.addEventListener('click', () => {
        window.soundEngine.playPortalSelect();
        this.handlePassDoors();
      });
    }

    // Jargon close
    if (this.jargonCloseBtn) {
      this.jargonCloseBtn.addEventListener('click', () => {
        this.jargonBubble.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (this.jargonBubble && this.jargonBubble.classList.contains('active') && !this.jargonBubble.contains(e.target) && !e.target.classList.contains('jargon-term')) {
        this.jargonBubble.classList.remove('active');
      }
    });

    // Settings Modal
    if (this.settingsBtn) {
      this.settingsBtn.addEventListener('click', () => {
        this.openSettings();
      });
    }

    if (this.closeSettingsBtn) {
      this.closeSettingsBtn.addEventListener('click', () => {
        if (this.settingsModal) this.settingsModal.classList.remove('active');
      });
    }

    this.saveSettingsBtn.addEventListener('click', () => {
      const geminiVal = this.geminiKeyInput ? this.geminiKeyInput.value : '';
      const openrouterVal = this.openrouterKeyInput ? this.openrouterKeyInput.value : '';
      window.syncManager.saveGistConfig(this.gistTokenInput.value, this.gistIdInput.value, geminiVal, openrouterVal);
      this.showToast('✅ 設定已儲存（含 Gemini 與 OpenRouter 雙軌金鑰）');
      this.settingsModal.classList.remove('active');
      // Auto push after settings saved (connects the pipe for the first time)
      window.syncManager.tryCloudSync(() => this.showSyncBadge());
    });

    this.btnSyncNow.addEventListener('click', async () => {
      this.btnSyncNow.disabled = true;
      this.btnSyncNow.innerHTML = '↻ 同步中...';
      try {
        // Pull first (get remote changes), then push local state up
        const pullRes = await window.syncManager.pullFromGist();
        const pushRes = await window.syncManager.tryCloudSync(() => this.showSyncBadge());
        
        if (pushRes.success || (pullRes && pullRes.success)) {
          this.updateSyncStatus();
          this.showToast('☁️ 雙向同步完成！(雲端與本機已對齊)');
          this.updateHUD();
          this.renderMap();
          this.renderProfile();
        } else {
          const reason = pushRes.reason || (pullRes ? pullRes.reason : '連線失敗');
          this.showToast('❌ 同步失敗: ' + reason);
        }
      } catch (err) {
        console.error('Manual sync failed:', err);
        this.showToast('❌ 同步錯誤: ' + (err.message || '請確認網路與金鑰'));
      } finally {
        this.btnSyncNow.disabled = false;
        this.btnSyncNow.innerHTML = '↕ 雙向同步 (Pull + Push)';
      }
    });

    this.btnExportJson.addEventListener('click', () => {
      window.syncManager.exportJSON();
    });

    this.btnImportJson.addEventListener('click', () => {
      this.fileImportInput.click();
    });

    this.fileImportInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const ok = window.syncManager.importJSON(event.target.result);
        if (ok) {
          this.showToast('📥 備份匯入成功！');
          location.reload();
        } else {
          this.showToast('❌ 匯入失敗，格式錯誤');
        }
      };
      reader.readAsText(file);
    });

    if (this.btnResetProgress) {
      this.btnResetProgress.addEventListener('click', () => {
        if (confirm('確定要重置所有探險進度嗎？\n這將會清除所有進度，從第一天「智豬博弈」全新出發。')) {
          window.syncManager.resetProgress();
          this.showToast('🔄 進度已重置！');
          setTimeout(() => location.reload(), 400);
        }
      });
    }

    // Radar Modal Events
    if (this.btnOpenRadar) {
      this.btnOpenRadar.addEventListener('click', () => {
        window.soundEngine.playCardFlip();
        this.openRadar();
      });
    }

    if (this.btnCloseRadar) {
      this.btnCloseRadar.addEventListener('click', () => {
        if (this.radarModal) this.radarModal.classList.remove('active');
      });
    }

    if (this.radarModal) {
      this.radarModal.addEventListener('click', (e) => {
        if (e.target === this.radarModal) this.radarModal.classList.remove('active');
      });
    }

    if (this.settingsModal) {
      this.settingsModal.addEventListener('click', (e) => {
        if (e.target === this.settingsModal) this.settingsModal.classList.remove('active');
      });
    }

    if (this.btnLaunchProbe) {
      this.btnLaunchProbe.addEventListener('click', () => {
        this.handleLaunchProbe();
      });
    }

    if (this.probeInput) {
      this.probeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleLaunchProbe();
        }
      });
    }

    // Quick Inspiration Probe Tags
    if (this.probeTagBtns) {
      this.probeTagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const topic = btn.dataset.topic;
          const domain = btn.dataset.domain;
          if (this.probeInput) this.probeInput.value = topic;
          window.soundEngine.playDilemmaSelect();
          this.handleLaunchProbe(topic, domain);
        });
      });
    }

    // Listen for background sync success (from completeNode, addCustomNode, etc.)
    window.addEventListener('gist-sync-success', () => this.showSyncBadge());

    // Pull on tab/app focus: catches cross-device changes (phone → computer)
    // Only pull if >3 min since last pull to avoid hammering the API
    this._lastPullTime = Date.now();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const msSinceLast = Date.now() - this._lastPullTime;
        if (msSinceLast > 3 * 60 * 1000) {
          this._lastPullTime = Date.now();
          window.syncManager.pullFromGist().then(res => {
            if (res.success) {
              this.updateHUD();
              this.renderMap();
              this.renderProfile();
            }
          });
        }
      }
    });
  }


  updateSoundBtn() {
    if (!this.muteBtn) return;
    const isMuted = window.soundEngine ? window.soundEngine.isMuted : false;
    this.muteBtn.classList.toggle('active', !isMuted);
    this.muteBtn.title = isMuted ? '音效已靜音（點擊開啟）' : '音效已開啟（點擊靜音）';
    this.muteBtn.innerHTML = isMuted
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>`;
  }

  renderRadar() {
    if (!this.radarDomainsContainer) return;
    this.radarDomainsContainer.innerHTML = '';
    const dynamicDomains = this.getDynamicDomains();
    const state = window.syncManager.state;

    dynamicDomains.forEach(d => {
      const card = document.createElement('div');
      card.className = 'radar-domain-card tactical-frame';
      card.style.border = `1px solid ${d.color}44`;
      card.style.background = 'rgba(15, 23, 42, 0.6)';
      card.style.borderRadius = '6px';
      card.style.padding = '12px';
      card.style.marginBottom = '8px';

      const nodesInDomain = window.MIND_DATABASE.filter(n => n.domainId === d.id);
      const litCount = nodesInDomain.filter(n => state.completedNodes.includes(n.id)).length;

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px; color: ${d.color}; font-weight: 700;">
            <span>${d.glyph}</span>
            <span style="font-size: 13px;">${d.name}</span>
          </div>
          <span style="font-size: 10px; font-family: var(--font-mono); color: ${d.color}; background: ${d.color}15; border: 1px solid ${d.color}33; padding: 2px 6px; border-radius: 3px;">
            ${litCount} / ${nodesInDomain.length} 點亮
          </span>
        </div>
        <p style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin-bottom: 6px;">${d.desc}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          ${d.models.map(m => `
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.05); color: #cbd5e1; font-family: var(--font-mono);">
              ${m.cn}
            </span>
          `).join('')}
        </div>
      `;
      this.radarDomainsContainer.appendChild(card);
    });
  }

  openRadar() {
    this.renderRadar();
    if (this.radarModal) this.radarModal.classList.add('active');
  }

  switchView(viewId) {
    this.navBtns.forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
    this.views.forEach(v => v.classList.toggle('active', v.id === viewId));
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (viewId === 'view-map') {
      this.renderMap();
    } else if (viewId === 'view-profile') {
      this.renderProfile();
    }
  }

  loadActiveNode(nodeId = null) {
    const targetId = nodeId || window.syncManager.state.activeNodeId || 'boxed_pigs';
    this.activeNode = window.MIND_DATABASE.find(n => n.id === targetId) || window.MIND_DATABASE[0];
    this.selectedOption = null;

    // Reset Steps
    this.setStep(1);

    // Populate Hero (Clean Tactical Telemetry, No Emojis)
    this.heroDomain.textContent = `${this.activeNode.domain.toUpperCase()} // STAR SYSTEM`;
    if (this.heroEn) this.heroEn.textContent = this.activeNode.modelEn || '';
    this.heroTitle.textContent = this.activeNode.title;
    this.heroSubtitle.textContent = this.activeNode.subtitle;
    this.readTimer.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      EST. READ // ${this.activeNode.readingTime}
    `;

    // Populate Stage 1: Dilemma
    this.dilemmaPrompt.innerText = this.activeNode.dilemma.prompt;
    this.dilemmaResult.style.display = 'none';
    this.btnToCore.disabled = true;

    this.dilemmaOptionsContainer.innerHTML = '';
    this.activeNode.dilemma.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn tactical-frame';
      btn.innerHTML = `
        <div class="terminal-corner tl"></div>
        <div class="terminal-corner br"></div>
        <div class="option-stats-bar" style="width: 0%"></div>
        <div style="position: relative; z-index: 2; display: flex; align-items: baseline; gap: 8px;">
          <span class="tech-stamp">[COMM ${opt.id}]</span>
          <span>${opt.text}</span>
        </div>
        <span class="option-stats-text" style="position: relative; z-index: 2;">FLEET CONSENSUS // ${opt.stats}% 艦隊決策佔比</span>
      `;

      btn.addEventListener('click', () => {
        if (this.selectedOption) return; // Prevent re-pick
        window.soundEngine.playDilemmaSelect();
        this.handleDilemmaChoice(opt, btn);
      });

      this.dilemmaOptionsContainer.appendChild(btn);
    });

    // Populate Stage 2: Core & Jargons with Dotted Jargon Injection
    const injectJargons = (text) => {
      let formatted = text;
      (this.activeNode.core.jargons || []).forEach(j => {
        const regex = new RegExp(`(${j.term})`, 'g');
        formatted = formatted.replace(
          regex,
          `<span class="jargon-term" data-term="${j.term}" data-en="${j.en || ''}" data-exp="${j.explanation}">$1</span>`
        );
      });
      return formatted;
    };

    this.coreEssence.innerHTML = injectJargons(this.activeNode.core.essence);
    this.coreAnalogy.innerHTML = injectJargons(this.activeNode.core.analogy);

    // Re-bind Jargon Popovers across entire Stage 2
    this.stageCore.querySelectorAll('.jargon-term').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openJargonBubble(el.dataset.term, el.dataset.exp, el.dataset.en);
      });
    });

    // Populate Bilingual Jargon Lexicon Chips in Stage 2
    if (this.jargonLexiconChips) {
      this.jargonLexiconChips.innerHTML = '';
      const jargons = this.activeNode.core.jargons || [];
      if (jargons.length === 0) {
        if (this.jargonLexiconBox) this.jargonLexiconBox.style.display = 'none';
      } else {
        if (this.jargonLexiconBox) this.jargonLexiconBox.style.display = 'flex';
        jargons.forEach(j => {
          const chip = document.createElement('div');
          chip.className = 'jargon-chip';
          chip.innerHTML = `
            <span class="jargon-chip-cn">💡 ${j.term}</span>
            ${j.en ? `<span class="jargon-chip-en">${j.en}</span>` : ''}
          `;
          chip.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openJargonBubble(j.term, j.explanation, j.en);
          });
          this.jargonLexiconChips.appendChild(chip);
        });
      }
    }

    // Populate Stage 3: Takeaway & Relic Preview
    this.takeawayAction.textContent = this.activeNode.takeaway.action;
    if (this.activeNode.relicReward && this.artifactPreviewName && this.artifactPreviewIcon) {
      this.artifactPreviewName.textContent = this.activeNode.relicReward.name;
      this.artifactPreviewIcon.innerHTML = this.activeNode.relicReward.svg
        ? `<img src="${this.activeNode.relicReward.svg}" alt="${this.activeNode.relicReward.name}">`
        : `<span>✦</span>`;
    }

    // Reset Three Doors
    this.threeDoorsSection.style.display = 'none';
    this.renderThreeDoors();

    // Reset & Populate Inquiry Terminal
    if (this.inquiryResponseBox) this.inquiryResponseBox.style.display = 'none';
    if (this.inquiryCustomInput) this.inquiryCustomInput.value = '';
    this.renderInquiryChips();
  }

  handleDilemmaChoice(opt, selectedBtn) {
    this.selectedOption = opt.id;
    selectedBtn.classList.add('selected');

    // Animate stats bars
    const allBtns = this.dilemmaOptionsContainer.querySelectorAll('.option-btn');
    allBtns.forEach((b, idx) => {
      const optionData = this.activeNode.dilemma.options[idx];
      const bar = b.querySelector('.option-stats-bar');
      const statsText = b.querySelector('.option-stats-text');
      
      bar.style.width = `${optionData.stats}%`;
      statsText.style.display = 'block';
    });

    // Reveal result & enable next button
    this.dilemmaResult.innerHTML = `
      <div style="font-weight: 700; color: #38bdf8; font-family: var(--font-mono); font-size: 11px; margin-bottom: 4px;">// 戰術復盤演算結果 (FLEET CONSENSUS DECRYPTED)</div>
      <p style="margin-bottom: 6px; font-weight: 600; color: #f8fafc;">${opt.verdict}</p>
      <div style="font-size: 12px; color: #94a3b8; line-height: 1.5;">${this.activeNode.dilemma.reveal}</div>
    `;
    this.dilemmaResult.style.display = 'block';
    this.btnToCore.disabled = false;
  }

  setStep(stepNum) {
    this.currentStep = stepNum;

    // Update Dots
    this.stepDots.forEach((dot, idx) => {
      dot.classList.remove('active', 'completed');
      if (idx + 1 === stepNum) {
        dot.classList.add('active');
      } else if (idx + 1 < stepNum) {
        dot.classList.add('completed');
      }
    });

    // Toggle Stage Views
    this.stageDilemma.style.display = stepNum === 1 ? 'flex' : 'none';
    this.stageCore.style.display = stepNum === 2 ? 'flex' : 'none';
    this.stageTakeaway.style.display = stepNum === 3 ? 'flex' : 'none';

    // Auto-scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openJargonBubble(term, explanation, enTerm = '') {
    window.soundEngine.playDilemmaSelect();
    this.jargonTermTitle.innerHTML = `
      <div class="jargon-title-container">
        <div class="jargon-title-cn">
          <span>💡</span>
          <span>${term}</span>
        </div>
        ${enTerm ? `<div class="jargon-en-badge">${enTerm}</div>` : ''}
      </div>
    `;
    this.jargonTermDesc.textContent = explanation;
    this.jargonBubble.classList.add('active');
  }

  completeActiveNode() {
    this.stageTakeaway.style.display = 'none';
    this.threeDoorsSection.style.display = 'flex';

    // Mark completed in storage
    window.syncManager.completeNode(this.activeNode.id, this.selectedOption || 'A');

    this.updateHUD();
    const relic = this.activeNode.relicReward;
    if (relic) {
      this.showToast(`✦ 思維神器打撈完畢：【${relic.name}】！+15 戰略理性 // 破局直覺強化`);
    } else {
      this.showToast(`✦ 星系節點【${this.activeNode.title.split('：')[0]}】已點亮！`);
    }
    
    // Scroll to doors smoothly
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  renderThreeDoors() {
    this.doorsContainer.innerHTML = '';
    const doors = this.activeNode.doors || [];
    this.renderDoorCards(doors, false);

    // If user has API keys configured, dynamically explore 3 uncharted horizon doors
    const geminiKey = window.syncManager.gistConfig.geminiApiKey || '';
    const openrouterKey = window.syncManager.gistConfig.openrouterApiKey || '';
    if (geminiKey || openrouterKey) {
      this.fetchDynamicNewDoors(geminiKey, openrouterKey);
    }
  }

  renderDoorCards(doors, isAiGenerated = false) {
    if (!this.doorsContainer) return;
    this.doorsContainer.innerHTML = '';

    doors.forEach(door => {
      const doorCard = document.createElement('div');
      doorCard.className = 'door-card';
      
      let badgeClass = 'badge-deep';
      if (door.type === 'cross') badgeClass = 'badge-cross';
      if (door.type === 'twist') badgeClass = 'badge-twist';

      const targetNode = window.MIND_DATABASE.find(n => n.id === door.targetId);
      const targetEn = targetNode && targetNode.modelEn ? ` (${targetNode.modelEn})` : '';

      doorCard.innerHTML = `
        <div class="door-portal-icon">${door.icon || '🚪'}</div>
        <div class="door-info">
          <div style="display: flex; align-items: center;">
            <div class="door-badge ${badgeClass}">${door.badge}</div>
            ${isAiGenerated ? `<span class="door-ai-tag">✦ AI 探索</span>` : ''}
          </div>
          <div class="door-heading">${door.title}${targetEn ? `<span class="door-en-sub">${targetEn}</span>` : ''}</div>
          <div class="door-hook">${door.hook}</div>
        </div>
      `;

      doorCard.addEventListener('click', () => {
        window.soundEngine?.playPortalSelect?.();
        this.selectDoor(door.targetId, door.title);
      });

      this.doorsContainer.appendChild(doorCard);
    });
  }

  async fetchDynamicNewDoors(geminiKey, openrouterKey) {
    const prompt = `你是一位世界頂級心智模型教育策展人（兼具理查·費曼與查理·蒙格的視角）。
用戶剛通關掌握了心智模型【${this.activeNode.title}】（英文：${this.activeNode.modelEn || ''}，領域：${this.activeNode.domain}）。
請為用戶設計 3 個【全新、尚未在知識庫中出現、極具好奇心與現實威力】的課後探索門。
必須嚴格輸出純 JSON 陣列：
[
  {
    "type": "deep",
    "badge": "深入同域",
    "targetId": "英文唯一底線代碼_1",
    "title": "中文標題（例：演化博弈論：鷹鴿賽局）",
    "hook": "18字內充滿懸念的好奇心鉤子",
    "icon": "Emoji"
  },
  {
    "type": "cross",
    "badge": "跨界跳躍",
    "targetId": "英文唯一底線代碼_2",
    "title": "中文標題（例：物理學：資訊熵與宇宙本質）",
    "hook": "18字內充滿懸念的好奇心鉤子",
    "icon": "Emoji"
  },
  {
    "type": "twist",
    "badge": "反常識",
    "targetId": "英文唯一底線代碼_3",
    "title": "中文標題（例：統計學：倖存者偏差的隱形死角）",
    "hook": "18字內充滿懸念的好奇心鉤子",
    "icon": "Emoji"
  }
]`;

    let generatedDoors = null;

    // 1. Try Gemini
    if (geminiKey) {
      const models = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];
      for (const m of models) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          });
          if (res.ok) {
            const data = await res.json();
            generatedDoors = JSON.parse(data.candidates[0].content.parts[0].text);
            break;
          }
        } catch (e) {
          console.warn(`Dynamic doors gemini model ${m} failed:`, e);
        }
      }
    }

    // 2. Try OpenRouter Fallback
    if (!generatedDoors && openrouterKey) {
      const freeModels = ['minimax/minimax-m2.7:free', 'liquid/lfm-2.5-2.6b:free'];
      for (const m of freeModels) {
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openrouterKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin || 'http://localhost:3456',
              'X-Title': 'Super Mind Odyssey'
            },
            body: JSON.stringify({
              model: m,
              messages: [{ role: 'user', content: prompt }],
              response_format: { type: 'json_object' }
            })
          });
          if (res.ok) {
            const data = await res.json();
            const parsed = JSON.parse(data.choices[0].message.content);
            generatedDoors = Array.isArray(parsed) ? parsed : (parsed.doors || Object.values(parsed)[0]);
            break;
          }
        } catch (e) {
          console.warn(`Dynamic doors openrouter ${m} failed:`, e);
        }
      }
    }

    if (generatedDoors && Array.isArray(generatedDoors) && generatedDoors.length >= 3) {
      this.activeNode.doors = generatedDoors;
      this.renderDoorCards(generatedDoors, true);
      
      // Inject newly discovered horizon topics into Star Map as fogged uncharted nodes
      generatedDoors.forEach(d => {
        if (!window.MIND_DATABASE.some(n => n.id === d.targetId)) {
          window.MIND_DATABASE.push({
            id: d.targetId,
            domain: d.type === 'cross' ? '跨學科前沿' : this.activeNode.domain,
            domainId: d.type === 'cross' ? 'cross_frontier' : this.activeNode.domainId,
            title: d.title,
            subtitle: d.hook,
            icon: d.icon || '🌌',
            status: 'fogged'
          });
        }
      });
      this.renderMap();
      this.showToast('✨ AI 探測出 3 條全新跨域航向！已同步標記於迷霧星圖！');
    }
  }

  async selectDoor(targetId, title) {
    // Check if targetId already exists in database
    let targetNode = window.MIND_DATABASE.find(n => n.id === targetId);

    if (!targetNode) {
      // Node is an uncharted frontier door: graph self-expands on the fly!
      this.showToast(`🛰️ 探險傳送中：正在為全新航線【${title.substring(0, 14)}...】自主拓荒新星雲...`);
      try {
        const newNode = await this.synthesizeNode(title, null, targetId);
        window.syncManager.completeNode(this.activeNode.id, this.selectedOption || 'A', newNode.id);
        this.renderMap();
        this.renderProfile();
        this.updateHUD();
        this.loadActiveNode(newNode.id);
        this.switchView('view-expedition');
        this.showToast(`✨ 自主拓荒成功！已點亮全新【${newNode.domain}】節點！`);
        return;
      } catch (err) {
        console.error('Self expansion failed:', err);
      }
    }

    // Unlock target node and switch to it
    window.syncManager.completeNode(this.activeNode.id, this.selectedOption || 'A', targetId);
    this.showToast(`🚀 已選定明天的拓荒航線：${title.substring(0, 16)}...`);
    
    setTimeout(() => {
      this.loadActiveNode(targetId);
      this.switchView('view-expedition');
    }, 600);
  }

  handlePassDoors() {
    // Pick an uncompleted node at random
    const state = window.syncManager.state;
    const remaining = window.MIND_DATABASE.filter(n => !state.completedNodes.includes(n.id) && n.id !== this.activeNode.id);
    const randomPick = remaining.length > 0 ? remaining[Math.floor(Math.random() * remaining.length)] : window.MIND_DATABASE[0];

    window.syncManager.completeNode(this.activeNode.id, this.selectedOption || 'A', randomPick.id);
    this.showToast(`🎲 探險家隨機事件！已開啟全新迷霧航向：${randomPick.title.split('：')[0]}`);

    setTimeout(() => {
      this.loadActiveNode(randomPick.id);
      this.switchView('view-expedition');
    }, 600);
  }

  getDynamicDomains() {
    const domainMap = new Map();

    const glyphMap = {
      game_theory: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="12 6 12 12 16 14"/></svg>`,
      economics: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
      sociology: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
      physics: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)"/></svg>`,
      evolutionary_bio: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M2 9c6.667 6 13.333 0 20 6"/></svg>`,
      statistics: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/></svg>`,
      complex_systems: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      philosophy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      default: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9 12 2"/></svg>`
    };

    const meta = {
      game_theory: { name: '博弈論 (GAME THEORY)', color: '#a855f7', glyph: glyphMap.game_theory, desc: '多方策略互動、利益衡平與均衡決策。' },
      economics: { name: '行為經濟學 (ECONOMICS)', color: '#38bdf8', glyph: glyphMap.economics, desc: '人類非理性偏誤、市場資訊盲點與選擇架構。' },
      sociology: { name: '社會心理學 (SOCIOLOGY)', color: '#f43f5e', glyph: glyphMap.sociology, desc: '群體動力學、權力結構與社會責任感知。' },
      physics: { name: '物理學思維 (PHYSICS)', color: '#06b6d4', glyph: glyphMap.physics, desc: '熱力學定律、耗散結構與宇宙底層秩序本質。' },
      evolutionary_bio: { name: '演化生物學 (EVOLUTIONARY BIO)', color: '#10b981', glyph: glyphMap.evolutionary_bio, desc: '自私基因、鷹鴿博弈與生命跨越億萬年的演化穩定策略。' },
      statistics: { name: '統計與機率 (STATISTICS)', color: '#f59e0b', glyph: glyphMap.statistics, desc: '破解因果幻覺、對抗倖存者偏誤，看清沉默的數據真相。' },
      complex_systems: { name: '複雜自適應系統 (COMPLEX SYSTEMS)', color: '#a855f7', glyph: glyphMap.complex_systems, desc: '湧現現象、去中心化與微觀規則如何孕育宏觀奇蹟。' },
      philosophy: { name: '哲學認識論 (PHILOSOPHY)', color: '#ec4899', glyph: glyphMap.philosophy, desc: '終極真理、心智模型思辨與邏輯剃刀。' }
    };

    const cosmicPalette = ['#38bdf8', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4', '#ef4444', '#84cc16'];
    let paletteIdx = 0;

    window.MIND_DATABASE.forEach(node => {
      const dId = node.domainId || 'custom_domain';
      if (!domainMap.has(dId)) {
        const known = meta[dId];
        const color = known ? known.color : cosmicPalette[(paletteIdx++) % cosmicPalette.length];
        const name = known ? known.name : `${node.domain.toUpperCase()} (${dId.toUpperCase()})`;
        const glyph = known ? known.glyph : glyphMap.default;
        const desc = known ? known.desc : `${node.domain} 領域核心思維模型與前沿認知星雲。`;

        domainMap.set(dId, {
          id: dId,
          name,
          glyph,
          color,
          desc,
          models: []
        });
      }
      domainMap.get(dId).models.push({
        cn: node.title.split('：')[0],
        en: node.modelEn || ''
      });
    });

    return Array.from(domainMap.values());
  }

  renderMap() {
    const mapContainer = document.getElementById('map-constellation-sectors');
    if (!mapContainer) return;

    mapContainer.innerHTML = '';
    const state = window.syncManager.state;
    const dynamicDomains = this.getDynamicDomains();

    let totalNodes = window.MIND_DATABASE.length;
    let litNodesCount = state.completedNodes.length;

    // Update Progress Bar & Telemetry
    const progressFill = document.getElementById('map-progress-fill');
    const progressText = document.getElementById('map-progress-text');
    if (progressFill && progressText) {
      const pct = Math.round((litNodesCount / totalNodes) * 100);
      progressFill.style.width = `${pct}%`;
      progressText.textContent = `已點亮 ${litNodesCount} / ${totalNodes} 個心智節點 (${pct}%) // 涵蓋 ${dynamicDomains.length} 大學科星雲`;
    }

    dynamicDomains.forEach(d => {
      const sector = document.createElement('div');
      sector.className = 'domain-sector';
      sector.style.setProperty('--sector-color', d.color);

      const nodesInDomain = window.MIND_DATABASE.filter(n => n.domainId === d.id);
      const litInDomain = nodesInDomain.filter(n => state.completedNodes.includes(n.id)).length;

      sector.innerHTML = `
        <div class="domain-title-bar">
          <div class="domain-badge-title">
            <span class="domain-glyph">${d.glyph}</span>
            <span>${d.name}</span>
          </div>
          <span class="domain-counter-pill">${litInDomain} / ${nodesInDomain.length} 點亮</span>
        </div>
      `;

      const cluster = document.createElement('div');
      cluster.className = 'nodes-cluster';

      nodesInDomain.forEach(node => {
        const isLit = state.completedNodes.includes(node.id);
        const isActive = state.activeNodeId === node.id && !isLit;
        const isUnlocked = state.unlockedNodes.includes(node.id) || isLit || isActive;

        const nodeEl = document.createElement('div');
        nodeEl.className = `mind-node ${isLit ? 'lit' : isActive ? 'active-frontier' : isUnlocked ? '' : 'fogged'}`;

        let iconHtml = '';
        if (!isUnlocked) {
          iconHtml = `<div class="node-icon-box"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5"><circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/><circle cx="12" cy="12" r="2"/></svg></div>`;
        } else if (node.relicReward && node.relicReward.svg) {
          iconHtml = `<img src="${node.relicReward.svg}" class="node-svg-relic" alt="${node.title}">`;
        } else {
          iconHtml = `<div class="node-icon-box"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg></div>`;
        }

        nodeEl.innerHTML = `
          ${isActive ? `<div class="active-frontier-tag"><span class="frontier-pulse-dot"></span> 拓荒中</div>` : ''}
          ${iconHtml}
          <div class="node-title">${isUnlocked ? node.title.split('：')[0] : '未知引力信號'}</div>
          <div class="node-en-sub">${isUnlocked ? (node.modelEn || '') : 'UNCHARTED'}</div>
        `;

        if (isUnlocked) {
          nodeEl.addEventListener('click', () => {
            window.soundEngine?.playCardFlip?.();
            if (isLit) {
              // 已通關節點：直接開啟心智圖鑑好讀模式！
              this.openCodexModal(node.id);
            } else {
              // 未完成節點：進入拓荒挑戰
              this.loadActiveNode(node.id);
              this.switchView('view-expedition');
            }
          });
        }

        cluster.appendChild(nodeEl);
      });

      sector.appendChild(cluster);
      mapContainer.appendChild(sector);
    });
  }

  renderProfile() {
    const state = window.syncManager.state;

    // Relics list with SVG icons & 3D Tilt Glare
    const relicsContainer = document.getElementById('relics-list-grid');
    if (relicsContainer) {
      relicsContainer.innerHTML = '';
      window.MIND_DATABASE.forEach(node => {
        if (!node.relicReward) return;
        const isUnlocked = state.relics.some(r => r.id === node.relicReward.id);

        const relicEl = document.createElement('div');
        relicEl.className = `relic-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        if (isUnlocked) relicEl.style.cursor = 'pointer';

        const iconHtml = node.relicReward.svg
          ? `<img src="${node.relicReward.svg}" class="relic-svg-icon" alt="${node.relicReward.name}">`
          : `<div class="relic-icon">${node.relicReward.icon}</div>`;

        relicEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 14px; position: relative; z-index: 2;">
            ${iconHtml}
            <div>
              <div class="relic-name">${node.relicReward.name}</div>
              <div class="relic-domain">${node.relicReward.domain}${node.modelEn ? ` • ${node.modelEn}` : ''} • ${isUnlocked ? '✦ 已收錄 (點擊精讀)' : '🔒 迷霧封印'}</div>
            </div>
          </div>
          <div class="relic-hologram-glare"></div>
        `;

        // Click on unlocked relic opens Codex Reader View
        if (isUnlocked) {
          relicEl.addEventListener('click', () => {
            window.soundEngine?.playCardFlip?.();
            this.openCodexModal(node.id);
          });
        }

        // 3D Tilt Effect on mousemove / touch
        relicEl.addEventListener('mousemove', (e) => {
          if (!isUnlocked) return;
          const rect = relicEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -12;
          const rotateY = ((x - centerX) / centerX) * 12;
          relicEl.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
          const glare = relicEl.querySelector('.relic-hologram-glare');
          if (glare) {
            glare.style.opacity = '1';
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)`;
          }
        });

        relicEl.addEventListener('mouseleave', () => {
          relicEl.style.transform = '';
          const glare = relicEl.querySelector('.relic-hologram-glare');
          if (glare) glare.style.opacity = '0';
        });

        relicsContainer.appendChild(relicEl);
      });
    }

    // Update Relics collected counter
    const collectedCountEl = document.getElementById('relics-collected-counter');
    if (collectedCountEl) {
      collectedCountEl.textContent = `COLLECTED: ${state.relics.length}/11`;
    }

    // Persona Calculation
    const personaTitle = document.getElementById('persona-title');
    const personaDesc = document.getElementById('persona-desc');
    if (personaTitle && personaDesc) {
      const choices = state.userChoices || [];
      const countB = choices.filter(c => c.choiceId === 'B').length;
      const ratio = choices.length > 0 ? countB / choices.length : 0.5;

      if (ratio >= 0.7) {
        personaTitle.textContent = '冷靜反骨策略家 // TACTICAL CONTRARIAN';
        personaDesc.textContent = '你在多數困境中傾向尋找非典型最優解，不隨波逐流，懂得適時保存體力與及時止損。';
      } else if (ratio <= 0.3) {
        personaTitle.textContent = '勇敢拓荒行動派 // BOLD PIONEER';
        personaDesc.textContent = '你崇尚以行動打破未知，願意主動承擔拓荒成本，是推進團隊走出停滯的破局者。';
      } else {
        personaTitle.textContent = '動態均衡博弈者 // EQUILIBRIUM NAVIGATOR';
        personaDesc.textContent = '你的心智彈性極高，善於根據環境規則與博弈對手的行動，靈活切換激進與防守策略。';
      }
    }

    // Render Cognitive Radar
    this.drawCognitiveRadar();
  }

  drawCognitiveRadar() {
    const canvas = document.getElementById('cognitive-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 30;

    ctx.clearRect(0, 0, width, height);

    const state = window.syncManager.state;
    const choices = state.userChoices || [];
    const completedCount = state.completedNodes.length;
    const streak = state.streak || 1;

    // Calculate 4 dimensions (0 - 100)
    const countB = choices.filter(c => c.choiceId === 'B').length;
    const rationality = Math.min(95, 45 + countB * 12);
    const intuition = Math.min(95, 45 + (choices.length - countB) * 12);
    const insight = Math.min(98, 40 + completedCount * 8);
    const resilience = Math.min(95, 50 + streak * 8);

    const attributes = [
      { label: '戰略理性', val: rationality, angle: -Math.PI / 2 },
      { label: '破局直覺', val: intuition, angle: 0 },
      { label: '系統洞察', val: insight, angle: Math.PI / 2 },
      { label: '抗熵韌性', val: resilience, angle: Math.PI }
    ];

    // Draw background concentric webs
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach(lvl => {
      ctx.beginPath();
      attributes.forEach((attr, idx) => {
        const x = centerX + Math.cos(attr.angle) * radius * lvl;
        const y = centerY + Math.sin(attr.angle) * radius * lvl;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw axis lines & labels
    attributes.forEach(attr => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(attr.angle) * radius, centerY + Math.sin(attr.angle) * radius);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lx = centerX + Math.cos(attr.angle) * (radius + 18);
      const ly = centerY + Math.sin(attr.angle) * (radius + 18);
      ctx.fillText(`${attr.label} ${attr.val}`, lx, ly);
    });

    // Draw filled player polygon
    ctx.beginPath();
    attributes.forEach((attr, idx) => {
      const dist = (attr.val / 100) * radius;
      const x = centerX + Math.cos(attr.angle) * dist;
      const y = centerY + Math.sin(attr.angle) * dist;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // -------------------------------------------------------------
  // Mind Codex Reader Engine (已通關知識點好讀精讀模式)
  // -------------------------------------------------------------
  openCodexModal(nodeId) {
    const node = window.MIND_DATABASE.find(n => n.id === nodeId);
    if (!node) return;

    const modal = document.getElementById('codex-modal');
    const titleEl = document.getElementById('codex-header-title');
    const bodyEl = document.getElementById('codex-content-body');
    const replayBtn = document.getElementById('btn-codex-replay');
    if (!modal || !bodyEl) return;

    if (titleEl) {
      titleEl.textContent = `${node.title.split('：')[0]} // CODEX`;
    }

    if (replayBtn) {
      replayBtn.onclick = () => {
        modal.classList.remove('active');
        this.loadActiveNode(node.id);
        this.switchView('view-expedition');
        this.showToast(`🎮 重新進入【${node.title.split('：')[0]}】通關體驗！`);
      };
    }

    const state = window.syncManager.state;
    const isCompleted = state.completedNodes.includes(node.id);

    // Build relic banner
    let relicHtml = '';
    if (node.relicReward) {
      const iconHtml = node.relicReward.svg
        ? `<img src="${node.relicReward.svg}" style="width: 36px; height: 36px;" alt="${node.relicReward.name}">`
        : `<span style="font-size: 28px;">${node.relicReward.icon || '🏆'}</span>`;
      relicHtml = `
        <div class="codex-relic-banner">
          ${iconHtml}
          <div>
            <div style="font-size: 13px; font-weight: 700; color: #fbbf24;">專屬神器：${node.relicReward.name}</div>
            <div style="font-size: 11px; color: #94a3b8;">領域：${node.relicReward.domain} ${isCompleted ? '✦ 已收錄' : '🔒 迷霧中'}</div>
          </div>
        </div>
      `;
    }

    // Build jargons glossary
    let jargonsHtml = '';
    if (node.core && node.core.jargons && node.core.jargons.length > 0) {
      jargonsHtml = `
        <div class="codex-section">
          <div class="codex-sec-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            零術語負債字典 // JARGONS GLOSSARY
          </div>
          <div class="codex-jargon-grid">
            ${node.core.jargons.map(j => `
              <div class="codex-jargon-item">
                <div class="codex-jargon-term">${j.term}</div>
                <div class="codex-jargon-en">${j.en || ''}</div>
                <div class="codex-jargon-desc">${j.explanation}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    bodyEl.innerHTML = `
      <div class="codex-hero">
        <div class="codex-badges-row">
          <span class="star-system-tag" style="display: inline-block;">${node.domain}</span>
          <span class="model-en-tag" style="display: inline-block;">${node.modelEn || ''}</span>
          <span style="font-size: 11px; color: #38bdf8; font-family: var(--font-mono); margin-left: auto;">EST. READ // ${node.readingTime || '2.5 分鐘'}</span>
        </div>
        <div class="codex-title">${node.title}</div>
        <div class="codex-subtitle">${node.subtitle || ''}</div>
      </div>

      ${relicHtml}

      <div class="codex-section">
        <div class="codex-sec-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          底層第一性本質 // CORE ESSENCE
        </div>
        <div class="codex-essence-box">
          「${node.core ? node.core.essence : (node.subtitle || node.title)}」
        </div>
      </div>

      <div class="codex-section">
        <div class="codex-sec-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          費曼生活化比喻 // FEYNMAN ANALOGY
        </div>
        <div class="codex-analogy-text">
          ${node.core ? node.core.analogy : (node.dilemma ? node.dilemma.reveal : '')}
        </div>
      </div>

      ${jargonsHtml}

      <div class="codex-section" style="border-color: rgba(16, 185, 129, 0.3);">
        <div class="codex-sec-title" style="color: #34d399;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          現實戰場防身指南 // TACTICAL ACTION PROTOCOL
        </div>
        <div class="codex-action-box">
          ${node.takeaway ? node.takeaway.action : '將此思維模型融入日常決策，在關鍵時刻打破群體從眾與直覺盲點。'}
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  renderRadar() {
    if (!this.radarDomainsContainer) return;
    this.radarDomainsContainer.innerHTML = '';
    const dynamicDomains = this.getDynamicDomains();
    const state = window.syncManager.state;

    dynamicDomains.forEach(domain => {
      const card = document.createElement('div');
      card.className = 'radar-domain-card';

      const nodesInDomain = window.MIND_DATABASE.filter(n => n.domainId === domain.id);
      const isExploring = nodesInDomain.some(n => state.completedNodes.includes(n.id));
      const statusText = isExploring ? '探索中' : '迷霧待探';

      card.innerHTML = `
        <div class="radar-domain-header">
          <div class="radar-domain-name"><span>${domain.icon}</span> <span>${domain.name.split(' (')[0]}</span></div>
          <div class="radar-domain-status" style="${isExploring ? 'color: var(--accent-cyan);' : ''}">${statusText}</div>
        </div>
        <div class="radar-domain-desc">${domain.desc}</div>
        <div class="radar-models-list">
          ${domain.models.map(m => `<span class="radar-model-chip">${m.cn}${m.en ? ` <span class="radar-model-en">(${m.en})</span>` : ''}</span>`).join('')}
        </div>
      `;

      card.addEventListener('click', () => {
        window.soundEngine.playDilemmaSelect();
        const firstNode = nodesInDomain[0];
        if (firstNode) {
          this.radarModal.classList.remove('active');
          this.loadActiveNode(firstNode.id);
          this.switchView('view-expedition');
          this.showToast(`🧭 航向已鎖定：${domain.name.split(' (')[0]} - ${firstNode.title.split('：')[0]}`);
        }
      });

      this.radarDomainsContainer.appendChild(card);
    });

    // Uncharted Horizon Infinite Expansion Card
    const expandCard = document.createElement('div');
    expandCard.className = 'radar-domain-card';
    expandCard.style.border = '1px dashed var(--accent-cyan)';
    expandCard.style.background = 'rgba(6, 182, 212, 0.05)';
    expandCard.innerHTML = `
      <div class="radar-domain-header">
        <div class="radar-domain-name"><span>🌌</span> <span>無限未知星域 (自主自擴張)</span></div>
        <div class="radar-domain-status" style="color: var(--accent-cyan);">✦ 可拓荒</div>
      </div>
      <div class="radar-domain-desc">不限於現有領域！可自由輸入哲學、控制論、資訊論、生態學等任何學科，由 AI 即時為你生成全新微學習卡片並拓展圖譜。</div>
      <div style="font-size: 11px; color: var(--accent-cyan); margin-top: 6px; font-weight: 700;">
        👇 使用下方「思維探測器」或點擊靈感標籤立即發射
      </div>
    `;
    expandCard.addEventListener('click', () => {
      if (this.probeInput) this.probeInput.focus();
    });
    this.radarDomainsContainer.appendChild(expandCard);
  }

  // Autonomous Procedural & AI Synthesizer Engine (Dual-Provider Failover)
  async synthesizeNode(query, preferredDomain = null, preferredId = null) {
    const cleanTopic = (query || '').trim();
    const geminiKey = window.syncManager.gistConfig.geminiApiKey || '';
    const openrouterKey = window.syncManager.gistConfig.openrouterApiKey || '';

    // 1. Try Live Google Gemini Synthesis (Primary)
    if (geminiKey) {
      try {
        const geminiCard = await this.callClientGemini(geminiKey, cleanTopic, preferredDomain);
        if (geminiCard && geminiCard.title && geminiCard.dilemma) {
          if (preferredId) geminiCard.id = preferredId;
          geminiCard.status = 'active';
          window.syncManager.addCustomNode(geminiCard);
          return geminiCard;
        }
      } catch (e) {
        console.warn('Client Gemini generation failed, trying OpenRouter fallback:', e);
      }
    }

    // 2. Try OpenRouter Synthesis (Secondary Failover)
    if (openrouterKey) {
      try {
        const orCard = await this.callClientOpenRouter(openrouterKey, cleanTopic, preferredDomain);
        if (orCard && orCard.title && orCard.dilemma) {
          if (preferredId) orCard.id = preferredId;
          orCard.status = 'active';
          window.syncManager.addCustomNode(orCard);
          return orCard;
        }
      } catch (e) {
        console.warn('Client OpenRouter generation failed, switching to procedural synthesizer:', e);
      }
    }

    // 3. High-Fidelity Procedural Feynman Synthesizer (Zero Latency & Offline Fallback)
    const proceduralCard = this.generateProceduralNode(cleanTopic, preferredDomain, preferredId);
    window.syncManager.addCustomNode(proceduralCard);
    return proceduralCard;
  }

  async callClientGemini(apiKey, topic, domainHint) {
    const prompt = `你是一個世界頂尖的普及教育家與心智模型設計師（如同理查·費曼與查理·蒙格的結合）。
請為主題【${topic}】${domainHint ? `（領域：${domainHint}）` : ''}生成一張讓人 3 分鐘內秒懂的高品質微學習探索卡片。
不限學科領域，無論是物理學、演化生物學、統計學、哲學、資訊論、複雜系統均可。

【四大原則】：
1. 情境二選一開場（不可一上來講理論）
2. 零術語負債（生活化比喻，若有專有名詞必須在 jargons 給 20 字內白話翻譯並附上精確英文對照）
3. 現實防身術（今日生活如何應用）
4. 課後三扇門（深入同域、跨界跳躍、反常識）

請嚴格輸出純 JSON：
{
  "id": "英文字符唯一標識",
  "domain": "領域名稱（如：哲學思維、資訊科學、戰略決策、生態系統等）",
  "domainId": "領域英文唯一代碼",
  "title": "標題（例：奧卡姆剃刀：如無必要，勿增實體）",
  "modelEn": "模型英文專有名詞（例：Occam's Razor）",
  "subtitle": "副標題（15字內精闢總結）",
  "icon": "單個代表性 Emoji",
  "readingTime": "2.5 分鐘",
  "relicReward": { "id": "relic_xxx", "name": "神器名稱", "domain": "領域名稱", "icon": "Emoji" },
  "dilemma": {
    "prompt": "情境難題描述（100字內）",
    "options": [
      { "id": "A", "text": "選項 A", "stats": 25, "verdict": "點評" },
      { "id": "B", "text": "選項 B", "stats": 75, "verdict": "點評" }
    ],
    "reveal": "揭曉總結一句話"
  },
  "core": {
    "essence": "一句話核心本質（30字內）",
    "analogy": "生活化白話比喻（100字內，包含 jargons 中的關鍵詞）",
    "jargons": [{ "term": "專業中文名詞", "en": "英文專有名詞對照", "explanation": "20字內直白翻譯" }]
  },
  "takeaway": { "action": "日常生活具體防身指引（80字內）" },
  "doors": [
    { "type": "deep", "badge": "深入同域", "targetId": "xxx", "title": "懸念標題", "hook": "好奇心鉤子", "icon": "Emoji" },
    { "type": "cross", "badge": "跨界跳躍", "targetId": "xxx", "title": "懸念標題", "hook": "好奇心鉤子", "icon": "Emoji" },
    { "type": "twist", "badge": "反常識", "targetId": "xxx", "title": "懸念標題", "hook": "好奇心鉤子", "icon": "Emoji" }
  ]
}`;

    const models = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.6-flash'];
    for (const m of models) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates[0].content.parts[0].text;
          return JSON.parse(text);
        }
      } catch (err) {
        console.warn(`Client model ${m} failed, trying next:`, err);
      }
    }
    return null;
  }

  generateProceduralNode(topic, domainHint, preferredId) {
    const rawId = preferredId || `custom_${Date.now()}`;

    // Preset curated deep models for common probe inspirations
    if (topic.includes('奧卡姆剃刀') || topic.includes('哲學')) {
      return {
        id: rawId,
        domain: '哲學與認識論',
        domainId: 'philosophy',
        title: '奧卡姆剃刀：如無必要，勿增實體',
        modelEn: "Occam's Razor",
        subtitle: "當有兩種解釋能說明現象時，步驟最少的那個通常最接近真理。",
        icon: '🗡️',
        readingTime: '2.5 分鐘',
        status: 'active',
        relicReward: { id: `relic_${rawId}`, name: '簡約之刃', domain: '哲學與認識論', icon: '🗡️' },
        dilemma: {
          prompt: "早晨醒來，發現客廳桌上的牛奶翻倒流了一地。\n解釋 A：昨晚有隻身手敏捷的外星隱形貓偷偷溜進來打翻了牛奶；\n解釋 B：昨晚家裡的寵物狗半夜口渴跳上桌碰倒了。\n\n你直覺會相信哪一個？",
          options: [
            { id: 'A', text: '相信外星貓，宇宙無奇不有不可輕易否定！', stats: 8, verdict: '❌ 引入了太多未經證實的假設（外星人存在、隱形科技、動機）。' },
            { id: 'B', text: '相信自家的狗，因為狗就躺在桌腳邊睡覺！', stats: 92, verdict: '✅ 正確！依據奧卡姆剃刀，剔除多餘無效假設是科學思考的基石。' }
          ],
          reveal: '過度複雜的陰謀論往往漏洞百出，最樸素合理的推斷最經得起時間考驗。'
        },
        core: {
          essence: "在所有相互競爭的假說中，應當優先選擇假設前提最少的那一個。",
          analogy: "就像軟體工程師寫程式碼時，如果用三行極簡代碼就能解決問題，就絕不要為了炫技設計一套『過度工程』架構；用簡約原則剃除贅餘，才能避免未來的維護災難。",
          jargons: [
            { term: "過度工程", en: "Over-engineering", explanation: "用過於複雜臃腫的方法去解決本來很簡單的問題。" },
            { term: "如無必要勿增實體", en: "Occam's Principle (Non sunt multiplicanda entia)", explanation: "解釋事情時，不要引入任何多餘的未驗證概念或藉口。" }
          ]
        },
        takeaway: { action: "在日常生活或人際糾紛中，如果一件事情既能用『對方一時疏忽』解釋，也能用『對方精密算計蓄意害我』解釋，請果斷採用前者的簡約假設，別讓自己陷入受害者妄想。" },
        doors: [
          { type: 'deep', badge: '統計關聯', targetId: 'survivorship_bias', title: '統計學：奧卡姆剃刀如何幫我們看穿倖存者偏差？', hook: '不要為純屬運氣的生還者編造複雜英雄神話。', icon: '🎯' },
          { type: 'cross', badge: '物理對照', targetId: 'entropy_law', title: '物理學思維：熵增定律下，過度複雜的系統為何必然加速崩潰？', hook: '系統每增加一個實體，混亂度就翻倍成長。', icon: '⏳' },
          { type: 'twist', badge: '博弈跳躍', targetId: 'boxed_pigs', title: '智豬博弈：弱者的躺平策略，本質上也是一種極簡剃刀思維？', hook: '把複雜決策化簡為單一佔優策略。', icon: '🐷' }
        ]
      };
    }

    if (topic.includes('資訊熵') || topic.includes('夏農') || topic.includes('資訊論')) {
      return {
        id: rawId,
        domain: '資訊科學',
        domainId: 'info_theory',
        title: '夏農資訊熵：不確定性才是資訊的真正價值',
        modelEn: "Shannon Entropy (Information Theory)",
        subtitle: "一句眾所周知的廢話沒有任何資訊量，意外越大的消息價值越高。",
        icon: '⚡',
        readingTime: '2.5 分鐘',
        status: 'active',
        relicReward: { id: `relic_${rawId}`, name: '信噪透鏡', domain: '資訊科學', icon: '⚡' },
        dilemma: {
          prompt: "兩條晨間新聞推播到你手機：\n新聞 A：『太陽今天早晨 6 點準時在東方升起！』\n新聞 B：『南極冰架剛剛發生千年一遇的斷裂，氣溫突升 10 度！』\n\n對你而言，哪一條新聞包含的『資訊量』更大？",
          options: [
            { id: 'A', text: '新聞 A，因為它是絕對無可置疑的客觀事實', stats: 6, verdict: '❌ 機率 100% 確定的事情，不確定性消除為零，資訊量等於零廢話！' },
            { id: 'B', text: '新聞 B，因為它極其罕見、徹底打破了預期！', stats: 94, verdict: '✅ 天才！夏農指出：事件越出乎意料，它消除的『資訊熵』就越龐大！' }
          ],
          reveal: '資訊的本質不是文字的長度，而是它為你消除了多少世界的不確定性。'
        },
        core: {
          essence: "資訊量的大小取決於它所消除的『不確定性（熵）』；可預測的重複不是資訊，而是冗餘。",
          analogy: "就像在開會報告時，如果報告者講了一小時大家都知道的套話，這叫『高噪音、零資訊量』；只有當他說出一個大家不知道的關鍵突發數據時，才真正注入了高密度的有效訊號。",
          jargons: [
            { term: "資訊熵", en: "Information Entropy", explanation: "用來衡量一個系統不確定性與混亂程度的數學指標。" },
            { term: "信噪比", en: "Signal-to-Noise Ratio (SNR)", explanation: "有效有價值的真實訊號，與混雜無意義噪音之間的比例。" }
          ]
        },
        takeaway: { action: "過濾每天的手機推播與八卦資訊，主動降低生活中冗餘資訊的攝入。高信噪比的學習者只關注那些『能徹底改變你對未來預期』的高資訊熵知識。" },
        doors: [
          { type: 'deep', badge: '物理同源', targetId: 'entropy_law', title: '物理學：資訊熵與熱力學熵增，究竟在宇宙底層有何神秘連結？', hook: '薛丁格說生命是以負熵為食。', icon: '⏳' },
          { type: 'cross', badge: '複雜系統', targetId: 'emergence_system', title: '複雜系統：蟻群是如何透過化學微弱信號，湧現出巨量訊息傳遞的？', hook: '去中心化資訊網絡的極致展現。', icon: '🌐' },
          { type: 'twist', badge: '市場博弈', targetId: 'lemons_market', title: '檸檬市場：資訊不對稱與信噪比失衡，如何摧毀整個二手游戲交易？', hook: '假信號如何淹沒真信息。', icon: '🍋' }
        ]
      };
    }

    // Generic Dynamic Model Synthesizer for Any Free Query
    const domainName = domainHint || '前沿跨學科思考';
    const domainCode = (domainHint ? 'domain_' + Math.abs(domainHint.split('').reduce((a,b)=>a+b.charCodeAt(0),0)) : 'frontier_mind');

    return {
      id: rawId,
      domain: domainName,
      domainId: domainCode,
      title: `${topic.split('：')[0]}：動態自適應思維`,
      modelEn: `${topic.split('：')[0]} (Adaptive Model)`,
      subtitle: `從底層邏輯洞悉【${topic.substring(0, 8)}...】的本質機理。`,
      icon: '🪐',
      readingTime: '2.5 分鐘',
      status: 'active',
      relicReward: { id: `relic_${rawId}`, name: `${topic.substring(0, 4)}之印`, domain: domainName, icon: '🪐' },
      dilemma: {
        prompt: `在面對【${topic}】的現實情境挑戰時，我們常在直覺本能與理性深度思考之間猶豫不決。\n\n如果你現在必須立刻做出關鍵決策，你會選擇？`,
        options: [
          { id: 'A', text: '順從直覺慣性，按照多數人的老經驗行事', stats: 35, verdict: '❌ 容易落入群體盲從與路徑依賴的盲點陷阱！' },
          { id: 'B', text: '探究底層第一性原理，重新審視系統規則與約束條件', stats: 65, verdict: '✅ 正解！打破慣性思維，才能找到非對稱破局的最優策略！' }
        ],
        reveal: `面對複雜未知的挑戰，最重要的不是拼命使力，而是看清【${topic.substring(0, 10)}】背後的底層動力學架構。`
      },
      core: {
        essence: `掌握【${topic}】的核心不在於記憶繁複細節，而在於洞悉系統內部個體與約束條件的動態關係。`,
        analogy: `就像在日常生活或職場中，如果只看表面問題就像『治標不治本』的救火；而學會運用該心智模型，就像站在更高維度看清棋盤上的全貌，能以最小代價取得全局最優解。`,
        jargons: [
          { term: '第一性原理', en: 'First Principles Thinking', explanation: '回歸事物最本質的物理事實，從源頭重新推理而非盲目類比。' },
          { term: '系統思維', en: 'Systems Thinking', explanation: '把問題放在相互連接的完整網絡中觀察，而非單點孤立看待。' }
        ]
      },
      takeaway: { action: `今天遇到任何類似【${topic.substring(0, 8)}】的難題時，先暫停 3 秒，問自己：『這個系統的底層約束條件是什麼？我是否被表面現象所誤導？』` },
      doors: [
        { type: 'deep', badge: '複雜湧現', targetId: 'emergence_system', title: '複雜系統：微觀規則如何自發構建宏觀系統？', hook: '探索去中心化自組織的威力。', icon: '🌐' },
        { type: 'cross', badge: '演化博弈', targetId: 'hawk_dove', title: '演化生物學：競爭環境中的動態平衡策略', hook: '大自然殘酷淘汰下的生存法寶。', icon: '🦅' },
        { type: 'twist', badge: '統計反思', targetId: 'survivorship_bias', title: '統計學：我們是否在結果中犯了倖存者偏差？', hook: '找出那些沒被看見的沉默數據。', icon: '🎯' }
      ]
    };
  }

  // -------------------------------------------------------------
  // Intelligent Domain Induction Engine (智能領域自動分流歸納與擴張機制)
  // -------------------------------------------------------------
  deduceDomain(topic) {
    const text = (topic || '').toLowerCase();
    
    // 1. Check existing domains in MIND_DATABASE
    const existingDomains = [
      { id: 'game_theory', name: '博弈論', en: 'Game Theory', keywords: ['博弈', '賽局', '納許', '囚徒', '佔優', '智豬', '零和', '重複博弈', '策略', '威脅', '搭便車', '肯德基', '公地悲劇'] },
      { id: 'economics', name: '行為經濟學', en: 'Behavioral Economics', keywords: ['經濟', '檸檬', '價格', '市場', '沈沒成本', '沉沒成本', '機會成本', '外部性', '逆向選擇', '資訊不對稱', '貨幣', '稟賦效應', '錨定', '邊際'] },
      { id: 'social_psychology', name: '社會心理學', en: 'Social Psychology', keywords: ['社會', '群體', '從眾', '旁觀者', '破窗', '路西法', '服從', '米爾格倫', '偏見', '刻板印象', '群體極化', '光環效應'] },
      { id: 'cognitive_science', name: '認知科學', en: 'Cognitive Science', keywords: ['認知', '偏誤', '確認偏誤', '捷思', '記憶', '注意力', '遺忘曲線', '鄧寧克魯格', '達克效應', '雙系統', '快思慢想'] }
    ];

    for (const d of existingDomains) {
      if (d.keywords.some(kw => text.includes(kw.toLowerCase()))) {
        return { isNew: false, domainId: d.id, domain: d.name, domainEn: d.en };
      }
    }

    // 2. Recognized new disciplines
    const newDisciplines = [
      { id: 'evolutionary_psychology', name: '演化心理學', en: 'Evolutionary Psychology', keywords: ['演化心理', '進化心理', '親擇', '性擇', '自私的基因', '演化適應', '互惠利他'] },
      { id: 'philosophy', name: '哲學思維', en: 'Philosophy', keywords: ['哲學', '奧卡姆', '剃刀', '認識論', '本體論', '倫理', '思想實驗', '電車難題', '正義論'] },
      { id: 'information_theory', name: '資訊科學', en: 'Information Science', keywords: ['資訊', '夏農', '熵', '編碼', '噪音', '訊號', '算法', '計算'] },
      { id: 'systems_theory', name: '複雜系統學', en: 'Complex Systems', keywords: ['複雜系統', '控制論', '反饋', '湧現', '混沌', '蝴蝶效應', '網絡效應'] },
      { id: 'ecology', name: '生態系統學', en: 'Ecosystem Science', keywords: ['生態', '營養級', '捕食者', '生物鏈', '共生', '演替'] },
      { id: 'military_strategy', name: '軍事戰略學', en: 'Strategic Doctrine', keywords: ['戰略', 'ooda', '孫子兵法', '克勞塞維茨', '閃擊', '非對稱作戰'] },
      { id: 'physics', name: '物理思維', en: 'Physics Models', keywords: ['物理', '量子', '相對論', '熱力學', '慣性', '引力', '第一性原理'] },
      { id: 'statistics', name: '統計與機率', en: 'Statistics & Probability', keywords: ['統計', '機率', '貝氏', '大數法則', '迴歸', '常態分佈', '倖存者偏差'] }
    ];

    for (const d of newDisciplines) {
      if (d.keywords.some(kw => text.includes(kw.toLowerCase()))) {
        return { isNew: true, domainId: d.id, domain: d.name, domainEn: d.en };
      }
    }

    // 3. Fallback for completely unknown topic
    const cleanName = topic.replace(/[：:·\-\s].*$/, '').trim();
    const fallbackId = 'domain_' + Math.random().toString(36).substring(2, 7);
    return { isNew: true, domainId: fallbackId, domain: cleanName || '前沿未知學科', domainEn: 'Uncharted Horizon' };
  }

  async handleLaunchProbe(targetTopic = null, targetDomain = null) {
    const query = targetTopic || (this.probeInput ? this.probeInput.value : '').trim();
    if (!query) {
      this.showToast('⚠️ 請輸入你想探索的生活現象、學科或困境');
      return;
    }

    window.soundEngine.playUnlockNode();
    if (this.probeInput) this.probeInput.value = '';
    if (this.radarModal) this.radarModal.classList.remove('active');

    // Step 1: Check if node already exists in database
    const existingNode = window.MIND_DATABASE.find(n => 
      n.title.includes(query) || 
      n.id.toLowerCase() === query.toLowerCase() ||
      (n.modelEn && n.modelEn.toLowerCase().includes(query.toLowerCase()))
    );

    if (existingNode) {
      this.showToast(`✦ 探測信號鎖定：【${existingNode.title.split('：')[0]}】已存在於已有【${existingNode.domain}】星雲，立即跳躍導航！`);
      this.loadActiveNode(existingNode.id);
      this.switchView('view-expedition');
      return;
    }

    // Step 2: Intelligent Domain Deduction & Routing
    const domainDeduction = targetDomain 
      ? { isNew: false, domain: targetDomain, domainId: targetDomain.toLowerCase(), domainEn: targetDomain }
      : this.deduceDomain(query);

    this.showToast(domainDeduction.isNew 
      ? `🔭 發現全新疆界：正在為【${query}】自主拓荒全新【${domainDeduction.domain}】星系...`
      : `📡 智慧歸納分流：已將【${query}】自動歸納至已有【${domainDeduction.domain}】星系，正在合成費曼模型...`
    );

    try {
      // Step 3: Synthesize Node (Gemini or Procedural)
      const newNode = await this.synthesizeNode(query, domainDeduction.domain, null);
      newNode.domainId = domainDeduction.domainId;
      newNode.domain = domainDeduction.domain;

      // Step 4: Refresh Visual Systems
      this.renderMap();
      this.renderProfile();
      this.renderRadar();
      this.updateHUD();

      // Step 5: Navigate and Load
      this.loadActiveNode(newNode.id);
      this.switchView('view-expedition');

      this.showToast(domainDeduction.isNew
        ? `✨ 拓荒成功！已在全新【${domainDeduction.domain}】星雲點亮【${newNode.title.split('：')[0]}】！`
        : `✨ 分流歸納完成！【${newNode.title.split('：')[0]}】已收錄進已有【${domainDeduction.domain}】！`
      );
    } catch (err) {
      console.error('Probe expansion error:', err);
      this.showToast('❌ 探測器合成超時，已保留信號');
    }
  }

  // -------------------------------------------------------------
  // Tactical Deep Inquiry Terminal Implementation
  // -------------------------------------------------------------
  renderInquiryChips() {
    if (!this.inquiryChipsContainer) return;
    this.inquiryChipsContainer.innerHTML = '';

    const questions = this.getInquiryQuestions(this.activeNode.id);
    questions.forEach(q => {
      const chip = document.createElement('button');
      chip.className = 'inquiry-chip';
      chip.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>${q}</span>
      `;
      chip.addEventListener('click', () => {
        if (this.inquiryCustomInput) this.inquiryCustomInput.value = q;
        this.handleInquiry(q);
      });
      this.inquiryChipsContainer.appendChild(chip);
    });
  }

  getInquiryQuestions(nodeId) {
    const qMap = {
      'boxed_pigs': [
        '現實中有大、中、小三隻豬會怎樣？',
        '小豬一直躺平不按，大豬會被餓死嗎？',
        '在職場與團隊中，如何避免被人搭便車？'
      ],
      'prisoners_dilemma': [
        '如果雙方可以提前約定，能打破囚徒困境嗎？',
        '現實反覆博弈時，「以牙還牙」策略強在哪？',
        '大公司打價格戰，也是典型的囚徒困境嗎？'
      ],
      'lemons_market': [
        '為什麼偏偏叫做「檸檬」市場？',
        '買方如何主動破解逆向選擇？',
        '現代電商平台是怎麼消除劣幣驅逐良幣的？'
      ],
      'sunk_cost': [
        '為什麼明知是沈沒成本，人還是忍不住繼續投入？',
        '「及時止損」在心理學上有哪些反直覺的自救技巧？',
        '如何在開局就避免陷入沈沒成本黑洞？'
      ],
      'bystander_effect': [
        '在公共場合遇到危險，如何一句話打破旁觀者效應？',
        '現場人越多反而越冷漠，背後的演化機制是什麼？',
        '旁觀者效應在網路社群（如霸凌、求助）如何體現？'
      ],
      'broken_windows': [
        '破窗效應在個人習慣培養中是如何體現的？',
        '如何在第一扇窗被打破前就建立絕對防線？',
        '在團隊管理中，如何利用破窗效應快速逆轉風氣？'
      ]
    };

    return qMap[nodeId] || [
      '這個心智模型在現實中最容易犯錯的邊界在哪裡？',
      '如果博弈對手也熟知這個模型，局勢會如何反轉？',
      '請示範一個極度通俗的情境，如何將這套思維當防身武器？'
    ];
  }

  async handleInquiry(question) {
    window.soundEngine.playDilemmaSelect();

    if (!this.inquiryResponseBox || !this.inquiryResponseText) return;
    this.inquiryResponseBox.style.display = 'block';
    this.inquiryResponseText.textContent = '🛰️ 費曼思維解碼通訊中（DECRYPTING TELEMETRY）...';
    if (this.inquirySourceTag) this.inquirySourceTag.textContent = 'SYNTHESIZING...';

    const geminiKey = window.syncManager.gistConfig.geminiApiKey || '';
    const openrouterKey = window.syncManager.gistConfig.openrouterApiKey || '';

    // 1. Try Gemini Live Feynman Inquiry
    if (geminiKey) {
      try {
        const answer = await this.callGeminiInquiry(geminiKey, question);
        if (answer) {
          this.inquiryResponseText.textContent = answer;
          if (this.inquirySourceTag) this.inquirySourceTag.textContent = 'GOOGLE GEMINI FLASH';
          try { window.soundEngine?.playRewardRelic?.(); } catch (e) {}
          return;
        }
      } catch (err) {
        console.warn('Gemini inquiry call failed, trying OpenRouter failover:', err);
      }
    }

    // 2. Try OpenRouter Live Inquiry Failover
    if (openrouterKey) {
      try {
        const answer = await this.callOpenRouterInquiry(openrouterKey, question);
        if (answer) {
          this.inquiryResponseText.textContent = answer;
          if (this.inquirySourceTag) this.inquirySourceTag.textContent = 'OPENROUTER AI DUAL-TRACK';
          try { window.soundEngine?.playRewardRelic?.(); } catch (e) {}
          return;
        }
      } catch (err) {
        console.warn('OpenRouter inquiry call failed, falling back to curated Feynman knowledge base:', err);
      }
    }

    // 3. Curated Feynman Knowledge Base Fallback
    const curatedAnswer = this.getCuratedInquiryAnswer(this.activeNode.id, question);
    this.inquiryResponseText.textContent = curatedAnswer;
    if (this.inquirySourceTag) this.inquirySourceTag.textContent = 'FEYNMAN KNOWLEDGE VAULT';
    try { window.soundEngine?.playRewardRelic?.(); } catch (e) {}
  }

  async callClientOpenRouter(apiKey, topic, domainHint) {
    const prompt = `請為主題【${topic}】${domainHint ? `（領域：${domainHint}）` : ''}生成一張讓人 3 分鐘內秒懂的高品質微學習探索卡片。
嚴格遵守四大原則：1. 情境二選一開場 2. 零術語負債（jargons 給 20 字白話翻譯並附英文對照） 3. 現實防身術 4. 課後三扇門。
必須嚴格輸出純 JSON 物件，包含 id, domain, domainId, title, modelEn, subtitle, icon, readingTime, relicReward, dilemma, core (essence, analogy, jargons), takeaway, doors。`;

    const freeModels = [
      'minimax/minimax-m2.7:free',
      'liquid/lfm-2.5-2.6b:free',
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'google/gemma-4-31b-it:free'
    ];

    for (const m of freeModels) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin || 'http://localhost:3456',
            'X-Title': 'Super Mind Odyssey'
          },
          body: JSON.stringify({
            model: m,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
          })
        });
        if (res.ok) {
          const data = await res.json();
          return JSON.parse(data.choices[0].message.content);
        }
      } catch (e) {
        console.warn(`OpenRouter model ${m} failed, trying next:`, e);
      }
    }
    throw new Error('All OpenRouter models failed');
  }

  buildInquiryPrompt(question) {
    return `你是一位融會貫通的心智模型大師（兼具理查·費曼的生動通透與查理·蒙格的跨學科深刻洞察）。
用戶正在研習心智模型【${this.activeNode.title}】（英文：${this.activeNode.modelEn || ''}，領域：${this.activeNode.domain}）。
用戶的深度追問是：【${question}】

請嚴格遵循以下費曼核心解答原則：
1. 【直擊核心】：直接針對用戶問題核心進行本質拆解，拒絕任何客套與廢話開場。
2. 【情境與案例剖析】：若用戶要求舉例或分析情境，請給出具體且接地氣的生活/職場/商業實戰案例，剖析局勢與背後博弈動機。
3. 【現實破局手冊】：結尾給出具體、硬核、可立即落地的破局行動指南或防身心法。

請使用繁體中文，層次分明，邏輯清晰透徹，長度控制在 250~450 字之間。`;
  }

  async callOpenRouterInquiry(apiKey, question) {
    const prompt = this.buildInquiryPrompt(question);

    const freeModels = [
      'minimax/minimax-m2.7:free',
      'liquid/lfm-2.5-2.6b:free',
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'google/gemma-4-31b-it:free'
    ];

    for (const m of freeModels) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin || 'http://localhost:3456',
            'X-Title': 'Super Mind Odyssey'
          },
          body: JSON.stringify({
            model: m,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1024,
            temperature: 0.7
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim();
          }
        }
      } catch (e) {
        console.warn(`OpenRouter model ${m} failed, trying next:`, e);
      }
    }
    throw new Error('All OpenRouter models failed');
  }

  async callGeminiInquiry(apiKey, question) {
    const prompt = this.buildInquiryPrompt(question);

    const models = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.6-flash'];
    let lastErr = null;

    for (const m of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text.trim();
          }
        } else {
          lastErr = new Error(`HTTP ${res.status}`);
        }
      } catch (err) {
        console.warn(`Gemini inquiry model ${m} failed, trying next:`, err);
        lastErr = err;
      }
    }

    throw lastErr || new Error('All Gemini inquiry models failed');
  }

  getCuratedInquiryAnswer(nodeId, question) {
    const q = question.toLowerCase();

    // Boxed Pigs
    if (nodeId === 'boxed_pigs') {
      if (q.includes('三隻') || q.includes('中豬')) {
        return '若有大、中、小三隻豬，中豬會陷入最尷尬的「夾心陷阱」：去按開關被大豬搶光，不去按食物又被小豬先吃完。最終往往是大豬按開關、小豬吃肥。中豬必須主動拉攏一方改變分配規則才能倖免。';
      }
      if (q.includes('餓死') || q.includes('躺平')) {
        return '大豬不會餓死。因為大豬清楚算過：「我不去按大家都餓死；我去按我至少還能吃 6 份」。大豬的理性被迫認命去按。這正是為何科技巨頭明知會被中小廠抄襲，也必須持續投入天價研發。';
      }
      if (q.includes('職場') || q.includes('便車') || q.includes('團隊')) {
        return '破解法在於「改變產出分配權」！智豬博弈之所以存在，是因為食槽公開共享。只要把收益綁定個人專屬指標（如憑密鑰才能開鎖分食），讓成果具備排他性，搭便車現象立刻瓦解。';
      }
    }

    // Lemons Market
    if (nodeId === 'lemons_market') {
      if (q.includes('檸檬') || q.includes('名字')) {
        return '在美國俚語中，「Lemon（檸檬）」指外表鮮亮但咬下去酸澀難嚥的劣質老爺車；優質好車則被稱為「Peach（水蜜桃）」。阿克洛夫以此比喻資訊不對稱下劣幣驅逐良幣、市場只剩酸檸檬的悲劇。';
      }
      if (q.includes('買方') || q.includes('破解') || q.includes('逆向選擇')) {
        return '買方可透過「反向信號甄別」破局：引入具公信力的第三方檢驗認證（如定點中古車檢驗機構）、要求賣方附帶高額原廠保固與假一賠十條款，把隱蔽資訊強行推向透明。';
      }
      if (q.includes('電商') || q.includes('淘寶') || q.includes('亞馬遜')) {
        return '現代電商三大武器：(1) 買家真實評價與信用積分，讓作惡成本終身化；(2) 平台押金與先行賠付（如七天無理由退貨）；(3) 官方自營旗艦店標籤，在入口端直接把檸檬過濾掉。';
      }
    }

    // Prisoners Dilemma
    if (nodeId === 'prisoners_dilemma') {
      if (q.includes('約定') || q.includes('提前')) {
        return '口頭約定完全沒用！因為各自進了審訊室後，背叛依舊是每個人的個人佔優策略。唯有存在不可撤銷的外部暴力或懲罰機制（如黑幫連坐背叛者），約定才具有可信約束力。';
      }
      if (q.includes('以牙還牙') || q.includes('反覆')) {
        return '「以牙還牙 (Tit for Tat)」具備四大致勝美德：第一步永遠釋放善意、遭到背叛立刻反擊報復、對方回歸合作立即寬容原諒、規則透明讓對手一眼看懂。這是演化中最穩健的合作策略。';
      }
      if (q.includes('價格戰') || q.includes('公司')) {
        return '完全是！兩家巨頭都想降價搶份額，結果兩敗俱傷、利潤腰斬。破解法是建立「價格匹配保證」（承諾比對手更低，使對方降價無利可圖），或轉向產品差異化與生態護城河。';
      }
    }

    // Bystander Effect
    if (nodeId === 'bystander_effect') {
      if (q.includes('一句話') || q.includes('求救') || q.includes('打破')) {
        return '絕對不要喊「救命啊有人幫幫我」——這會引發責任分散。必須具體鎖定單一個人：「穿黑夾克戴眼鏡的先生，就是你！請立刻幫我打 119！」責任一旦百分之百聚焦，對方就會立刻行動。';
      }
      if (q.includes('冷漠') || q.includes('人越多') || q.includes('演化')) {
        return '兩大心理機制：(1) 責任分散：每個人心中的道德責任感被在場人數等份稀釋；(2) 社會參照：當大家都按兵不動時，每個人都會誤以為「情況可能不緊急，我貿然出手會出醜」。';
      }
    }

    // Sunk Cost
    if (nodeId === 'sunk_cost') {
      if (q.includes('忍不住') || q.includes('明知')) {
        return '因為人類大腦天生有強烈的「損失厭惡」與「自我證成」傾向。承認放棄等於公開承認自己「之前做蠢事了」。我們繼續死撐往往不是為了未來收益，而是為了捍衛脆弱的自尊心。';
      }
      if (q.includes('技巧') || q.includes('止損') || q.includes('自救')) {
        return '試試「局外人視角」：假裝自己是剛剛空降的全新執行長，手上既無歷史包袱也沒感情投入，面對眼前殘局你會怎麼選？如果答案是立刻砍掉，那就毫無猶豫地立刻止損。';
      }
    }

    // General Universal Feynman Response
    return `這個心智模型的核心本質在於【${this.activeNode.core.essence}】。在真實戰場中，最關鍵的破局心法是：${this.activeNode.takeaway.action}`;
  }

  updateHUD() {
    const state = window.syncManager.state;
    this.streakCount.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      DAY // 0${state.streak}
    `;
    this.relicCount.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
      RELICS // ${state.relics.length}
    `;
    
    // Level calculation: 1 level per 2 completed nodes
    const lvl = Math.floor(state.completedNodes.length / 2) + 1;
    this.levelTag.textContent = `LV.${lvl} PIONEER`;
  }

  openSettings() {
    const cfg = window.syncManager.gistConfig;
    this.gistTokenInput.value = cfg.token || '';
    this.gistIdInput.value = cfg.gistId || '';
    if (this.geminiKeyInput) this.geminiKeyInput.value = cfg.geminiApiKey || '';
    if (this.openrouterKeyInput) this.openrouterKeyInput.value = cfg.openrouterApiKey || '';
    
    // Restore last sync time display
    const el = document.getElementById('sync-status-line');
    if (el) {
      const lastSync = localStorage.getItem('mind_odyssey_last_sync');
      if (lastSync) {
        el.textContent = `上次同步：${lastSync} ✔`;
        el.style.color = '#10b981';
      } else {
        el.textContent = '上次同步：從未';
        el.style.color = '#64748b';
      }
    }

    this.settingsModal.classList.add('active');
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 2800);
  }

  // Update the "last synced" line inside settings modal
  updateSyncStatus() {
    const el = document.getElementById('sync-status-line');
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    try {
      localStorage.setItem('mind_odyssey_last_sync', timeStr);
    } catch (e) {}

    if (!el) return;
    el.textContent = `上次同步：${timeStr} ✔`;
    el.style.color = '#10b981';
  }

  // Micro sync badge: slides in from top-right, auto fades after 2.5s
  showSyncBadge() {
    const badge = document.getElementById('sync-badge');
    if (!badge) return;
    if (this._syncBadgeTimer) clearTimeout(this._syncBadgeTimer);
    badge.classList.add('show');
    this._syncBadgeTimer = setTimeout(() => {
      badge.classList.remove('show');
      this._syncBadgeTimer = null;
    }, 2500);
    this.updateSyncStatus();
  }
}

// Bootstrap after DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MindOdysseyApp();
});
