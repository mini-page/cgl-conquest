// === MOCK ANALYTICS MODULE ===
// 10. MOCK TEST SCORE LOGS AND GRAPH
function initForms() {
    // Populate weak areas select dropdown
    const weakTopicSelect = document.getElementById("mock-weak-topic");
    if (weakTopicSelect) {
        let options = '<option value="">-- No Weak Topic Selected --</option>';
        SYLLABUS_DATA.forEach(topic => {
            topic.subtopics.forEach(sub => {
                options += `<option value="${sub.id}">${topic.subject} - ${sub.name}</option>`;
            });
        });
        weakTopicSelect.innerHTML = options;
    }

    const mockForm = document.getElementById("form-mock");
    mockForm.onsubmit = (e) => {
        e.preventDefault();
        
        const name = document.getElementById("mock-name").value;
        const date = document.getElementById("mock-date").value;
        const score = parseFloat(document.getElementById("mock-score").value);
        const accuracy = parseFloat(document.getElementById("mock-accuracy").value) || null;
        const rank = document.getElementById("mock-rank").value || "N/A";
        
        const qScore = parseFloat(document.getElementById("score-quant").value) || 0;
        const rScore = parseFloat(document.getElementById("score-reasoning").value) || 0;
        const eScore = parseFloat(document.getElementById("score-english").value) || 0;
        const gaScore = parseFloat(document.getElementById("score-ga").value) || 0;
        
        const notes = document.getElementById("mock-notes").value;
        const weakTopicId = document.getElementById("mock-weak-topic").value;

        const newMock = {
            id: "mock-" + Date.now(),
            name, date, score, accuracy, rank,
            breakdown: { quant: qScore, reasoning: rScore, english: eScore, ga: gaScore },
            notes,
            weakTopicId
        };

        appState.mocks.push(newMock);
        appState.mocks.sort((a,b) => new Date(a.date) - new Date(b.date));
        
        if (weakTopicId) {
            if (!appState.weakAlerts) appState.weakAlerts = {};
            appState.weakAlerts[weakTopicId] = true;
        }

        saveStateToStorage();
        mockForm.reset();
        if (weakTopicSelect) weakTopicSelect.value = "";
        
        renderAll();
        renderMockAnalytics();
        speakText("Mock score logged successfully.");
    };

    // Note logs form inside Study toolkit Custom Notes tab
    const noteForm = document.getElementById("form-note");
    const noteContentInput = document.getElementById("note-content");
    const latexPreview = document.getElementById("latex-preview");

    if (noteContentInput && latexPreview) {
        noteContentInput.addEventListener("input", () => {
            const val = noteContentInput.value.trim();
            latexPreview.innerHTML = parseMarkdown(val) || "Type math formulas inside $...$ to preview render...";
            if (window.renderMathInElement && val) {
                window.renderMathInElement(latexPreview, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }
        });
    }

    noteForm.onsubmit = (e) => {
        e.preventDefault();
        
        const title = document.getElementById("note-title").value;
        const category = document.getElementById("note-category").value;
        const subject = document.getElementById("note-subject").value;
        const content = noteContentInput.value;

        const newNote = {
            id: "note-" + Date.now(),
            title, category, subject, content,
            date: new Date().toLocaleDateString()
        };

        appState.notes.push(newNote);
        saveStateToStorage();
        noteForm.reset();
        if (latexPreview) {
            latexPreview.innerText = "Type math formulas inside $...$ to preview render...";
        }
        
        renderToolkit();
        speakText("Note saved to toolkit.");
    };
}

function renderMockAnalytics() {
    const tbody = document.getElementById("mock-table-body");
    
    if (appState.mocks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-xs text-gray-500 py-6">No mocks taken yet. Log your first mock!</td></tr>`;
        renderSvgMockChart([]);
        return;
    }

    let html = "";
    appState.mocks.forEach(m => {
        const accuracyText = m.accuracy ? m.accuracy + "%" : "N/A";
        const bd = m.breakdown;
        const breakupText = (bd.quant || bd.reasoning || bd.english || bd.ga) ? 
                            `${bd.quant}/${bd.reasoning}/${bd.english}/${bd.ga}` : "N/A";

        html += `
            <tr class="hover:bg-white/2px transition">
                <td class="px-3 py-2 text-gray-400">${m.date}</td>
                <td class="px-3 py-2"><strong class="text-white">${m.name}</strong><br><span class="text-[9px] text-gray-500 font-bold uppercase">Rank: ${m.rank}</span></td>
                <td class="px-3 py-2 font-heading font-extrabold text-accentCyan">${m.score}</td>
                <td class="px-3 py-2 text-center text-gray-400">${breakupText}</td>
                <td class="px-3 py-2 text-right">
                    <button class="text-gray-500 hover:text-accentRose px-2 transition" onclick="deleteMock('${m.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    const totalScore = appState.mocks.reduce((acc, m) => acc + parseFloat(m.score), 0);
    const maxScore = appState.mocks.reduce((max, m) => Math.max(max, parseFloat(m.score)), 0);
    const avgScore = (totalScore / appState.mocks.length).toFixed(1);

    const loggedAccuracies = appState.mocks.filter(m => m.accuracy !== null);
    let avgAccuracy = 0;
    if (loggedAccuracies.length > 0) {
        const sumAcc = loggedAccuracies.reduce((acc, m) => acc + parseFloat(m.accuracy), 0);
        avgAccuracy = Math.round(sumAcc / loggedAccuracies.length);
    }

    document.getElementById("metric-avg-score").innerText = avgScore;
    document.getElementById("metric-max-score").innerText = maxScore.toFixed(1);
    document.getElementById("metric-avg-accuracy").innerText = avgAccuracy + "%";

    renderSvgMockChart(appState.mocks);
}

function deleteMock(mockId) {
    if (confirm("Delete this mock record?")) {
        appState.mocks = appState.mocks.filter(m => m.id !== mockId);
        saveStateToStorage();
        renderAll();
        renderMockAnalytics();
    }
}

function renderSvgMockChart(mocksList) {
    const svg = document.getElementById("analytics-svg-chart");
    svg.innerHTML = "";

    const width = svg.clientWidth || 400;
    const height = 200;
    const padding = 35;
    
    // Draw Y-axis grid markers
    const gridScores = [50, 100, 150, 200];
    gridScores.forEach(score => {
        const y = height - padding - ((score / 200) * (height - 2 * padding));
        svg.innerHTML += `
            <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
            <text x="${padding - 5}" y="${y + 4}" fill="#6b7280" font-size="8" font-family="monospace" text-anchor="end">${score}</text>
        `;
    });

    // Draw safety cutoff target line (140)
    const targetY = height - padding - ((140 / 200) * (height - 2 * padding));
    svg.innerHTML += `
        <line x1="${padding}" y1="${targetY}" x2="${width - padding}" y2="${targetY}" stroke="rgba(16,185,129,0.3)" stroke-width="1.5" stroke-dasharray="3,3" />
        <text x="${width - padding - 5}" y="${targetY - 5}" fill="#10b981" font-size="7" font-weight="bold" text-anchor="end">Target Cutoff (140)</text>
    `;

    if (mocksList.length === 0) {
        svg.innerHTML += `<text x="${width/2}" y="${height/2}" fill="#6b7280" text-anchor="middle" font-size="10">Log mock tests to render progress metrics</text>`;
        return;
    }

    const points = [];
    const count = mocksList.length;
    
    mocksList.forEach((mock, idx) => {
        const x = padding + (idx * ((width - 2 * padding) / Math.max(count - 1, 1)));
        const y = height - padding - ((mock.score / 200) * (height - 2 * padding));
        points.push({ x, y, score: mock.score, name: mock.name });
    });

    if (count > 1) {
        let pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            pathD += ` L ${points[i].x} ${points[i].y}`;
        }
        svg.innerHTML += `<path d="${pathD}" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" />`;
    }

    points.forEach(pt => {
        svg.innerHTML += `
            <g style="cursor:pointer;">
                <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#151526" stroke="#06b6d4" stroke-width="2" />
                <title>${pt.name}: ${pt.score}/200</title>
            </g>
        `;
    });
}
