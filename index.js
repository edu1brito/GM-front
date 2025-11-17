// Global variables
let selectedGender = '';
let dietData = {
    personal: {},
    meals: {
        cafe: [],
        'lanche-manha': [],
        almoco: [],
        'lanche-tarde': [],
        jantar: []
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMealSections();
    initializePersonalDataForm();
    updateMainProgress();
    initializeSmoothScroll();
    initializeScrollEffects();
});

// Gender selection
function selectGender(gender) {
    selectedGender = gender;
    const btnMasc = document.getElementById('btnMasculino');
    const btnFem = document.getElementById('btnFeminino');
    
    // Reset both buttons
    btnMasc.className = 'flex-1 py-4 rounded-xl text-white text-xl font-semibold bg-gray-400 hover:bg-blue-500 transition-all';
    btnFem.className = 'flex-1 py-4 rounded-xl text-white text-xl font-semibold bg-gray-400 hover:bg-pink-500 transition-all';
    
    // Highlight selected
    if (gender === 'masculino') {
        btnMasc.className = 'flex-1 py-4 rounded-xl text-white text-xl font-semibold bg-blue-500 hover:bg-blue-600 transition-all selected';
    } else {
        btnFem.className = 'flex-1 py-4 rounded-xl text-white text-xl font-semibold bg-pink-500 hover:bg-pink-600 transition-all selected';
    }
    
    dietData.personal.gender = gender;
    updateMainProgress();
}

// Initialize meal sections
function initializeMealSections() {
    document.querySelectorAll('.meal-section').forEach(section => {
        const mealType = section.dataset.meal;
        const items = section.querySelectorAll('.meal-item');
        const progress = section.querySelector('.meal-progress');
        const counter = section.querySelector('.meal-counter');
        
        // Add click event to each meal item
        items.forEach(item => {
            item.addEventListener('click', function() {
                const foodName = this.textContent;
                
                if (this.classList.contains('selected')) {
                    // Deselect
                    this.classList.remove('selected');
                    
                    // Remove from array
                    const index = dietData.meals[mealType].indexOf(foodName);
                    if (index > -1) dietData.meals[mealType].splice(index, 1);
                } else {
                    // Select
                    this.classList.add('selected');
                    
                    // Add to array
                    if (!dietData.meals[mealType].includes(foodName)) {
                        dietData.meals[mealType].push(foodName);
                    }
                }
                
                updateMealProgress(section, mealType);
                updateMainProgress();
            });
        });
    });
}

// Update meal progress
function updateMealProgress(section, mealType) {
    const selectedItems = section.querySelectorAll('.meal-item.selected');
    const totalItems = section.querySelectorAll('.meal-item');
    const progress = section.querySelector('.meal-progress');
    const counter = section.querySelector('.meal-counter');
    
    const selectedCount = selectedItems.length;
    const totalCount = totalItems.length;
    const percentage = (selectedCount / totalCount) * 100;
    
    progress.style.width = percentage + '%';
    counter.textContent = `${selectedCount} selecionados`;
}

// Initialize personal data form
function initializePersonalDataForm() {
    const formInputs = document.querySelectorAll('#personalDataForm input, #personalDataForm select');
    
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            dietData.personal[this.id] = this.value;
            updateMainProgress();
        });
        
        input.addEventListener('input', function() {
            dietData.personal[this.id] = this.value;
            updateMainProgress();
        });
    });
}

// Update main progress
function updateMainProgress() {
    const formFields = document.querySelectorAll('#personalDataForm input, #personalDataForm select');
    let filledFields = 0;
    
    formFields.forEach(field => {
        if (field.value.trim() !== '') filledFields++;
    });
    
    if (selectedGender) filledFields++;
    
    const totalMealsWithSelections = Object.values(dietData.meals).filter(meal => meal.length > 0).length;
    
    const totalFields = formFields.length + 1; // +1 for gender
    const totalMeals = 5;
    
    const formProgress = (filledFields / totalFields) * 50; // 50% weight for form
    const mealProgress = (totalMealsWithSelections / totalMeals) * 50; // 50% weight for meals
    
    const totalProgress = formProgress + mealProgress;
    
    document.getElementById('mainProgress').style.width = totalProgress + '%';
    
    // Enable/disable generate button
    const generateBtn = document.getElementById('generateDiet');
    if (totalProgress >= 80) {
        generateBtn.disabled = false;
        generateBtn.onclick = generateDiet;
        generateBtn.classList.remove('disabled');
    } else {
        generateBtn.disabled = true;
        generateBtn.onclick = null;
        generateBtn.classList.add('disabled');
    }
}

// Generate diet
function generateDiet() {
    // Verificar dados antes de gerar
    console.log('Iniciando validação...');
    
    if (!validateData()) {
        // Verificar especificamente qual é o problema
        const requiredFields = ['peso', 'altura', 'idade', 'objetivo', 'calorias', 'horarios'];
        let missingFields = [];
        let mealIssues = [];
        
        // Verificar campos pessoais
        for (let field of requiredFields) {
            if (!dietData.personal[field] || dietData.personal[field].toString().trim() === '') {
                missingFields.push(field);
            }
        }
        
        // Verificar gênero
        if (!selectedGender) {
            missingFields.push('gênero');
        }
        
        // Verificar refeições
        const mealNames = {
            'cafe': 'Café da Manhã',
            'lanche-manha': 'Lanche da Manhã',
            'almoco': 'Almoço',
            'lanche-tarde': 'Lanche da Tarde',
            'jantar': 'Jantar'
        };
        
        for (let mealType in mealNames) {
            if (!dietData.meals[mealType] || dietData.meals[mealType].length < 2) {
                mealIssues.push(`${mealNames[mealType]} (${dietData.meals[mealType] ? dietData.meals[mealType].length : 0} selecionados)`);
            }
        }
        
        // Criar mensagem de erro específica
        let errorMessage = 'Para gerar sua dieta, você precisa:\n\n';
        
        if (missingFields.length > 0) {
            errorMessage += `✅ Preencher os campos: ${missingFields.join(', ')}\n\n`;
        }
        
        if (mealIssues.length > 0) {
            errorMessage += `🍽️ Selecionar pelo menos 2 itens em cada refeição:\n${mealIssues.map(meal => `   • ${meal}`).join('\n')}`;
        }
        
        alert(errorMessage);
        return;
    }
    
    // Add loading effect
    const generateBtn = document.getElementById('generateDiet');
    generateBtn.innerHTML = '🔄 Gerando sua dieta...';
    generateBtn.classList.add('loading');
    
    // Simulate processing time
    setTimeout(() => {
        const results = createDietPlan();
        displayResults(results);
        
        // Reset button
        generateBtn.innerHTML = '🎯 Gerar Minha Dieta Personalizada';
        generateBtn.classList.remove('loading');
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }, 1500);
}

// Validate data
function validateData() {
    const requiredFields = ['peso', 'altura', 'idade', 'objetivo', 'calorias', 'horarios'];
    
    // Verificar campos obrigatórios do formulário
    for (let field of requiredFields) {
        if (!dietData.personal[field] || dietData.personal[field].toString().trim() === '') {
            console.log(`Campo obrigatório vazio: ${field}`);
            return false;
        }
    }
    
    // Verificar se gênero foi selecionado
    if (!selectedGender) {
        console.log('Gênero não selecionado');
        return false;
    }
    
    // Verificar se cada refeição tem pelo menos 2 seleções
    const mealTypes = ['cafe', 'lanche-manha', 'almoco', 'lanche-tarde', 'jantar'];
    
    for (let mealType of mealTypes) {
        if (!dietData.meals[mealType] || dietData.meals[mealType].length < 2) {
            console.log(`Refeição ${mealType} tem menos de 2 itens selecionados:`, dietData.meals[mealType]);
            return false;
        }
    }
    
    console.log('Validação passou! Dados válidos:', {
        personal: dietData.personal,
        meals: dietData.meals,
        gender: selectedGender
    });
    
    return true;
}

// Create diet plan
function createDietPlan() {
    const { peso, altura, idade, objetivo, calorias } = dietData.personal;
    const gender = selectedGender;
    
    // Calculate BMR (Basal Metabolic Rate) using Harris-Benedict equation
    let bmr;
    if (gender === 'masculino') {
        bmr = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
    } else {
        bmr = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    // Activity factor (assuming moderate activity)
    const tdee = bmr * 1.55;
    
    // Adjust calories based on objective
    let targetCalories;
    switch(objetivo) {
        case 'emagrecer':
            targetCalories = tdee - 500;
            break;
        case 'emagrecer-massa':
            targetCalories = tdee - 300;
            break;
        case 'definicao-massa':
            targetCalories = tdee;
            break;
        case 'ganhar-massa':
            targetCalories = tdee + 300;
            break;
        default:
            targetCalories = tdee;
    }
    
    // Use user's calorie preference if provided
    if (calorias !== 'nao-sei') {
        targetCalories = parseInt(calorias);
    }
    
    const mealPlan = createMealPlan(targetCalories);
    
    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        mealPlan: mealPlan,
        personalInfo: dietData.personal,
        gender: gender
    };
}

// Create meal plan
function createMealPlan(targetCalories) {
    const mealDistribution = {
        'cafe': 0.25,           // 25% - Café da manhã
        'lanche-manha': 0.15,   // 15% - Lanche da manhã
        'almoco': 0.35,         // 35% - Almoço
        'lanche-tarde': 0.15,   // 15% - Lanche da tarde
        'jantar': 0.30          // 30% - Jantar (reduzido para ser mais leve)
    };
    
    const mealNames = {
        'cafe': 'Café da Manhã',
        'lanche-manha': 'Lanche da Manhã',
        'almoco': 'Almoço',
        'lanche-tarde': 'Lanche da Tarde',
        'jantar': 'Jantar'
    };
    
    const plan = {};
    
    for (let mealType in dietData.meals) {
        const mealCalories = Math.round(targetCalories * mealDistribution[mealType]);
        const selectedFoods = dietData.meals[mealType];
        
        // Select 3-4 foods randomly from user's selections
        const numFoods = Math.min(4, Math.max(3, selectedFoods.length));
        const shuffled = [...selectedFoods].sort(() => 0.5 - Math.random());
        const chosenFoods = shuffled.slice(0, numFoods);
        
        plan[mealType] = {
            name: mealNames[mealType],
            calories: mealCalories,
            foods: chosenFoods,
            suggestions: generateMealSuggestions(mealType, chosenFoods),
            macros: calculateMacros(mealCalories, mealType)
        };
    }
    
    return plan;
}

// Calculate macros for each meal
function calculateMacros(calories, mealType) {
    let proteinPercent, carbPercent, fatPercent;
    
    // Adjust macros based on meal type
    switch(mealType) {
        case 'cafe':
            proteinPercent = 0.25;
            carbPercent = 0.50;
            fatPercent = 0.25;
            break;
        case 'lanche-manha':
            proteinPercent = 0.30;
            carbPercent = 0.45;
            fatPercent = 0.25;
            break;
        case 'almoco':
            proteinPercent = 0.30;
            carbPercent = 0.45;
            fatPercent = 0.25;
            break;
        case 'lanche-tarde':
            proteinPercent = 0.35;
            carbPercent = 0.40;
            fatPercent = 0.25;
            break;
        case 'jantar':
            proteinPercent = 0.40;
            carbPercent = 0.30;
            fatPercent = 0.30;
            break;
        default:
            proteinPercent = 0.30;
            carbPercent = 0.40;
            fatPercent = 0.30;
    }
    
    return {
        protein: Math.round((calories * proteinPercent) / 4), // 4 kcal per gram
        carbs: Math.round((calories * carbPercent) / 4),     // 4 kcal per gram
        fats: Math.round((calories * fatPercent) / 9)        // 9 kcal per gram
    };
}

// Generate meal suggestions with portions
function generateMealSuggestions(mealType, foods) {
    const suggestions = {
        'cafe': [
            '1 xícara de café com leite desnatado (150ml)',
            '2 fatias de pão integral ou tapioca',
            '1 ovo mexido ou queijo branco (30g)',
            '1 fruta média (banana, maçã ou mamão)',
            '1 colher de sopa de aveia (opcional)'
        ],
        'lanche-manha': [
            '1 dose de whey protein (30g) ou iogurte natural',
            '1 banana média ou maçã',
            '1 punhado pequeno de castanhas (10-15 unidades)',
            '200ml de água ou chá verde'
        ],
        'almoco': [
            '150-200g de proteína magra (frango, carne ou peixe)',
            '4-5 colheres de arroz integral ou batata doce',
            '2 colheres de feijão ou lentilha',
            'Salada verde à vontade com azeite (1 colher)',
            'Legumes refogados (cenoura, abobrinha)'
        ],
        'lanche-tarde': [
            '1 iogurte natural ou whey protein',
            '1 fruta ou tapioca pequena',
            '1 fatia de pão integral com queijo',
            '200ml de água ou suco natural'
        ],
        'jantar': [
            '120-150g de proteína magra grelhada',
            'Salada completa com folhas verdes',
            'Legumes cozidos ou refogados',
            '1 batata doce pequena (opcional)',
            'Chá digestivo após a refeição'
        ]
    };
    
    return suggestions[mealType] || [];
}

// Display results
function displayResults(results) {
    const resultsSection = document.getElementById('results');
    const resultsDiv = document.getElementById('dietResults');
    
    let html = `
        <div class="bg-gradient-to-r from-blue-500 to-green-500 text-white p-8 rounded-2xl mb-8">
            <h3 class="text-2xl font-bold mb-6 text-center">📊 Seus Dados Calculados</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center bg-white/10 p-4 rounded-xl">
                    <p class="text-3xl font-bold mb-1">${results.bmr}</p>
                    <p class="text-sm opacity-90">Metabolismo Basal (kcal/dia)</p>
                </div>
                <div class="text-center bg-white/10 p-4 rounded-xl">
                    <p class="text-3xl font-bold mb-1">${results.tdee}</p>
                    <p class="text-sm opacity-90">Gasto Total Diário (kcal/dia)</p>
                </div>
                <div class="text-center bg-white/10 p-4 rounded-xl">
                    <p class="text-3xl font-bold mb-1">${results.targetCalories}</p>
                    <p class="text-sm opacity-90">Meta Calórica (kcal/dia)</p>
                </div>
            </div>
            <div class="mt-6 text-center">
                <p class="text-lg">Objetivo: <strong>${getObjetivoText(results.personalInfo.objetivo)}</strong></p>
                <p class="text-sm opacity-90 mt-1">Plano calculado especialmente para ${results.gender === 'masculino' ? 'você' : 'você'}</p>
            </div>
        </div>
    `;
    
    for (let mealType in results.mealPlan) {
        const meal = results.mealPlan[mealType];
        const mealIcons = {
            'cafe': '☀️',
            'lanche-manha': '🍏',
            'almoco': '🍴',
            'lanche-tarde': '🌅',
            'jantar': '🌙'
        };
        
        const mealColors = {
            'cafe': 'from-orange-400 to-orange-600',
            'lanche-manha': 'from-green-400 to-green-600',
            'almoco': 'from-blue-400 to-blue-600',
            'lanche-tarde': 'from-purple-400 to-purple-600',
            'jantar': 'from-indigo-400 to-indigo-600'
        };
        
        html += `
            <div class="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-6 hover:shadow-lg transition-all">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-2xl font-bold">${mealIcons[mealType]} ${meal.name}</h4>
                    <div class="text-right">
                        <p class="text-2xl font-bold text-gray-800">${meal.calories} kcal</p>
                        <p class="text-sm text-gray-600">Meta energética</p>
                    </div>
                </div>
                
                <!-- Macros -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-red-50 p-3 rounded-lg text-center">
                        <p class="text-lg font-bold text-red-600">${meal.macros.protein}g</p>
                        <p class="text-xs text-red-500">Proteínas</p>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded-lg text-center">
                        <p class="text-lg font-bold text-yellow-600">${meal.macros.carbs}g</p>
                        <p class="text-xs text-yellow-500">Carboidratos</p>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg text-center">
                        <p class="text-lg font-bold text-blue-600">${meal.macros.fats}g</p>
                        <p class="text-xs text-blue-500">Gorduras</p>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-semibold mb-3 text-lg">✅ Seus alimentos preferidos:</h5>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${meal.foods.map(food => `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">${food}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h5 class="font-semibold mb-3 text-lg">📏 Sugestão de porções:</h5>
                        <ul class="space-y-2">
                            ${meal.suggestions.map(suggestion => `
                                <li class="flex items-start">
                                    <span class="text-green-500 mr-2">•</span>
                                    <span class="text-gray-700 text-sm">${suggestion}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Add schedule section
    const horarios = dietData.personal.horarios.split(',');
    if (horarios.length > 0) {
        html += `
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-2xl">
                <h4 class="text-2xl font-bold mb-6 text-center">⏰ Seus Horários de Refeição</h4>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    ${Object.keys(results.mealPlan).map((mealType, index) => `
                        <div class="text-center bg-white/10 p-4 rounded-xl">
                            <p class="font-semibold mb-2">${results.mealPlan[mealType].name}</p>
                            <p class="text-2xl font-bold">${horarios[index] || 'N/A'}</p>
                            <p class="text-xs opacity-75 mt-1">${results.mealPlan[mealType].calories} kcal</p>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-6 text-center">
                    <p class="text-sm opacity-90">💡 Dica: Mantenha intervalos de 3-4 horas entre as refeições</p>
                </div>
            </div>
        `;
    }
    
    // Add tips section
    html += `
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl mt-6">
            <h4 class="text-lg font-bold text-yellow-800 mb-3">💡 Dicas Importantes:</h4>
            <ul class="text-yellow-700 space-y-2 text-sm">
                <li>• Beba pelo menos 2-3 litros de água durante o dia</li>
                <li>• Ajuste as porções conforme sua fome e saciedade</li>
                <li>• Pratique atividade física regularmente</li>
                <li>• Consulte um nutricionista para acompanhamento personalizado</li>
                <li>• Monitore seu peso e como se sente com a dieta</li>
            </ul>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
    resultsSection.classList.remove('hidden');
    
    // Add success pulse effect
    setTimeout(() => {
        resultsSection.classList.add('success-pulse');
    }, 500);
}

// Get objective text in Portuguese
function getObjetivoText(objetivo) {
    const objetivos = {
        'emagrecer': 'Emagrecer',
        'emagrecer-massa': 'Emagrecer + Ganhar Massa',
        'definicao-massa': 'Definição + Ganhar Massa',
        'ganhar-massa': 'Ganhar Massa Muscular'
    };
    return objetivos[objetivo] || objetivo;
}

// Download diet
function downloadDiet() {
    const resultsContent = document.getElementById('dietResults');
    const textContent = extractTextFromResults();
    
    const element = document.createElement('a');
    const file = new Blob([textContent], {type: 'text/plain; charset=utf-8'});
    
    element.href = URL.createObjectURL(file);
    element.download = 'minha-dieta-gymmind.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Extract text from results for download
function extractTextFromResults() {
    const results = document.getElementById('dietResults');
    let text = 'GYMMIND - SUA DIETA PERSONALIZADA\n';
    text += '==========================================\n\n';
    
    // Extract text content properly
    const sections = results.querySelectorAll('.bg-gray-50, .bg-gradient-to-r');
    sections.forEach(section => {
        const title = section.querySelector('h4');
        if (title) {
            text += title.textContent + '\n';
            text += '-'.repeat(title.textContent.length) + '\n';
        }
        
        const items = section.querySelectorAll('li, p, span');
        items.forEach(item => {
            if (item.textContent.trim() && 
                !item.querySelector('*') && 
                item.textContent.length > 3) {
                text += '• ' + item.textContent.trim() + '\n';
            }
        });
        text += '\n';
    });
    
    text += '\n==========================================\n';
    text += 'Gerado em: ' + new Date().toLocaleDateString('pt-BR') + '\n';
    text += 'Site: GymMind - O melhor site de dietas do Brasil\n';
    
    return text;
}

// Reset form
function resetForm() {
    // Reset all data
    selectedGender = '';
    dietData = {
        personal: {},
        meals: {
            cafe: [],
            'lanche-manha': [],
            almoco: [],
            'lanche-tarde': [],
            jantar: []
        }
    };
    
    // Reset form inputs
    document.getElementById('personalDataForm').reset();
    
    // Reset gender buttons
    document.getElementById('btnMasculino').className = 'flex-1 py-4 rounded-xl text-white text-xl font-semibold bg-gray-400 hover:bg-blue-500 transition-all';
    document.getElementById('btnFeminino').className = 'flex-1 py-4 rounded-xl text-white text-xl font-semibold bg-gray-400 hover:bg-pink-500 transition-all';
    
    // Reset meal selections
    document.querySelectorAll('.meal-item.selected').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Reset progress bars
    document.querySelectorAll('.meal-progress').forEach(progress => {
        progress.style.width = '0%';
    });
    
    document.querySelectorAll('.meal-counter').forEach(counter => {
        counter.textContent = '0 selecionados';
    });
    
    document.getElementById('mainProgress').style.width = '0%';
    
    // Reset generate button
    const generateBtn = document.getElementById('generateDiet');
    generateBtn.disabled = true;
    generateBtn.classList.add('disabled');
    
    // Hide results
    document.getElementById('results').classList.add('hidden');
    document.getElementById('results').classList.remove('success-pulse');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Initialize smooth scrolling for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('backdrop-blur-md');
            header.classList.remove('backdrop-blur-sm');
        } else {
            header.classList.add('backdrop-blur-sm');
            header.classList.remove('backdrop-blur-md');
        }
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.2s';
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    setTimeout(() => {
        document.querySelectorAll('.meal-section, .bg-white').forEach(section => {
            observer.observe(section);
        });
    }, 100);
}

// Utility function to format numbers
function formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to generate diet
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!document.getElementById('generateDiet').disabled) {
            generateDiet();
        }
    }
    
    // Escape to reset form
    if (e.key === 'Escape') {
        if (confirm('Deseja resetar o formulário?')) {
            resetForm();
        }
    }
});

// Add error handling
window.addEventListener('error', function(e) {
    console.error('Erro no GymMind:', e.error);
    // You could add user-friendly error reporting here
});

// Performance optimization - debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced version of updateMainProgress for better performance
const debouncedUpdateProgress = debounce(updateMainProgress, 300);