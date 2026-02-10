// Main Application Controller for NutriLog
// Manages state, UI updates, and user interactions

class NutriLogApp {
constructor() {
this.db = new NutriLogDB();
this.estimator = new NutritionEstimator();

```
// State
this.meals = [];
this.templates = [];
this.goals = { calories: 2500, protein: 175, fats: 117, carbs: 218 };
this.selectedDate = this.getTodayDate();
this.activeView = 'today';
this.editingMeal = null;
this.editingGoals = false;
this.showBackupReminder = false;

// UI elements (will be set after DOM loads)
this.elements = {};
```

}

async init() {
try {
// Initialize database
await this.db.init();
console.log(‘✅ Database ready’);

```
  // Load data
  await this.loadData();
  console.log('✅ Data loaded');

  // Setup UI
  this.setupUI();
  console.log('✅ UI initialized');

  // Setup event listeners
  this.setupEventListeners();
  console.log('✅ Event listeners ready');

  // Check backup reminder
  this.checkBackupReminder();

  // Initial render
  this.render();
  console.log('✅ App ready!');

} catch (error) {
  console.error('❌ Initialization error:', error);
  this.showError('Failed to initialize app: ' + error.message);
}
```

}

async loadData() {
// Load meals
this.meals = await this.db.getAllMeals();
console.log(`Loaded ${this.meals.length} meals`);

```
// Load templates
this.templates = await this.db.getAllTemplates();
console.log(`Loaded ${this.templates.length} templates`);

// Load goals
const savedGoals = await this.db.getSetting('goals');
if (savedGoals) {
  this.goals = savedGoals;
}
```

}

setupUI() {
// Cache DOM elements for performance
this.elements = {
// Views
todayView: document.getElementById(‘today-view’),
historyView: document.getElementById(‘history-view’),
comparisonView: document.getElementById(‘comparison-view’),

```
  // Navigation
  navToday: document.getElementById('nav-today'),
  navHistory: document.getElementById('nav-history'),
  navComparison: document.getElementById('nav-comparison'),

  // Today view elements
  goalCards: document.getElementById('goal-cards'),
  mealInput: document.getElementById('meal-input'),
  mealName: document.getElementById('meal-name'),
  dateInput: document.getElementById('date-input'),
  addMealBtn: document.getElementById('add-meal-btn'),
  saveTemplateBtn: document.getElementById('save-template-btn'),
  todayMealsList: document.getElementById('todays-meals-list'),
  progressBars: document.getElementById('progress-bars'),

  // Templates
  templatesContainer: document.getElementById('templates-container'),
  showTemplatesBtn: document.getElementById('show-templates-btn'),

  // Backup
  backupBtn: document.getElementById('backup-btn'),
  showBackupBtn: document.getElementById('show-backup-btn'),
  restoreBtn: document.getElementById('restore-btn'),
  backupModal: document.getElementById('backup-modal'),
  restoreModal: document.getElementById('restore-modal'),
  backupReminder: document.getElementById('backup-reminder'),

  // History
  historyMonthInput: document.getElementById('history-month'),
  historyMealsList: document.getElementById('history-meals-list'),

  // Comparison
  comparisonContent: document.getElementById('comparison-content')
};

// Set initial date
if (this.elements.dateInput) {
  this.elements.dateInput.value = this.selectedDate;
}
```

}

setupEventListeners() {
// Navigation
this.elements.navToday?.addEventListener(‘click’, () => this.switchView(‘today’));
this.elements.navHistory?.addEventListener(‘click’, () => this.switchView(‘history’));
this.elements.navComparison?.addEventListener(‘click’, () => this.switchView(‘comparison’));

```
// Add meal
this.elements.addMealBtn?.addEventListener('click', () => this.handleAddMeal());
this.elements.mealInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    this.handleAddMeal();
  }
});

// Save template
this.elements.saveTemplateBtn?.addEventListener('click', () => this.handleSaveTemplate());

// Date change
this.elements.dateInput?.addEventListener('change', (e) => {
  this.selectedDate = e.target.value;
  this.render();
});

// Backup/Restore
this.elements.backupBtn?.addEventListener('click', () => this.showBackupModal());
this.elements.showBackupBtn?.addEventListener('click', () => this.showBackupModal());
this.elements.restoreBtn?.addEventListener('click', () => this.showRestoreModal());

// History month change
this.elements.historyMonthInput?.addEventListener('change', (e) => {
  this.renderHistory(e.target.value);
});

// Close modals on outside click
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});
```

}

// Meal operations
async handleAddMeal() {
const description = this.elements.mealInput?.value.trim();
if (!description) {
alert(‘Please enter a meal description’);
return;
}

```
try {
  const nutrition = this.estimator.estimateNutrition(description);
  const customName = this.elements.mealName?.value.trim();

  const meal = {
    id: Date.now(),
    date: this.selectedDate,
    name: customName || nutrition.name,
    description: description,
    calories: nutrition.calories,
    protein: nutrition.protein,
    fats: nutrition.fats,
    carbs: nutrition.carbs,
    assumptions: nutrition.assumptions,
    components: nutrition.components,
    timestamp: new Date().toISOString()
  };

  await this.db.saveMeal(meal);
  this.meals.push(meal);

  // Clear inputs
  if (this.elements.mealInput) this.elements.mealInput.value = '';
  if (this.elements.mealName) this.elements.mealName.value = '';

  // Re-render
  this.render();

  console.log('✅ Meal added:', meal.name);

} catch (error) {
  console.error('Error adding meal:', error);
  alert('Failed to add meal: ' + error.message);
}
```

}

async handleSaveTemplate() {
const description = this.elements.mealInput?.value.trim();
if (!description) {
alert(‘Please enter a meal description’);
return;
}

```
const templateName = this.elements.mealName?.value.trim() || prompt('Enter a name for this saved meal:');
if (!templateName) return;

try {
  const nutrition = this.estimator.estimateNutrition(description);

  const template = {
    id: Date.now(),
    name: templateName,
    description: description,
    calories: nutrition.calories,
    protein: nutrition.protein,
    fats: nutrition.fats,
    carbs: nutrition.carbs
  };

  await this.db.saveTemplate(template);
  this.templates.push(template);

  // Clear inputs
  if (this.elements.mealInput) this.elements.mealInput.value = '';
  if (this.elements.mealName) this.elements.mealName.value = '';

  alert(`✅ Saved "${templateName}" to your meal templates!`);
  this.render();

} catch (error) {
  console.error('Error saving template:', error);
  alert('Failed to save template: ' + error.message);
}
```

}

async handleDeleteMeal(mealId) {
if (!confirm(‘Delete this meal entry?’)) return;

```
try {
  await this.db.deleteMeal(mealId);
  this.meals = this.meals.filter(m => m.id !== mealId);
  this.render();
  console.log('✅ Meal deleted');
} catch (error) {
  console.error('Error deleting meal:', error);
  alert('Failed to delete meal: ' + error.message);
}
```

}

async handleEditMeal(meal) {
this.editingMeal = {
…meal,
editCalories: meal.calories,
editProtein: meal.protein,
editFats: meal.fats,
editCarbs: meal.carbs,
editName: meal.name
};
this.render();
}

async handleSaveEdit() {
if (!this.editingMeal) return;

```
try {
  const updatedMeal = {
    ...this.meals.find(m => m.id === this.editingMeal.id),
    name: this.editingMeal.editName,
    calories: parseInt(this.editingMeal.editCalories) || 0,
    protein: parseInt(this.editingMeal.editProtein) || 0,
    fats: parseInt(this.editingMeal.editFats) || 0,
    carbs: parseInt(this.editingMeal.editCarbs) || 0
  };

  await this.db.saveMeal(updatedMeal);
  
  const index = this.meals.findIndex(m => m.id === this.editingMeal.id);
  if (index !== -1) {
    this.meals[index] = updatedMeal;
  }

  this.editingMeal = null;
  this.render();

} catch (error) {
  console.error('Error saving edit:', error);
  alert('Failed to save changes: ' + error.message);
}
```

}

async handleDeleteTemplate(templateId) {
try {
await this.db.deleteTemplate(templateId);
this.templates = this.templates.filter(t => t.id !== templateId);
this.render();
console.log(‘✅ Template deleted’);
} catch (error) {
console.error(‘Error deleting template:’, error);
alert(’Failed to delete template: ’ + error.message);
}
}

async handleAddFromTemplate(template) {
try {
const meal = {
id: Date.now(),
date: this.selectedDate,
name: template.name,
description: template.description,
calories: template.calories,
protein: template.protein,
fats: template.fats,
carbs: template.carbs,
timestamp: new Date().toISOString()
};

```
  await this.db.saveMeal(meal);
  this.meals.push(meal);
  this.render();

  console.log('✅ Added from template:', meal.name);

} catch (error) {
  console.error('Error adding from template:', error);
  alert('Failed to add meal: ' + error.message);
}
```

}

// Goals
async handleUpdateGoals(newGoals) {
try {
this.goals = newGoals;
await this.db.saveSetting(‘goals’, newGoals);
this.editingGoals = false;
this.render();
} catch (error) {
console.error(‘Error updating goals:’, error);
alert(’Failed to update goals: ’ + error.message);
}
}

// Backup/Restore
async showBackupModal() {
try {
const data = await this.db.exportAll();
const json = JSON.stringify(data, null, 2);

```
  const modal = this.elements.backupModal;
  if (!modal) return;

  const textarea = modal.querySelector('#backup-text');
  if (textarea) {
    textarea.value = json;
  }

  modal.style.display = 'flex';

  // Track backup time
  localStorage.setItem('last-backup-time', new Date().toISOString());
  this.showBackupReminder = false;

} catch (error) {
  console.error('Error creating backup:', error);
  alert('Failed to create backup: ' + error.message);
}
```

}

showRestoreModal() {
const modal = this.elements.restoreModal;
if (modal) {
modal.style.display = ‘flex’;
}
}

async handleRestore() {
const modal = this.elements.restoreModal;
if (!modal) return;

```
const textarea = modal.querySelector('#restore-text');
if (!textarea) return;

const input = textarea.value.trim();
if (!input) {
  alert('❌ Please paste your backup data first');
  return;
}

try {
  const data = JSON.parse(input);
  const result = await this.db.importAll(data);

  // Reload data
  await this.loadData();

  alert(`✅ Import successful!\n\nImported:\n• ${result.meals} meals\n• ${result.templates} templates`);

  modal.style.display = 'none';
  textarea.value = '';
  this.render();

} catch (error) {
  console.error('Error restoring:', error);
  alert('❌ Failed to restore backup: ' + error.message + '\n\nMake sure you copied the entire backup text.');
}
```

}

// Backup reminder
checkBackupReminder() {
if (this.meals.length === 0) return;

```
const lastBackup = localStorage.getItem('last-backup-time');
const now = new Date();
const currentHour = now.getHours();

if (lastBackup) {
  const lastBackupDate = new Date(lastBackup);
  const hoursSince = (now - lastBackupDate) / (1000 * 60 * 60);
  const isToday = lastBackupDate.toDateString() === now.toDateString();

  if (hoursSince >= 24) {
    this.showBackupReminder = 'urgent';
  } else if (currentHour >= 20 && !isToday) {
    this.showBackupReminder = 'tonight';
  } else if (!isToday && this.meals.length >= 5) {
    this.showBackupReminder = 'warning';
  }
} else {
  if (this.meals.length >= 5) {
    this.showBackupReminder = 'urgent';
  } else if (currentHour >= 20 && this.meals.length >= 3) {
    this.showBackupReminder = 'tonight';
  } else if (this.meals.length >= 3) {
    this.showBackupReminder = 'warning';
  }
}
```

}

// View switching
switchView(view) {
this.activeView = view;

```
// Update nav buttons
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.classList.remove('active');
});

const activeBtn = document.getElementById(`nav-${view}`);
if (activeBtn) {
  activeBtn.classList.add('active');
}

// Show/hide views
['today', 'history', 'comparison'].forEach(v => {
  const el = document.getElementById(`${v}-view`);
  if (el) {
    el.style.display = v === view ? 'block' : 'none';
  }
});

// Render specific view content
if (view === 'history') {
  this.renderHistory();
} else if (view === 'comparison') {
  this.renderComparison();
} else {
  this.render();
}
```

}

// Utilities
getTodayDate() {
return new Date().toISOString().split(‘T’)[0];
}

getMealsForDate(date) {
return this.meals.filter(m => m.date === date);
}

calculateTotals(meals) {
return meals.reduce((totals, meal) => ({
calories: totals.calories + meal.calories,
protein: totals.protein + meal.protein,
fats: totals.fats + meal.fats,
carbs: totals.carbs + meal.carbs
}), { calories: 0, protein: 0, fats: 0, carbs: 0 });
}

showError(message) {
const errorDiv = document.createElement(‘div’);
errorDiv.className = ‘error-message’;
errorDiv.textContent = message;
document.body.appendChild(errorDiv);
setTimeout(() => errorDiv.remove(), 5000);
}

// Main render - will be completed in next file
render() {
// This will call specific render methods
this.renderGoals();
this.renderTodaysMeals();
this.renderProgress();
this.renderTemplates();
this.renderBackupReminder();
}

renderGoals() {
// Implementation in ui-renderer.js
}

renderTodaysMeals() {
// Implementation in ui-renderer.js
}

renderProgress() {
// Implementation in ui-renderer.js
}

renderTemplates() {
// Implementation in ui-renderer.js
}

renderHistory() {
// Implementation in ui-renderer.js
}

renderComparison() {
// Implementation in ui-renderer.js
}

renderBackupReminder() {
// Implementation in ui-renderer.js
}
}

// Make app globally available
window.NutriLogApp = NutriLogApp;
