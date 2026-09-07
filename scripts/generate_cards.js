/**
 * Mind Odyssey - Automated Card Generator
 * Free Tier Multi-Provider Failover:
 * 1. Google AI Studio (Gemini 2.0 Flash)
 * 2. Groq Cloud (Llama 3.3 70B)
 * 3. OpenRouter (:free models)
 *
 * Usage:
 *   node scripts/generate_cards.js --domain "博弈論"
 */

const fs = require('fs');
const path = require('path');

// Automatically load .env file if it exists (zero-dependency)
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

// Provider API Keys & Model from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

// Feynman 3-Layer Defense Prompt System (Universal, Cross-Disciplinary, Self-Expanding)
const SYSTEM_PROMPT = `你是一個世界頂尖的普及教育家與心智模型設計師（如同理查·費曼與查理·蒙格的結合）。
你的任務是將跨越人類任何智慧領域（包括但不限於：物理學、演化生物學、統計與機率、複雜自適應系統、電腦與資訊科學、哲學與認識論、軍事與博弈戰略、生態學、控制論等任何學科）的核心思維模型，轉化為讓人 3 分鐘內秒懂、極具啟發性的微學習卡片。

【嚴格遵守四大心智原則】：
1. 【情境抉擇先於概念 (Dilemma First)】：
   - 絕對禁止一上來就講理論或名詞定義。
   - 必須以一個 15 秒能看完的「道德/利益/策略二選一難題」開場，讓讀者親身體驗兩難。
2. 【零術語負債 (Zero Jargon Debt)】：
   - 內文必須是小學生也能聽懂的白話文與生活化比喻（如超商、辦公室、買菜、排隊）。
   - 如果不可避免出現專業詞彙，必須在 jargons 中獨立標註並給予「一句話、20字內」的極度白話翻譯。且核心比喻或本質中必須精確出現該詞彙。
3. 【現實防身術 (Real-World Takeaway)】：
   - 告訴讀者今天走出門，如何用這個模型識破陷阱或做出更聰明的決策。
4. 【課後好奇心三扇門 (Branching Doors)】：
   - 延伸出三扇充滿懸念的下一個探索傳送門（深入同領域、跨界跳躍、反常識翻轉），帶動知識圖譜自我擴張。

【輸出格式】：必須嚴格輸出純 JSON，不可包含 markdown 標籤或額外廢話。
JSON Schema 如下：
{
  "id": "英文字符唯一標識",
  "domain": "領域名稱（如：物理學思維、哲學認識論、資訊科學、生態系統學等任何領域）",
  "domainId": "領域英文唯一代碼（如 physics, philosophy, info_theory, ecology 等）",
  "title": "標題（例：奧卡姆剃刀：如無必要，勿增實體）",
  "modelEn": "模型英文專有名詞（例：Occam's Razor、Boxed Pigs Game 等）",
  "subtitle": "副標題（15字內精闢總結）",
  "icon": "單個代表性 Emoji",
  "readingTime": "2.5 分鐘",
  "status": "fogged",
  "relicReward": {
    "id": "relic_xxx",
    "name": "神器名稱",
    "domain": "領域名稱",
    "icon": "神器 Emoji"
  },
  "dilemma": {
    "prompt": "情境難題描述（100字內，清晰具體）",
    "options": [
      { "id": "A", "text": "選項 A 描述", "stats": 數字, "verdict": "選 A 的點評" },
      { "id": "B", "text": "選項 B 描述", "stats": 數字, "verdict": "選 B 的點評" }
    ],
    "reveal": "揭曉為什麼會這樣的一句話總結"
  },
  "core": {
    "essence": "一句話核心本質（30字內）",
    "analogy": "極度接地氣的生活比喻（100字內，包含 jargons 中的名詞）",
    "jargons": [
      { "term": "專業詞彙（例：本體論）", "en": "英文專有名詞對照（例：Ontology）", "explanation": "20字內的白話直白翻譯" }
    ]
  },
  "takeaway": {
    "action": "今天走進生活/職場如何具體應用的行動指引（80字內）"
  },
  "doors": [
    { "type": "deep", "badge": "深入同域", "targetId": "xxx", "title": "懸念標題", "hook": "好奇心鉤子一句話", "icon": "Emoji" },
    { "type": "cross", "badge": "跨界跳躍", "targetId": "xxx", "title": "懸念標題", "hook": "好奇心鉤子一句話", "icon": "Emoji" },
    { "type": "twist", "badge": "反常識", "targetId": "xxx", "title": "懸念標題", "hook": "好奇心鉤子一句話", "icon": "Emoji" }
  ]
}
`;

async function callGoogleGemini(userPrompt) {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
  
  // Model priority: configured model -> gemini-flash-latest -> gemini-flash-lite-latest -> gemini-3.6-flash
  const candidateModels = Array.from(new Set([GEMINI_MODEL, 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.6-flash']));
  
  let lastError = null;
  for (const m of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }] }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${errText}`);
      }
      const data = await res.json();
      console.log(`[Google Gemini] Generated successfully using model: ${m}`);
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.warn(`[Google Gemini] Model ${m} failed (${err.message.substring(0, 80)}...), trying next model...`);
      lastError = err;
    }
  }
  throw new Error(`All Gemini models failed: ${lastError ? lastError.message : 'Unknown'}`);
}

async function callOpenRouter(userPrompt) {
  if (!OPENROUTER_API_KEY) throw new Error('Missing OPENROUTER_API_KEY');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    })
  });
  if (!res.ok) throw new Error(`OpenRouter Error: ${res.statusText}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// Multi-provider Runner
async function generateCard(domain = '跨領域前沿', specificTopic = '') {
  const prompt = specificTopic 
    ? `請為【${domain}】領域中的心智模型【${specificTopic}】生成一張高品質微學習探索卡片。`
    : `請從【${domain}】領域中挑選一個最反直覺、最深刻、能破解生活與決策盲點的核心心智模型，生成一張微學習探索卡片。`;

  console.log(`[Super Mind Odyssey] Generating card for domain: ${domain} (Topic: ${specificTopic || 'AI Curated'})...`);

  // Provider Failover
  let result = null;
  const providers = [
    { name: 'Google AI Studio', fn: () => callGoogleGemini(prompt) },
    { name: 'OpenRouter Free', fn: () => callOpenRouter(prompt) }
  ];

  for (const p of providers) {
    try {
      console.log(`Trying provider: ${p.name}...`);
      result = await p.fn();
      console.log(`Successfully generated via ${p.name}!`);
      break;
    } catch (err) {
      console.warn(`Provider ${p.name} failed:`, err.message);
    }
  }

  if (!result) {
    console.error('All free providers failed or no API keys configured in environment.');
    return null;
  }

  return result;
}

// Auto-expand Knowledge Graph by finding missing frontier doors or exploring new domains
async function autoExpandDatabase(specificTopic = '', preferredDomain = '') {
  const dbPath = path.resolve(__dirname, '../src/scripts/database.js');
  if (!fs.existsSync(dbPath)) {
    throw new Error('database.js not found at ' + dbPath);
  }

  const topicToGen = specificTopic || '奧卡姆剃刀';
  const domainToGen = preferredDomain || '哲學與認識論';

  const card = await generateCard(domainToGen, topicToGen);
  if (!card) {
    console.error('[Auto-Expand] Failed to generate card.');
    return null;
  }

  // Format node JSON
  const nodeJsonString = JSON.stringify(card, null, 2);

  // Read current database.js
  let dbContent = fs.readFileSync(dbPath, 'utf-8');

  // Insert before "];\n\nwindow.MIND_DATABASE"
  const insertMarker = '];\n\nwindow.MIND_DATABASE';
  if (!dbContent.includes(insertMarker)) {
    console.warn('Could not find insert marker in database.js, appending to file.');
    fs.appendFileSync(dbPath, `\n// Auto-Expanded Node: ${card.title}\n// ${nodeJsonString}\n`);
    return card;
  }

  const indentedNode = nodeJsonString.split('\n').map(line => '  ' + line).join('\n');
  const replacement = `,\n\n  // Auto-Expanded: ${card.domain} - ${card.title}\n${indentedNode}\n${insertMarker}`;
  dbContent = dbContent.replace(insertMarker, replacement);
  fs.writeFileSync(dbPath, dbContent, 'utf-8');

  console.log(`[Auto-Expand] Successfully injected new node: 【${card.title}】 (${card.domain}) into database.js!`);
  return card;
}

// CLI runner
if (require.main === module) {
  const args = process.argv.slice(2);
  const domainArg = args.find(a => a.startsWith('--domain='))?.split('=')[1] || '';
  const topicArg = args.find(a => a.startsWith('--topic='))?.split('=')[1] || '';
  const isAutoExpand = args.includes('--auto-expand');

  if (isAutoExpand || topicArg) {
    autoExpandDatabase(topicArg, domainArg).then(card => {
      if (card) {
        console.log('\n--- Auto-Expanded Mind Card ---');
        console.log(card.title, `(${card.domain})`);
      }
    });
  } else {
    generateCard(domainArg || '物理學思維', topicArg).then(card => {
      if (card) {
        console.log('\n--- Generated Mind Card ---');
        console.log(JSON.stringify(card, null, 2));
      }
    });
  }
}

module.exports = { generateCard, autoExpandDatabase };

