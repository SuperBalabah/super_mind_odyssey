/**
 * Mind Odyssey - Storage & GitHub Gist Sync Engine
 * Zero server cost, offline-first, seamless multi-device sync
 */

const STORAGE_KEY = 'mind_odyssey_user_state';
const GIST_CONFIG_KEY = 'mind_odyssey_gist_config';

class SyncManager {
  constructor() {
    this.state = this.loadLocalState();
    this.gistConfig = this.loadGistConfig();
    this.mergeCustomNodes();
  }

  mergeCustomNodes() {
    if (this.state.customNodes && Array.isArray(this.state.customNodes)) {
      this.state.customNodes.forEach(cNode => {
        if (window.MIND_DATABASE && !window.MIND_DATABASE.some(n => n.id === cNode.id)) {
          window.MIND_DATABASE.push(cNode);
        }
      });
    }
  }

  // Initial State Factory
  getDefaultState() {
    return {
      version: 1,
      unlockedNodes: ['boxed_pigs'],
      activeNodeId: 'boxed_pigs',
      completedNodes: [],
      customNodes: [], // Dynamically self-expanded nodes from AI probes
      relics: [],
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      userChoices: [], // Stores dilemma decisions for Persona analysis
      nextBranchChoices: []
    };
  }

  loadLocalState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...this.getDefaultState(), ...parsed, customNodes: parsed.customNodes || [] };
      }
    } catch (e) {
      console.warn('Failed to load local state, using default', e);
    }
    return this.getDefaultState();
  }

  saveLocalState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save local state', e);
    }
  }

  loadGistConfig() {
    try {
      const raw = localStorage.getItem(GIST_CONFIG_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      token: '',
      gistId: '',
      geminiApiKey: '',
      openrouterApiKey: ''
    };
  }

  saveGistConfig(token, gistId, geminiApiKey = '', openrouterApiKey = '') {
    this.gistConfig = { 
      token: (token || '').trim(), 
      gistId: (gistId || '').trim(),
      geminiApiKey: (geminiApiKey || '').trim(),
      openrouterApiKey: (openrouterApiKey || '').trim()
    };
    localStorage.setItem(GIST_CONFIG_KEY, JSON.stringify(this.gistConfig));
  }

  // Register an autonomous or user-probed node into the self-expanding graph
  addCustomNode(node) {
    if (!this.state.customNodes) this.state.customNodes = [];
    if (!this.state.customNodes.some(n => n.id === node.id)) {
      this.state.customNodes.push(node);
    }
    if (!this.state.unlockedNodes.includes(node.id)) {
      this.state.unlockedNodes.push(node.id);
    }
    // Also inject into active runtime database
    if (window.MIND_DATABASE && !window.MIND_DATABASE.some(n => n.id === node.id)) {
      window.MIND_DATABASE.push(node);
    }
    this.saveLocalState();
  }

  // Mark a node as completed and unlock next chosen nodes / relics
  completeNode(nodeId, choiceId, nextTargetId = null) {
    if (!this.state.completedNodes.includes(nodeId)) {
      this.state.completedNodes.push(nodeId);
    }

    // Record dilemma choice
    this.state.userChoices.push({
      nodeId,
      choiceId,
      timestamp: new Date().toISOString()
    });

    // Check & award Relic
    const nodeData = window.MIND_DATABASE.find(n => n.id === nodeId);
    if (nodeData && nodeData.relicReward) {
      if (!this.state.relics.some(r => r.id === nodeData.relicReward.id)) {
        this.state.relics.push(nodeData.relicReward);
      }
    }

    // Update active node to next choice if provided
    if (nextTargetId) {
      if (!this.state.unlockedNodes.includes(nextTargetId)) {
        this.state.unlockedNodes.push(nextTargetId);
      }
      this.state.activeNodeId = nextTargetId;
    }

    // Update streak if it's a new day
    const today = new Date().toISOString().split('T')[0];
    if (this.state.lastActiveDate !== today) {
      this.state.streak += 1;
      this.state.lastActiveDate = today;
    }

    this.saveLocalState();
    this.tryCloudSync(); // Non-blocking cloud sync
  }

  // GitHub Gist Cloud Sync
  async tryCloudSync() {
    if (!this.gistConfig.token || !this.gistConfig.gistId) {
      return { success: false, reason: 'no_config' };
    }

    try {
      const res = await fetch(`https://api.github.com/gists/${this.gistConfig.gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${this.gistConfig.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'Mind Odyssey Expedition Progress',
          files: {
            'mind_odyssey_progress.json': {
              content: JSON.stringify(this.state, null, 2)
            }
          }
        })
      });

      if (res.ok) {
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, reason: err.message };
      }
    } catch (e) {
      return { success: false, reason: e.message };
    }
  }

  // Pull latest progress from Gist
  async pullFromGist() {
    if (!this.gistConfig.token || !this.gistConfig.gistId) {
      return { success: false, reason: 'no_config' };
    }

    try {
      const res = await fetch(`https://api.github.com/gists/${this.gistConfig.gistId}`, {
        headers: {
          'Authorization': `token ${this.gistConfig.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        const file = data.files['mind_odyssey_progress.json'];
        if (file && file.content) {
          const remoteState = JSON.parse(file.content);
          this.state = { ...this.state, ...remoteState };
          this.saveLocalState();
          return { success: true, data: this.state };
        }
      }
      return { success: false, reason: 'file_not_found' };
    } catch (e) {
      return { success: false, reason: e.message };
    }
  }

  // Export JSON backup
  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `mind_odyssey_backup_${new Date().toISOString().split('T')[0]}.json`);
    dl.click();
  }

  // Import JSON backup
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.unlockedNodes) {
        this.state = parsed;
        this.saveLocalState();
        return true;
      }
    } catch (e) {}
    return false;
  }
}

window.syncManager = new SyncManager();
