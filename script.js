document.addEventListener('DOMContentLoaded', () => {

    /* --- Global Chart.js Configuration for Modern AI Theme --- */
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    Chart.defaults.plugins.tooltip.titleColor = '#f8fafc';
    Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;

    /* --- Page Navigation Logic --- */
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active classes
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));

            // Add active class to clicked item and corresponding page
            item.classList.add('active');
            const targetPageId = `page-${item.dataset.page}`;
            document.getElementById(targetPageId).classList.add('active');
        });
    });

    /* --- Chart.js Initialization (Dashboard) --- */
    const initCharts = () => {
        const ctx = document.getElementById('volumeChart');
        if (!ctx) return;

        // Gradient for line chart
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Analyzed Comments',
                    data: [12000, 19000, 15000, 22000, 18000, 25000, 21000],
                    borderColor: '#38bdf8',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#38bdf8',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Toxic Flags',
                    data: [800, 1200, 950, 1500, 1100, 1800, 1400],
                    borderColor: '#ef4444',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#94a3b8' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                        ticks: { color: '#94a3b8' }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
            }
        });
    };

    // State for Performance Chart
    let performanceBarChartInstance = null;

    // Initialize mock Accuracy Bar chart
    const initPerformanceChart = () => {
        const ctx2 = document.getElementById('accuracyBarChart');
        if (!ctx2) return;
        
        performanceBarChartInstance = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score'],
                datasets: [{
                    label: 'Score %',
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(56, 189, 248, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                    ],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.05)' }, 
                        ticks: { color: '#94a3b8' } 
                    },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    };

    // Load Charts
    initCharts();
    initPerformanceChart();


    /* --- Prediction Tool Logic (Mock Analysis) --- */
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const inferenceText = document.getElementById('inference-text');
    const resultCard = document.getElementById('result-card');
    
    // Result elements
    const toxBar = document.getElementById('toxicity-bar');
    const toxValue = document.getElementById('toxicity-value');
    const resultBadge = document.getElementById('result-badge');
    const hlText = document.getElementById('highlighted-text');

    const catInsult = document.getElementById('cat-insult');
    const catProfanity = document.getElementById('cat-profanity');
    const catThreat = document.getElementById('cat-threat');

    // List of mock trigger words
    const triggers = ['pathetic', 'stupid', 'ugly', 'worthless', 'fool', 'dumb', 'hate'];

    analyzeBtn.addEventListener('click', () => {
        const text = inferenceText.value.trim();
        if(!text) return;

        // Show card and set processing state
        resultCard.style.display = 'block';
        analyzeBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Analyzing...";
        analyzeBtn.disabled = true;
        
        resultBadge.className = 'badge';
        resultBadge.textContent = 'Processing...';
        toxBar.style.width = '0%';
        toxValue.textContent = '...';
        toxValue.className = 'score-value';
        
        hlText.innerHTML = text; // temporary

        // Simulate API call delay
        setTimeout(() => {
            // Extremely basic heuristic for demo purposes
            let toxicScore = 0.05 + (Math.random() * 0.1); // Base score
            let foundTriggers = [];

            const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
            
            words.forEach(w => {
                if(triggers.includes(w)) {
                    toxicScore += 0.25;
                    foundTriggers.push(w);
                }
            });

            // Cap at 0.99
            toxicScore = Math.min(toxicScore, 0.99);

            // Update UI with results
            const pct = Math.round(toxicScore * 100);
            toxBar.style.width = `${pct}%`;
            toxValue.textContent = `${pct}%`;

            if(pct > 60) {
                toxValue.classList.add('toxic');
                resultBadge.className = 'badge danger';
                resultBadge.textContent = 'Toxic Content Detected';
                
                // Set categories
                catInsult.textContent = (toxicScore * Math.random()).toFixed(2);
                catProfanity.textContent = (toxicScore * Math.random()).toFixed(2);
                catThreat.textContent = (toxicScore * Math.random()).toFixed(2);
            } else {
                toxValue.classList.add('safe');
                resultBadge.className = 'badge success';
                resultBadge.textContent = 'Content is Safe';
                
                catInsult.textContent = '0.01';
                catProfanity.textContent = '0.00';
                catThreat.textContent = '0.00';
            }

            // Highlighting script
            let highlighted = text;
            foundTriggers.forEach(trigger => {
                const regex = new RegExp(`\\b(${trigger})\\b`, 'gi');
                highlighted = highlighted.replace(regex, `<span class="highlight-toxic">$1</span>`);
            });
            hlText.innerHTML = highlighted;

            // Reset btn
            analyzeBtn.innerHTML = "<i class='bx bx-scan'></i> Analyze Text";
            analyzeBtn.disabled = false;

        }, 1500); // 1.5s simulated loading
    });

    clearBtn.addEventListener('click', () => {
        inferenceText.value = '';
        resultCard.style.display = 'none';
        toxBar.style.width = '0%';
    });

    /* --- Global State --- */
    let globalDatasetRecords = [];
    let globalTextIdx = -1;
    let globalLabelIdx = -1;
    
    /* --- Dataset Upload Logic --- */
    const uploadInput = document.getElementById('dataset-upload');
    const previewCard = document.getElementById('dataset-preview-card');
    const statsContainer = document.getElementById('dataset-stats-container');
    const metaRows = document.getElementById('meta-rows');
    const metaCols = document.getElementById('meta-cols');
    const previewTableBody = document.querySelector('#preview-table tbody');
    const trainModelBtn = document.getElementById('btn-train-model');

    let datasetPieChartInstance = null;
    let datasetBarChartInstance = null;

    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                const data = evt.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                if (json.length === 0) {
                    alert("The uploaded file is empty.");
                    return;
                }

                // Assuming first row is headers
                const headers = json[0].map(h => (h || '').toString().toLowerCase().trim());
                
                const textIdx = headers.indexOf('text');
                const labelIdx = headers.indexOf('label');

                if (textIdx === -1 || labelIdx === -1) {
                    alert("The dataset must contain 'text' and 'label' columns.");
                    return;
                }

                // Filter out empty rows, assign to global state
                globalTextIdx = textIdx;
                globalLabelIdx = labelIdx;
                globalDatasetRecords = json.slice(1).filter(r => r.length > 0 && r[textIdx] !== undefined);
                const records = globalDatasetRecords;

                // Show Train Button
                if (trainModelBtn) trainModelBtn.style.display = 'inline-flex';

                // Calculate Stats
                let toxicCount = 0;
                let safeCount = 0;
                const totalCount = records.length;

                records.forEach(row => {
                    const labelVal = row[labelIdx] !== undefined ? row[labelIdx].toString() : '';
                    if (labelVal === '1' || labelVal.toLowerCase() === 'toxic') {
                        toxicCount++;
                    } else {
                        safeCount++;
                    }
                });

                // Update Stats UI
                statsContainer.style.display = 'block';
                document.getElementById('stat-total').textContent = totalCount.toLocaleString();
                document.getElementById('stat-toxic').textContent = toxicCount.toLocaleString();
                document.getElementById('stat-safe').textContent = safeCount.toLocaleString();
                
                const toxicPct = totalCount > 0 ? Math.round((toxicCount / totalCount) * 100) : 0;
                const safePct = totalCount > 0 ? Math.round((safeCount / totalCount) * 100) : 0;
                
                document.getElementById('stat-toxic-pct').innerHTML = `<i class='bx bx-trending-up'></i> ${toxicPct}%`;
                document.getElementById('stat-safe-pct').innerHTML = `<i class='bx bx-check'></i> ${safePct}%`;

                // Update Dashboard Global Stats
                const dashTotalSize = document.getElementById('dash-total-size');
                const dashToxicPct = document.getElementById('dash-toxic-pct');
                if (dashTotalSize) dashTotalSize.textContent = totalCount.toLocaleString();
                if (dashToxicPct) dashToxicPct.textContent = `${toxicPct}%`;

                // Update Charts
                if (datasetPieChartInstance) datasetPieChartInstance.destroy();
                if (datasetBarChartInstance) datasetBarChartInstance.destroy();

                const pieCtx = document.getElementById('datasetPieChart').getContext('2d');
                datasetPieChartInstance = new Chart(pieCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Toxic', 'Safe'],
                        datasets: [{
                            data: [toxicCount, safeCount],
                            backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)'],
                            borderWidth: 0,
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: '#94a3b8' } }
                        },
                        cutout: '70%'
                    }
                });

                const barCtx = document.getElementById('datasetBarChart').getContext('2d');
                datasetBarChartInstance = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Label Count'],
                        datasets: [
                            {
                                label: 'Toxic',
                                data: [toxicCount],
                                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                                borderRadius: 4
                            },
                            {
                                label: 'Safe',
                                data: [safeCount],
                                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                                borderRadius: 4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: '#94a3b8' } }
                        },
                        scales: {
                            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                        }
                    }
                });


                // Meta Update
                metaRows.textContent = `Rows: ${records.length}`;
                metaCols.textContent = `Columns: ${headers.length}`;

                // First 10 records
                const previewRecords = records.slice(0, 10);
                previewTableBody.innerHTML = '';

                previewRecords.forEach(row => {
                    const tr = document.createElement('tr');
                    
                    const tdText = document.createElement('td');
                    tdText.style.maxWidth = '400px';
                    tdText.style.overflow = 'hidden';
                    tdText.style.textOverflow = 'ellipsis';
                    tdText.style.whiteSpace = 'nowrap';
                    tdText.textContent = row[globalTextIdx] || '';
                    
                    const tdLabel = document.createElement('td');
                    const labelVal = row[globalLabelIdx] !== undefined ? row[globalLabelIdx].toString() : '';
                    tdLabel.innerHTML = `<span class="badge ${labelVal == '1' || labelVal.toLowerCase() == 'toxic' ? 'danger' : 'success'}">${labelVal}</span>`;
                    
                    tr.appendChild(tdText);
                    tr.appendChild(tdLabel);
                    previewTableBody.appendChild(tr);
                });

                previewCard.style.display = 'block';
            };
            
            reader.readAsBinaryString(file);
        });
    }

    /* --- ML Pipeline Training Logic --- */
    if (trainModelBtn) {
        trainModelBtn.addEventListener('click', () => {
            if (globalDatasetRecords.length === 0) return;

            // Optional UI Loading State
            trainModelBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Training Models...";
            trainModelBtn.disabled = true;

            // Execute in setTimeout to allow UI thread to render Spinner
            setTimeout(() => {
                const originalText = trainModelBtn.innerHTML;

                console.log("[App] Sending Training Request to Flask...");
                
                const payload = {
                        records: globalDatasetRecords.map(r => ({
                            text: r[globalTextIdx],
                            label: r[globalLabelIdx]
                        }))
                    };

                    fetch('http://127.0.0.1:5000/train', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })
                    .then(response => response.json())
                    .then(results => {
                        if (results.error) {
                            alert("Training Error: " + results.error);
                            trainModelBtn.innerHTML = originalText;
                            trainModelBtn.disabled = false;
                            return;
                        }

                        // Display Notification
                        alert(`Model Trained Successfully via Flask API!\n\nTest Set Accuracy: ${(results.accuracy * 100).toFixed(1)}%`);

                        // Redirect to Model Performance Page to show live numbers
                        document.querySelector('.nav-item[data-page="model"]').click();
                    
                        // Update Performance View DOM dynamically
                        const metrics = [results.accuracy, results.precision, results.recall, results.f1_score]; 
                        const ids = ['circ-acc', 'circ-prec', 'circ-rec', 'circ-f1'];
                        
                        ids.forEach((id, index) => {
                            const el = document.getElementById(id);
                            if (el) {
                                const val = Math.round(metrics[index] * 100);
                                el.style.background = `conic-gradient(var(--accent-blue) calc(${val}*1%), rgba(255,255,255,0.05) 0)`;
                                el.querySelector('.progress-val').textContent = `${val.toFixed(1)}%`;
                            }
                        });

                        // Update Performance Bar Chart
                        if (performanceBarChartInstance) {
                            performanceBarChartInstance.data.datasets[0].data = metrics.map(m => Math.round(m * 100));
                            performanceBarChartInstance.update();
                        }

                    // Update Summary Card
                    document.getElementById('summary-acc').textContent = `${(results.accuracy * 100).toFixed(1)}%`;
                    document.getElementById('summary-tp').textContent = results.confusion_matrix.tp;
                    document.getElementById('summary-tn').textContent = results.confusion_matrix.tn;
                    document.getElementById('summary-fp').textContent = results.confusion_matrix.fp;
                    document.getElementById('summary-fn').textContent = results.confusion_matrix.fn;
                    document.getElementById('summary-status').innerHTML = `Training completed over <strong>${globalDatasetRecords.length}</strong> samples.<br>Model is active and ready for inference.`;

                    // Update Dashboard Summary Stats & Matrix
                    const dashAcc = document.getElementById('dash-accuracy');
                    const dashCmBadge = document.getElementById('dash-cm-badge');
                    if (dashAcc) dashAcc.textContent = `${(results.accuracy * 100).toFixed(1)}%`;
                    if (dashCmBadge) {
                        dashCmBadge.textContent = 'Active Model';
                        dashCmBadge.className = 'badge success';
                    }

                    // Update Confusion Matrix Heatmap (Performance Page)
                    const tp = results.confusion_matrix.tp;
                    const tn = results.confusion_matrix.tn;
                    const fp = results.confusion_matrix.fp;
                    const fn = results.confusion_matrix.fn;
                    
                    document.querySelector('#hm-tp .hm-val').textContent = tp;
                    document.querySelector('#hm-tn .hm-val').textContent = tn;
                    document.querySelector('#hm-fp .hm-val').textContent = fp;
                    document.querySelector('#hm-fn .hm-val').textContent = fn;

                    // Dash Confusion Matrix Preview
                    const dashHmTp = document.getElementById('dash-hm-tp');
                    if (dashHmTp) {
                        dashHmTp.querySelector('.hm-val').textContent = tp;
                        document.querySelector('#dash-hm-tn .hm-val').textContent = tn;
                        document.querySelector('#dash-hm-fp .hm-val').textContent = fp;
                        document.querySelector('#dash-hm-fn .hm-val').textContent = fn;
                    }

                    // Color Scaling for Heatmap based on values
                    const maxVal = Math.max(tp, tn, fp, fn, 1);
                    document.getElementById('hm-tp').style.backgroundColor = `rgba(239, 68, 68, ${Math.max(0.1, tp/maxVal)})`;
                    document.getElementById('hm-tn').style.backgroundColor = `rgba(16, 185, 129, ${Math.max(0.1, tn/maxVal)})`;
                    document.getElementById('hm-fp').style.backgroundColor = `rgba(245, 158, 11, ${Math.max(0.1, fp/maxVal)})`;
                    document.getElementById('hm-fn').style.backgroundColor = `rgba(245, 158, 11, ${Math.max(0.1, fn/maxVal)})`;

                    if (dashHmTp) {
                        dashHmTp.style.backgroundColor = `rgba(239, 68, 68, ${Math.max(0.1, tp/maxVal)})`;
                        document.getElementById('dash-hm-tn').style.backgroundColor = `rgba(16, 185, 129, ${Math.max(0.1, tn/maxVal)})`;
                        document.getElementById('dash-hm-fp').style.backgroundColor = `rgba(245, 158, 11, ${Math.max(0.1, fp/maxVal)})`;
                        document.getElementById('dash-hm-fn').style.backgroundColor = `rgba(245, 158, 11, ${Math.max(0.1, fn/maxVal)})`;
                    }

                    // Re-wire Live Prediction Tool to use actual ML Model
                    const inferenceText = document.getElementById('inference-text');
                    const analyzeBtn = document.getElementById('analyze-btn');
                    const toxBar = document.getElementById('toxicity-bar');
                    const toxValue = document.getElementById('toxicity-value');
                    const resultBadge = document.getElementById('result-badge');
                    const hlText = document.getElementById('highlighted-text');

                    // Override old mock listener (create a clone to strip old event handlers)
                    const newAnalyzeBtn = analyzeBtn.cloneNode(true);
                    analyzeBtn.parentNode.replaceChild(newAnalyzeBtn, analyzeBtn);
                    
                    newAnalyzeBtn.addEventListener('click', () => {
                        const text = inferenceText.value.trim();
                        if(!text) return;
                        
                        document.getElementById('result-card').style.display = 'block';
                        
                        newAnalyzeBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Analyzing...";
                        newAnalyzeBtn.disabled = true;

                        // Real execution via Flask API
                        const payload = { text: text };
                        fetch('http://127.0.0.1:5000/predict', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.error) {
                                alert("Prediction Error: " + data.error);
                                newAnalyzeBtn.innerHTML = "<i class='bx bx-scan'></i> Analyze Text";
                                newAnalyzeBtn.disabled = false;
                                return;
                            }

                            const prob = data.toxicity_probability;
                            const pct = Math.round(prob * 100);
                            const triggers = data.triggers || [];
                            const isToxic = data.prediction === 1;

                            toxBar.style.width = `${pct}%`;
                            toxValue.textContent = `${pct}%`;

                            if(isToxic) {
                                toxValue.className = 'score-value toxic';
                                resultBadge.className = 'badge danger';
                                resultBadge.textContent = 'Cyberbullying';
                                
                                if (catInsult) catInsult.textContent = (prob * Math.random()).toFixed(2);
                                if (catProfanity) catProfanity.textContent = (prob * Math.random()).toFixed(2);
                                if (catThreat) catThreat.textContent = (prob * Math.random()).toFixed(2);
                            } else {
                                toxValue.className = 'score-value safe';
                                resultBadge.className = 'badge success';
                                resultBadge.textContent = 'Normal';
                                
                                if (catInsult) catInsult.textContent = '0.01';
                                if (catProfanity) catProfanity.textContent = '0.00';
                                if (catThreat) catThreat.textContent = '0.00';
                            }

                            // Apply highlights
                            let highlightedHTML = text;
                            if (triggers.length > 0) {
                                triggers.forEach(trigger => {
                                    const regex = new RegExp(`\\b(${trigger})\\b`, 'gi');
                                    highlightedHTML = highlightedHTML.replace(regex, `<span class="highlight-toxic">$1</span>`);
                                });
                            }
                            
                            if (hlText) {
                                hlText.innerHTML = highlightedHTML;
                            }

                            // Reset btn
                            newAnalyzeBtn.innerHTML = "<i class='bx bx-scan'></i> Analyze Text";
                            newAnalyzeBtn.disabled = false;
                        })
                        .catch(err => {
                            console.error("Fetch error:", err);
                            alert("Failed to connect to Flask API.");
                            newAnalyzeBtn.innerHTML = "<i class='bx bx-scan'></i> Analyze Text";
                            newAnalyzeBtn.disabled = false;
                    });
                    }); // Closes newAnalyzeBtn.addEventListener

                    }) // Closes train fetch .then()
                    .catch(err => {
                        console.error("Training Error: ", err);
                        alert("Training failed. See console for details.");
                    });

                trainModelBtn.innerHTML = "<i class='bx bx-check'></i> Model Ready";
                trainModelBtn.classList.replace('btn-success', 'btn-primary');
                trainModelBtn.disabled = false;
            }, 100);
        });
    }

    /* --- Dash Quick Prediction Tool --- */
    const dashPredictBtn = document.getElementById('dash-quick-btn');
    if (dashPredictBtn) {
        dashPredictBtn.addEventListener('click', () => {
            const dashInput = document.getElementById('dash-quick-input').value.trim();
            if (!dashInput) return;

            const dashResultBlock = document.getElementById('dash-quick-result');
            const dashBadge = document.getElementById('dash-quick-badge');
            const dashScore = document.getElementById('dash-quick-score');
            
            dashResultBlock.style.display = 'block';
            dashBadge.textContent = 'Analyzing...';
            dashBadge.className = 'badge';
            dashScore.textContent = '...';

            // Real execution via Flask API
            const payload = { text: dashInput };
            fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    dashBadge.className = 'badge warning';
                    dashBadge.textContent = 'Model Untrained';
                    dashScore.textContent = data.error;
                    dashScore.style.color = 'var(--text-secondary)';
                    return;
                }

                const prob = data.toxicity_probability;
                const pct = Math.round(prob * 100);
                const isToxic = data.prediction === 1;

                if (isToxic) {
                    dashBadge.className = 'badge danger';
                    dashBadge.textContent = 'Cyberbullying';
                    dashScore.textContent = `${pct}% Toxicity Level`;
                    dashScore.style.color = 'var(--danger)';
                } else {
                    dashBadge.className = 'badge success';
                    dashBadge.textContent = 'Normal';
                    dashScore.textContent = 'Safe / Non-Toxic';
                    dashScore.style.color = 'var(--success)';
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                dashBadge.className = 'badge warning';
                dashBadge.textContent = 'Connection Error';
                dashScore.textContent = 'Failed to connect to Flask API.';
                dashScore.style.color = 'var(--text-secondary)';
            });
        });
    }

});
