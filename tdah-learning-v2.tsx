<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Système TDAH - Version Complète</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/svelte@4/dist/svelte.js"></script>
    <style>
        .fade-in { animation: fadeIn 0.3s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            animation: fall 2s ease-out forwards;
        }
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    </style>
</head>
<body>
    <div id="app"></div>

    <script type="module">
        const { SvelteComponent, init, safe_not_equal, element, text, space, attr, insert, noop, detach, listen, set_data, empty, destroy_each, binding_callbacks, append, create_component, mount_component, transition_in, transition_out, destroy_component, action_destroyer, run_all, tick } = window.svelte.internal;

        // Store global pour gérer l'état
        let state = {
            activeTab: 'planning',
            tasks: [],
            cognitiveScores: { workingMemory: 0, executive: 0, inhibition: 0, spatial: 0 },
            dailyGoal: '',
            darkMode: false,
            selectedDomain: 'frontend',
            
            // Pomodoro
            pomodoroTime: 25 * 60,
            pomodoroActive: false,
            pomodoroMode: 'work',
            pomodorosCompleted: 0,
            pomodoroInterval: null,
            
            // Stats
            statsHistory: [],
            streak: 0,
            totalXP: 0,
            showConfetti: false,
            
            // Games
            nBackGame: { active: false, sequence: [], index: 0, level: 1, score: 0, feedback: '' },
            stroopGame: { active: false, word: '', color: '', score: 0, total: 0, feedback: '' },
            sequenceGame: { active: false, sequence: [], userSequence: [], showing: false, level: 3, score: 0, feedback: '', currentFlash: null }
        };

        // Données des domaines
        const domainTasks = {
            frontend: [
                { title: 'HTML de base', subtasks: ['Réviser balises sémantiques (15min)', 'Créer page simple (20min)', 'Valider W3C (5min)'], category: 'html', time: 40 },
                { title: 'CSS Flexbox', subtasks: ['Lire doc Flexbox (10min)', '3 exercices (20min)', 'Créer navbar (15min)'], category: 'css', time: 45 },
                { title: 'JavaScript bases', subtasks: ['Variables et types (10min)', 'Fonctions (15min)', 'Exercices console (15min)'], category: 'js', time: 40 },
                { title: 'React Introduction', subtasks: ['Composants (15min)', 'Props (15min)', 'Premier composant (20min)'], category: 'react', time: 50 },
            ],
            backend: [
                { title: 'Node.js Setup', subtasks: ['Installer Node (10min)', 'Premier serveur HTTP (20min)', 'Tester Postman (10min)'], category: 'node', time: 40 },
                { title: 'REST API', subtasks: ['Concepts REST (15min)', 'Routes CRUD (25min)', 'Middleware (15min)'], category: 'api', time: 55 },
            ],
            data: [
                { title: 'Python Basics', subtasks: ['Variables types (10min)', 'Listes dicts (15min)', 'Fonctions (15min)'], category: 'python', time: 40 },
                { title: 'Pandas Intro', subtasks: ['Installer pandas (5min)', 'Lire CSV (15min)', 'Filtrer données (20min)'], category: 'pandas', time: 40 },
            ]
        };

        // Fonctions Storage
        async function loadData() {
            try {
                const keys = ['tasks-v2', 'scores-v2', 'goal-v2', 'xp-v2', 'streak-v2', 'pomodoros-v2'];
                for (const key of keys) {
                    try {
                        const result = await window.storage.get(`tdah-${key}`);
                        if (result) {
                            const fullKey = key.replace('-v2', '');
                            if (fullKey === 'tasks') state.tasks = JSON.parse(result.value);
                            else if (fullKey === 'scores') state.cognitiveScores = JSON.parse(result.value);
                            else if (fullKey === 'goal') state.dailyGoal = result.value;
                            else if (fullKey === 'xp') state.totalXP = parseInt(result.value);
                            else if (fullKey === 'streak') state.streak = parseInt(result.value);
                            else if (fullKey === 'pomodoros') state.pomodorosCompleted = parseInt(result.value);
                        }
                    } catch (e) {
                        console.log(`Pas de données pour ${key}`);
                    }
                }
            } catch (error) {
                console.log('Première utilisation');
            }
        }

        async function saveData(key, value) {
            try {
                await window.storage.set(`tdah-${key}`, typeof value === 'string' ? value : JSON.stringify(value));
            } catch (error) {
                console.error('Erreur sauvegarde:', error);
            }
        }

        // Fonctions utilitaires
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function getLevel() {
            return Math.floor(state.totalXP / 100) + 1;
        }

        function getXPProgress() {
            return state.totalXP % 100;
        }

        function addXP(amount) {
            state.totalXP += amount;
            saveData('xp-v2', state.totalXP.toString());
        }

        function triggerConfetti() {
            state.showConfetti = true;
            setTimeout(() => {
                state.showConfetti = false;
                renderApp();
            }, 3000);
        }

        // Gestion Pomodoro
        function startPomodoro() {
            if (state.pomodoroInterval) clearInterval(state.pomodoroInterval);
            
            state.pomodoroActive = true;
            state.pomodoroInterval = setInterval(() => {
                state.pomodoroTime--;
                
                if (state.pomodoroTime <= 0) {
                    clearInterval(state.pomodoroInterval);
                    state.pomodoroActive = false;
                    
                    if (state.pomodoroMode === 'work') {
                        state.pomodorosCompleted++;
                        saveData('pomodoros-v2', state.pomodorosCompleted.toString());
                        addXP(25);
                        state.pomodoroMode = 'break';
                        state.pomodoroTime = 5 * 60;
                        triggerConfetti();
                    } else {
                        state.pomodoroMode = 'work';
                        state.pomodoroTime = 25 * 60;
                    }
                }
                renderApp();
            }, 1000);
        }

        function pausePomodoro() {
            state.pomodoroActive = false;
            if (state.pomodoroInterval) {
                clearInterval(state.pomodoroInterval);
                state.pomodoroInterval = null;
            }
            renderApp();
        }

        function resetPomodoro() {
            if (state.pomodoroInterval) clearInterval(state.pomodoroInterval);
            state.pomodoroActive = false;
            state.pomodoroMode = 'work';
            state.pomodoroTime = 25 * 60;
            renderApp();
        }

        // Gestion des tâches
        function addTask(task) {
            const newTask = {
                ...task,
                id: Date.now(),
                completed: false,
                subtasksCompleted: new Array(task.subtasks.length).fill(false),
                dateAdded: new Date().toISOString()
            };
            state.tasks.push(newTask);
            saveData('tasks-v2', state.tasks);
            renderApp();
        }

        function toggleSubtask(taskId, subtaskIndex) {
            const task = state.tasks.find(t => t.id === taskId);
            if (task) {
                const wasCompleted = task.subtasksCompleted[subtaskIndex];
                task.subtasksCompleted[subtaskIndex] = !wasCompleted;
                
                if (!wasCompleted) {
                    state.cognitiveScores.executive = Math.min(100, state.cognitiveScores.executive + 2);
                    saveData('scores-v2', state.cognitiveScores);
                    addXP(5);
                }
                
                task.completed = task.subtasksCompleted.every(s => s);
                
                if (task.completed && !wasCompleted) {
                    triggerConfetti();
                    addXP(20);
                }
                
                saveData('tasks-v2', state.tasks);
                renderApp();
            }
        }

        function removeTask(taskId) {
            state.tasks = state.tasks.filter(t => t.id !== taskId);
            saveData('tasks-v2', state.tasks);
            renderApp();
        }

        // N-Back Game
        function startNBack() {
            const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
            state.nBackGame = {
                active: true,
                sequence: Array.from({ length: 20 }, () => letters[Math.floor(Math.random() * letters.length)]),
                index: 0,
                level: state.nBackGame.level,
                score: 0,
                feedback: ''
            };
            renderApp();
        }

        function checkNBack(isMatch) {
            const game = state.nBackGame;
            if (game.index < game.level) {
                game.feedback = 'Trop tôt !';
                renderApp();
                setTimeout(() => {
                    game.feedback = '';
                    renderApp();
                }, 1000);
                return;
            }

            const correctAnswer = game.sequence[game.index] === game.sequence[game.index - game.level];
            const correct = isMatch === correctAnswer;
            
            if (correct) {
                game.score++;
                state.cognitiveScores.workingMemory = Math.min(100, state.cognitiveScores.workingMemory + 1);
                saveData('scores-v2', state.cognitiveScores);
                addXP(3);
                game.feedback = '✓ Correct !';
            } else {
                game.feedback = '✗ Incorrect';
            }

            renderApp();

            setTimeout(() => {
                if (game.index < game.sequence.length - 1) {
                    game.index++;
                    game.feedback = '';
                } else {
                    game.active = false;
                    game.feedback = `Terminé ! Score: ${game.score}/${game.sequence.length - game.level}`;
                }
                renderApp();
            }, 1000);
        }

        function resetNBack() {
            state.nBackGame = { active: false, sequence: [], index: 0, level: state.nBackGame.level, score: 0, feedback: '' };
            renderApp();
        }

        // Stroop Test
        function startStroop() {
            const words = ['ROUGE', 'BLEU', 'VERT', 'JAUNE'];
            const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
            let wordIdx = Math.floor(Math.random() * words.length);
            let colorIdx = Math.floor(Math.random() * colors.length);
            
            while (wordIdx === colorIdx) {
                colorIdx = Math.floor(Math.random() * colors.length);
            }
            
            state.stroopGame = {
                active: true,
                word: words[wordIdx],
                color: colors[colorIdx],
                score: 0,
                total: 0,
                feedback: ''
            };
            renderApp();
        }

        function checkStroop(colorName) {
            const game = state.stroopGame;
            const colorMap = { 'ROUGE': '#ef4444', 'BLEU': '#3b82f6', 'VERT': '#22c55e', 'JAUNE': '#eab308' };
            const correct = colorMap[colorName] === game.color;
            
            game.total++;
            if (correct) {
                game.score++;
                state.cognitiveScores.inhibition = Math.min(100, state.cognitiveScores.inhibition + 2);
                saveData('scores-v2', state.cognitiveScores);
                addXP(3);
            }
            
            game.feedback = correct ? '✓' : '✗';
            renderApp();
            
            if (game.total < 10) {
                setTimeout(() => {
                    const words = ['ROUGE', 'BLEU', 'VERT', 'JAUNE'];
                    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
                    let wordIdx = Math.floor(Math.random() * words.length);
                    let colorIdx = Math.floor(Math.random() * colors.length);
                    while (wordIdx === colorIdx) colorIdx = Math.floor(Math.random() * colors.length);
                    game.word = words[wordIdx];
                    game.color = colors[colorIdx];
                    game.feedback = '';
                    renderApp();
                }, 800);
            } else {
                game.active = false;
                game.feedback = `Terminé ! Score: ${game.score}/10`;
                renderApp();
            }
        }

        function resetStroop() {
            state.stroopGame = { active: false, word: '', color: '', score: 0, total: 0, feedback: '' };
            renderApp();
        }

        // Sequence Game
        function startSequence() {
            const sequence = Array.from({ length: state.sequenceGame.level }, () => Math.floor(Math.random() * 9));
            state.sequenceGame = {
                active: true,
                sequence,
                userSequence: [],
                showing: true,
                level: state.sequenceGame.level,
                score: state.sequenceGame.score,
                feedback: '',
                currentFlash: null
            };
            renderApp();
            
            sequence.forEach((num, idx) => {
                setTimeout(() => {
                    state.sequenceGame.currentFlash = num;
                    renderApp();
                    setTimeout(() => {
                        state.sequenceGame.currentFlash = null;
                        renderApp();
                    }, 400);
                }, idx * 800);
            });
            
            setTimeout(() => {
                state.sequenceGame.showing = false;
                renderApp();
            }, sequence.length * 800 + 500);
        }

        function clickSequence(num) {
            const game = state.sequenceGame;
            if (game.showing) return;
            
            game.userSequence.push(num);
            
            if (game.userSequence.length === game.sequence.length) {
                const correct = game.userSequence.every((val, idx) => val === game.sequence[idx]);
                if (correct) {
                    game.score++;
                    state.cognitiveScores.spatial = Math.min(100, state.cognitiveScores.spatial + 3);
                    saveData('scores-v2', state.cognitiveScores);
                    addXP(10);
                    game.feedback = '✓ Correct !';
                    renderApp();
                    setTimeout(() => startSequence(), 1500);
                } else {
                    game.active = false;
                    game.feedback = `Terminé ! Score: ${game.score}`;
                    renderApp();
                }
            } else {
                renderApp();
            }
        }

        function resetSequence() {
            state.sequenceGame = { active: false, sequence: [], userSequence: [], showing: false, level: 3, score: 0, feedback: '', currentFlash: null };
            renderApp();
        }

        // Export
        function exportData() {
            const data = {
                tasks: state.tasks,
                cognitiveScores: state.cognitiveScores,
                totalXP: state.totalXP,
                streak: state.streak,
                pomodorosCompleted: state.pomodorosCompleted
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tdah-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
        }

        // Render principal
        function renderApp() {
            const app = document.getElementById('app');
            const bgClass = state.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-blue-50';
            const cardClass = state.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
            const textClass = state.darkMode ? 'text-gray-300' : 'text-gray-600';

            app.innerHTML = `
                <div class="${bgClass} min-h-screen p-4 transition-colors duration-300">
                    ${state.showConfetti ? `
                        <div class="fixed inset-0 pointer-events-none z-50">
                            ${Array.from({ length: 50 }).map((_, i) => `
                                <div class="confetti" style="
                                    left: ${Math.random() * 100}%;
                                    top: ${Math.random() * 100}%;
                                    background-color: ${['#ef4444', '#3b82f6', '#22c55e', '#eab308'][Math.floor(Math.random() * 4)]};
                                "></div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="max-w-6xl mx-auto">
                        <!-- Header -->
                        <div class="${cardClass} rounded-lg shadow-lg p-6 mb-6">
                            <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
                                <div class="flex items-center gap-3">
                                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                    </svg>
                                    <h1 class="text-2xl font-bold">Système TDAH - Apprentissage & Remédiation</h1>
                                </div>
                                <div class="flex items-center gap-4">
                                    <button onclick="toggleDarkMode()" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                                        ${state.darkMode ? '☀️' : '🌙'}
                                    </button>
                                    <button onclick="exportData()" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                                        💾
                                    </button>
                                </div>
                            </div>

                            <!-- XP Bar -->
                            <div class="mb-4">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-sm font-medium">Niveau ${getLevel()}</span>
                                    <span class="text-sm text-purple-600 font-bold">${state.totalXP} XP</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3">
                                    <div class="bg-purple-600 h-3 rounded-full transition-all" style="width: ${getXPProgress()}%"></div>
                                </div>
                            </div>

                            <!-- Stats Row -->
                            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                                <div class="text-center p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <div class="text-xs text-purple-600 dark:text-purple-300">Mémoire</div>
                                    <div class="text-xl font-bold text-purple-700 dark:text-purple-200">${state.cognitiveScores.workingMemory}%</div>
                                </div>
                                <div class="text-center p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <div class="text-xs text-blue-600 dark:text-blue-300">Exécutif</div>
                                    <div class="text-xl font-bold text-blue-700 dark:text-blue-200">${state.cognitiveScores.executive}%</div>
                                </div>
                                <div class="text-center p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <div class="text-xs text-green-600 dark:text-green-300">Inhibition</div>
                                    <div class="text-xl font-bold text-green-700 dark:text-green-200">${state.cognitiveScores.inhibition}%</div>
                                </div>
                                <div class="text-center p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <div class="text-xs text-yellow-600 dark:text-yellow-300">Spatial</div>
                                    <div class="text-xl font-bold text-yellow-700 dark:text-yellow-200">${state.cognitiveScores.spatial}%</div>
                                </div>
                                <div class="text-center p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <div class="text-xs text-orange-600 dark:text-orange-300">🔥 Streak</div>
                                    <div class="text-xl font-bold text-orange-700 dark:text-orange-200">${state.streak} jours</div>
                                </div>
                            </div>

                            <!-- Pomodoro -->
                            <div class="flex items-center justify-between p-4 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900 rounded-lg">
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl">⏱️</span>
                                    <div>
                                        <div class="text-sm font-medium">${state.pomodoroMode === 'work' ? '🎯 Travail' : '☕ Pause'}</div>
                                        <div class="text-2xl font-bold">${formatTime(state.pomodoroTime)}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm mr-2">🍅 ${state.pomodorosCompleted} aujourd'hui</span>
                                    <button onclick="${state.pomodoroActive ? 'pausePomodoro' : 'startPomodoro'}()" class="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                                        ${state.pomodoroActive ? '⏸️' : '▶️'}
                                    </button>
                                    <button onclick="resetPomodoro()" class="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                                        🔄
                                    </button>
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Mon objectif principal aujourd'hui..."
                                value="${state.dailyGoal}"
                                onchange="updateGoal(this.value)"
                                class="${state.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} w-full mt-4 p-3 border rounded-lg"
                            />
                        </div>

                        <!-- Tabs -->
                        <div class="${cardClass} rounded-lg shadow-lg mb-6">
                            <div class="flex border-b ${state.darkMode ? 'border-gray-700' : ''}">
                                ${['planning', 'cognitive', 'stats', 'strategies'].map(tab => `
                                    <button
                                        onclick="setTab('${tab}')"
                                        class="flex-1 py-3 px-4 font-medium transition-colors ${
                                            state.activeTab === tab
                                                ? 'border-b-2 border-purple-600 text-purple-600'
                                                : `${textClass} hover:text-gray-800 dark:hover:text-gray-200`
                                        }"
                                    >
                                        ${tab === 'planning' ? '📅 Planification' : 
                                          tab === 'cognitive' ? '🧠 Entraînement' : 
                                          tab === 'stats' ? '📊 Statistiques' : 
                                          '⚡ Stratégies'}
                                    </button>
                                `).join('')}
                            </div>

                            <div class="p-6">
                                ${renderTabContent(cardClass, textClass)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderTabContent(cardClass, textClass) {
            if (state.activeTab === 'planning') {
                return `
                    <div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Domaine d'apprentissage:</label>
                            <select
                                onchange="changeDomain(this.value)"
                                class="${state.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} p-2 border rounded-lg"
                            >
                                <option value="frontend" ${state.selectedDomain === 'frontend' ? 'selected' : ''}>🎨 Frontend</option>
                                <option value="backend" ${state.selectedDomain === 'backend' ? 'selected' : ''}>⚙️ Backend</option>
                                <option value="data" ${state.selectedDomain === 'data' ? 'selected' : ''}>📊 Data Science</option>
                            </select>
                        </div>

                        <h2 class="text-xl font-bold mb-3">Mes Tâches Actives</h2>
                        ${state.tasks.length === 0 ? `
                            <div class="text-center py-8 text-gray-500">
                                <p>Aucune tâche active. Ajoutez-en une ci-dessous !</p>
                            </div>
                        ` : state.tasks.map(task => `
                            <div class="${state.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 mb-4">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="px-2 py-1 rounded text-xs font-medium bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200">
                                                ${task.category}
                                            </span>
                                            <h3 class="font-bold">${task.title}</h3>
                                            <span class="text-sm text-gray-500">(${task.time}min)</span>
                                        </div>
                                        <div class="space-y-2">
                                            ${task.subtasks.map((subtask, idx) => `
                                                <div class="flex items-center gap-2">
                                                    <button onclick="toggleSubtask(${task.id}, ${idx})">
                                                        <span class="${task.subtasksCompleted[idx] ? 'text-green-600' : 'text-gray-400'} text-xl">
                                                            ${task.subtasksCompleted[idx] ? '✓' : '○'}
                                                        </span>
                                                    </button>
                                                    <span class="${task.subtasksCompleted[idx] ? 'line-through text-gray-500' : ''}">
                                                        ${subtask}
                                                    </span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                    <button onclick="removeTask(${task.id})" class="text-red-500 hover:text-red-700 ml-4">
                                        Retirer
                                    </button>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                    <div class="bg-purple-600 h-2 rounded-full transition-all" 
                                         style="width: ${(task.subtasksCompleted.filter(Boolean).length / task.subtasks.length) * 100}%"></div>
                                </div>
                            </div>
                        `).join('')}

                        <h2 class="text-xl font-bold mb-3 mt-6">Parcours Suggéré</h2>
                        <div class="grid md:grid-cols-2 gap-3">
                            ${domainTasks[state.selectedDomain].map((task, idx) => `
                                <div class="${state.darkMode ? 'border-gray-600' : 'border-gray-200'} border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div class="flex justify-between items-start">
                                        <div class="flex-1">
                                            <span class="px-2 py-1 rounded text-xs font-medium bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 mb-2 inline-block">
                                                ${task.category}
                                            </span>
                                            <h3 class="font-bold">${task.title}</h3>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">Durée: ${task.time}min</p>
                                            <p class="text-xs text-gray-500 mt-1">${task.subtasks.length} étapes</p>
                                        </div>
                                        <button
                                            onclick='addTaskFromTemplate(${JSON.stringify(task).replace(/'/g, "\\'")});'
                                            class="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else if (state.activeTab === 'cognitive') {
                return `
                    <div class="space-y-6">
                        <!-- N-Back -->
                        <div class="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg p-6">
                            <h3 class="font-bold text-lg mb-2">N-Back Task (Niveau ${state.nBackGame.level})</h3>
                            <p class="text-sm mb-4">Cliquez sur "Oui" si la lettre actuelle = celle d'il y a ${state.nBackGame.level} position(s)</p>
                            
                            ${!state.nBackGame.active && state.nBackGame.sequence.length === 0 ? `
                                <div class="text-center">
                                    <div class="mb-4">
                                        <label class="block text-sm font-medium mb-2">Niveau:</label>
                                        <select
                                            onchange="changeNBackLevel(parseInt(this.value))"
                                            class="${state.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} p-2 border rounded-lg"
                                        >
                                            <option value="1" ${state.nBackGame.level === 1 ? 'selected' : ''}>1-Back (Facile)</option>
                                            <option value="2" ${state.nBackGame.level === 2 ? 'selected' : ''}>2-Back (Moyen)</option>
                                            <option value="3" ${state.nBackGame.level === 3 ? 'selected' : ''}>3-Back (Difficile)</option>
                                        </select>
                                    </div>
                                    <button onclick="startNBack()" class="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700">
                                        ▶ Commencer
                                    </button>
                                </div>
                            ` : state.nBackGame.active ? `
                                <div class="text-center">
                                    <div class="text-6xl font-bold text-purple-700 dark:text-purple-300 mb-6 h-20 flex items-center justify-center">
                                        ${state.nBackGame.sequence[state.nBackGame.index]}
                                    </div>
                                    <div class="text-sm mb-4">
                                        Position: ${state.nBackGame.index + 1} / ${state.nBackGame.sequence.length}
                                    </div>
                                    <div class="flex gap-4 justify-center mb-4">
                                        <button onclick="checkNBack(true)" class="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700">
                                            OUI - Identique
                                        </button>
                                        <button onclick="checkNBack(false)" class="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700">
                                            NON - Différent
                                        </button>
                                    </div>
                                    ${state.nBackGame.feedback ? `
                                        <div class="text-lg font-bold ${state.nBackGame.feedback.includes('✓') ? 'text-green-600' : 'text-red-600'}">
                                            ${state.nBackGame.feedback}
                                        </div>
                                    ` : ''}
                                    <div class="text-sm mt-4">Score: ${state.nBackGame.score}</div>
                                </div>
                            ` : `
                                <div class="text-center">
                                    <div class="text-lg mb-4">${state.nBackGame.feedback}</div>
                                    <button onclick="resetNBack()" class="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700">
                                        🔄 Recommencer
                                    </button>
                                </div>
                            `}
                        </div>

                        <!-- Stroop Test -->
                        <div class="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 rounded-lg p-6">
                            <h3 class="font-bold text-lg mb-2">Test de Stroop (Inhibition)</h3>
                            <p class="text-sm mb-4">Cliquez sur la COULEUR du texte, pas le mot !</p>
                            
                            ${!state.stroopGame.active && state.stroopGame.total === 0 ? `
                                <div class="text-center">
                                    <button onclick="startStroop()" class="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700">
                                        ▶ Commencer
                                    </button>
                                </div>
                            ` : state.stroopGame.active ? `
                                <div class="text-center">
                                    <div class="text-6xl font-bold mb-6 h-20 flex items-center justify-center" style="color: ${state.stroopGame.color}">
                                        ${state.stroopGame.word}
                                    </div>
                                    <div class="text-sm mb-4">Question ${state.stroopGame.total + 1} / 10</div>
                                    <div class="grid grid-cols-2 gap-4 max-w-md mx-auto mb-4">
                                        <button onclick="checkStroop('ROUGE')" class="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600">
                                            ROUGE
                                        </button>
                                        <button onclick="checkStroop('BLEU')" class="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600">
                                            BLEU
                                        </button>
                                        <button onclick="checkStroop('VERT')" class="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600">
                                            VERT
                                        </button>
                                        <button onclick="checkStroop('JAUNE')" class="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600">
                                            JAUNE
                                        </button>
                                    </div>
                                    ${state.stroopGame.feedback ? `
                                        <div class="text-2xl font-bold ${state.stroopGame.feedback === '✓' ? 'text-green-600' : 'text-red-600'}">
                                            ${state.stroopGame.feedback}
                                        </div>
                                    ` : ''}
                                    <div class="text-sm mt-4">Score: ${state.stroopGame.score}</div>
                                </div>
                            ` : `
                                <div class="text-center">
                                    <div class="text-lg mb-4">${state.stroopGame.feedback}</div>
                                    <button onclick="resetStroop()" class="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700">
                                        🔄 Recommencer
                                    </button>
                                </div>
                            `}
                        </div>

                        <!-- Sequence Game -->
                        <div class="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg p-6">
                            <h3 class="font-bold text-lg mb-2">Séquence Visuelle (Niveau ${state.sequenceGame.level})</h3>
                            <p class="text-sm mb-4">Mémorisez la séquence puis reproduisez-la !</p>
                            
                            ${!state.sequenceGame.active ? `
                                <div class="text-center">
                                    <div class="mb-4">
                                        <label class="block text-sm font-medium mb-2">Longueur:</label>
                                        <select
                                            onchange="changeSequenceLevel(parseInt(this.value))"
                                            class="${state.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} p-2 border rounded-lg"
                                        >
                                            <option value="3" ${state.sequenceGame.level === 3 ? 'selected' : ''}>3 cases</option>
                                            <option value="4" ${state.sequenceGame.level === 4 ? 'selected' : ''}>4 cases</option>
                                            <option value="5" ${state.sequenceGame.level === 5 ? 'selected' : ''}>5 cases</option>
                                            <option value="6" ${state.sequenceGame.level === 6 ? 'selected' : ''}>6 cases</option>
                                        </select>
                                    </div>
                                    ${state.sequenceGame.feedback ? `
                                        <div class="text-lg mb-4 font-bold ${state.sequenceGame.feedback.includes('✓') ? 'text-green-600' : 'text-orange-600'}">
                                            ${state.sequenceGame.feedback}
                                        </div>
                                    ` : ''}
                                    <button onclick="startSequence()" class="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700">
                                        ▶ ${state.sequenceGame.score > 0 ? 'Continuer' : 'Commencer'}
                                    </button>
                                    ${state.sequenceGame.score > 0 ? `
                                        <button onclick="resetSequence()" class="ml-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700">
                                            🔄 Recommencer
                                        </button>
                                    ` : ''}
                                </div>
                            ` : `
                                <div class="text-center">
                                    <div class="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
                                        ${Array.from({ length: 9 }).map((_, i) => `
                                            <button
                                                onclick="${state.sequenceGame.showing ? '' : `clickSequence(${i})`}"
                                                class="h-20 rounded-lg font-bold text-2xl transition-all ${
                                                    state.sequenceGame.currentFlash === i
                                                        ? 'bg-yellow-400 scale-110'
                                                        : state.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                                                } ${state.sequenceGame.showing ? 'cursor-default' : 'cursor-pointer'}"
                                            >
                                                ${state.sequenceGame.userSequence.includes(i) ? '✓' : ''}
                                            </button>
                                        `).join('')}
                                    </div>
                                    <div class="text-sm mb-2">
                                        ${state.sequenceGame.showing ? '👀 Mémorisez...' : '🖱️ Votre tour !'}
                                    </div>
                                    <div class="text-sm">Score: ${state.sequenceGame.score}</div>
                                    ${state.sequenceGame.feedback ? `
                                        <div class="text-lg font-bold text-green-600 mt-2">
                                            ${state.sequenceGame.feedback}
                                        </div>
                                    ` : ''}
                                </div>
                            `}
                        </div>

                        <div class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                            <h4 class="font-bold text-yellow-800 dark:text-yellow-200 mb-2">💡 Conseil</h4>
                            <p class="text-sm text-yellow-700 dark:text-yellow-300">
                                Pratiquez 10-15 minutes par jour pour de meilleurs résultats. L'entraînement régulier améliore la neuroplasticité !
                            </p>
                        </div>
                    </div>
                `;
            } else if (state.activeTab === 'stats') {
                return `
                    <div class="space-y-6">
                        <h2 class="text-2xl font-bold mb-4">📊 Vos Statistiques</h2>
                        
                        <div class="grid md:grid-cols-2 gap-6">
                            <!-- Progression Cognitive -->
                            <div class="${state.darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6">
                                <h3 class="font-bold text-lg mb-4">Progression Cognitive</h3>
                                <div class="space-y-3">
                                    <div>
                                        <div class="flex justify-between mb-1">
                                            <span class="text-sm">Mémoire de Travail</span>
                                            <span class="text-sm font-bold text-purple-600">${state.cognitiveScores.workingMemory}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div class="bg-purple-600 h-2 rounded-full" style="width: ${state.cognitiveScores.workingMemory}%"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between mb-1">
                                            <span class="text-sm">Fonctions Exécutives</span>
                                            <span class="text-sm font-bold text-blue-600">${state.cognitiveScores.executive}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${state.cognitiveScores.executive}%"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between mb-1">
                                            <span class="text-sm">Inhibition (Stroop)</span>
                                            <span class="text-sm font-bold text-green-600">${state.cognitiveScores.inhibition}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: ${state.cognitiveScores.inhibition}%"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between mb-1">
                                            <span class="text-sm">Mémoire Spatiale</span>
                                            <span class="text-sm font-bold text-yellow-600">${state.cognitiveScores.spatial}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div class="bg-yellow-600 h-2 rounded-full" style="width: ${state.cognitiveScores.spatial}%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Activité -->
                            <div class="${state.darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6">
                                <h3 class="font-bold text-lg mb-4">Activité</h3>
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                        <div class="flex items-center gap-3">
                                            <span class="text-2xl">🏆</span>
                                            <div>
                                                <div class="text-sm text-gray-600 dark:text-gray-300">Niveau</div>
                                                <div class="font-bold text-xl">${getLevel()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                        <div class="flex items-center gap-3">
                                            <span class="text-2xl">🔥</span>
                                            <div>
                                                <div class="text-sm text-gray-600 dark:text-gray-300">Streak</div>
                                                <div class="font-bold text-xl">${state.streak} jours</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                                        <div class="flex items-center gap-3">
                                            <span class="text-2xl">🍅</span>
                                            <div>
                                                <div class="text-sm text-gray-600 dark:text-gray-300">Pomodoros</div>
                                                <div class="font-bold text-xl">${state.pomodorosCompleted} aujourd'hui</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <div class="flex items-center gap-3">
                                            <span class="text-2xl">✓</span>
                                            <div>
                                                <div class="text-sm text-gray-600 dark:text-gray-300">Tâches complétées</div>
                                                <div class="font-bold text-xl">${state.tasks.filter(t => t.completed).length} / ${state.tasks.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg p-6">
                            <h3 class="font-bold text-lg mb-2">🎯 Objectifs Recommandés</h3>
                            <ul class="space-y-2 text-sm">
                                <li>✓ Complétez au moins 1 exercice cognitif par jour</li>
                                <li>✓ Faites au moins 2 Pomodoros de travail focalisé</li>
                                <li>✓ Terminez au moins 1 tâche complète par jour</li>
                                <li>✓ Maintenez un streak de 7 jours consécutifs</li>
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="space-y-6">
                        <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                            <h3 class="font-bold text-lg text-blue-800 dark:text-blue-200 mb-3">🎯 Stratégies pour la Mémoire de Travail</h3>
                            <ul class="space-y-2 text-sm text-blue-900 dark:text-blue-100">
                                <li><strong>Chunking:</strong> Regroupez l'information par paquets (ex: 06-12-34-56-78 plutôt que 0612345678)</li>
                                <li><strong>Externalisation:</strong> Notez TOUT immédiatement. Votre cerveau n'est pas fait pour tout retenir.</li>
                                <li><strong>Répétition espacée:</strong> Révisez l'info après 1h, 1 jour, 1 semaine pour ancrer dans la mémoire longue</li>
                                <li><strong>Association visuelle:</strong> Créez des images mentales pour les concepts abstraits</li>
                            </ul>
                        </div>

                        <div class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6">
                            <h3 class="font-bold text-lg text-green-800 dark:text-green-200 mb-3">⚡ Stratégies pour les Fonctions Exécutives</h3>
                            <ul class="space-y-2 text-sm text-green-900 dark:text-green-100">
                                <li><strong>Règle des 2 minutes:</strong> Si ça prend moins de 2min, faites-le immédiatement</li>
                                <li><strong>Timeboxing:</strong> Fixez une durée précise (25min) puis pause obligatoire</li>
                                <li><strong>Micro-objectifs:</strong> Découpez TOUT en étapes de 5-15min maximum</li>
                                <li><strong>Environnement contrôlé:</strong> Éliminez les distractions avant de commencer (téléphone, notifs...)</li>
                                <li><strong>Routine de démarrage:</strong> Créez un rituel pour "lancer" votre cerveau (musique, café, timer...)</li>
                            </ul>
                        </div>

                        <div class="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg p-6">
                            <h3 class="font-bold text-lg text-purple-800 dark:text-purple-200 mb-3">🧠 Spécial Développement</h3>
                            <ul class="space-y-2 text-sm text-purple-900 dark:text-purple-100">
                                <li><strong>Un concept à la fois:</strong> Ne mélangez pas HTML/CSS/JS dans la même session au début</li>
                                <li><strong>Projet fil rouge:</strong> Construisez le même site en ajoutant progressivement des features</li>
                                <li><strong>Documentation ouverte:</strong> Consultez MDN/docs en permanence sans honte</li>
                                <li><strong>Copy-paste intelligent:</strong> Copiez du code, mais retapez-le à la main après pour comprendre</li>
                                <li><strong>Célébrez chaque micro-victoire:</strong> Un bouton qui fonctionne = VICTOIRE. Reconnaissez-le.</li>
                            </ul>
                        </div>

                        <div class="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-6">
                            <h3 class="font-bold text-lg text-orange-800 dark:text-orange-200 mb-3">⏰ Gestion du Temps & Énergie</h3>
                            <ul class="space-y-2 text-sm text-orange-900 dark:text-orange-100">
                                <li><strong>Identifiez votre pic d'énergie:</strong> Codez pendant vos moments de meilleure concentration</li>
                                <li><strong>Acceptez les jours "off":</strong> Certains jours, vous ne coderez que 15min. C'est OK.</li>
                                <li><strong>Système de points:</strong> Chaque micro-tâche = points. Gamifiez votre progression.</li>
                                <li><strong>Pause obligatoire:</strong> Toutes les 25-30min, levez-vous 5min. Non négociable.</li>
                            </ul>
                        </div>
                    </div>
                `