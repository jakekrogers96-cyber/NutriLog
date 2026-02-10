// UI Renderer for NutriLog
// Handles all DOM updates and visual rendering

// Extend NutriLogApp with render methods
NutriLogApp.prototype.renderGoals = function() {
const container = this.elements.goalCards;
if (!container) return;

const todaysMeals = this.getMealsForDate(this.selectedDate);
const totals = this.calculateTotals(todaysMeals);

if (this.editingGoals) {
container.innerHTML = `<div class="grid grid-cols-2 gap-4"> <div> <label class="text-xs text-gray-600">Calories</label> <input type="number" id="edit-calories" value="${this.goals.calories}"  class="w-full p-2 border rounded text-center font-bold text-blue-600"> </div> <div> <label class="text-xs text-gray-600">Protein (g)</label> <input type="number" id="edit-protein" value="${this.goals.protein}" class="w-full p-2 border rounded text-center font-bold text-green-600"> </div> <div> <label class="text-xs text-gray-600">Fats (g)</label> <input type="number" id="edit-fats" value="${this.goals.fats}" class="w-full p-2 border rounded text-center font-bold text-yellow-600"> </div> <div> <label class="text-xs text-gray-600">Carbs (g)</label> <input type="number" id="edit-carbs" value="${this.goals.carbs}" class="w-full p-2 border rounded text-center font-bold text-purple-600"> </div> </div>`;

```
// Add event listener for save
setTimeout(() => {
  const saveGoals = () => {
    const newGoals = {
      calories: parseInt(document.getElementById('edit-calories').value) || 0,
      protein: parseInt(document.getElementById('edit-protein').value) || 0,
      fats: parseInt(document.getElementById('edit-fats').value) || 0,
      carbs: parseInt(document.getElementById('edit-carbs').value) || 0
    };
    this.handleUpdateGoals(newGoals);
  };

  document.querySelectorAll('#edit-calories, #edit-protein, #edit-fats, #edit-carbs').forEach(input => {
    input.addEventListener('blur', saveGoals);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveGoals();
    });
  });
}, 0);
```

} else {
const remaining = {
calories: this.goals.calories - totals.calories,
protein: this.goals.protein - totals.protein,
fats: this.goals.fats - totals.fats,
carbs: this.goals.carbs - totals.carbs
};

```
container.innerHTML = `
  <div class="grid grid-cols-2 gap-3">
    <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
      <div class="text-xl font-bold text-blue-700">${this.goals.calories}</div>
      <div class="text-xs text-blue-600 font-medium">Calories</div>
      <div class="text-xs font-bold text-blue-800 mt-1">
        ${remaining.calories > 0 ? `${remaining.calories} left` : `${Math.abs(remaining.calories)} over`}
      </div>
    </div>
    <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
      <div class="text-xl font-bold text-green-700">${this.goals.protein}g</div>
      <div class="text-xs text-green-600 font-medium">Protein</div>
      <div class="text-xs font-bold text-green-800 mt-1">
        ${remaining.protein > 0 ? `${Math.round(remaining.protein)}g left` : `${Math.abs(Math.round(remaining.protein))}g over`}
      </div>
    </div>
    <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3">
      <div class="text-xl font-bold text-yellow-700">${this.goals.fats}g</div>
      <div class="text-xs text-yellow-600 font-medium">Fats</div>
      <div class="text-xs font-bold text-yellow-800 mt-1">
        ${remaining.fats > 0 ? `${Math.round(remaining.fats)}g left` : `${Math.abs(Math.round(remaining.fats))}g over`}
      </div>
    </div>
    <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
      <div class="text-xl font-bold text-purple-700">${this.goals.carbs}g</div>
      <div class="text-xs text-purple-600 font-medium">Carbs</div>
      <div class="text-xs font-bold text-purple-800 mt-1">
        ${remaining.carbs > 0 ? `${Math.round(remaining.carbs)}g left` : `${Math.abs(Math.round(remaining.carbs))}g over`}
      </div>
    </div>
  </div>
`;
```

}
};

NutriLogApp.prototype.renderTodaysMeals = function() {
const container = this.elements.todayMealsList;
if (!container) return;

const todaysMeals = this.getMealsForDate(this.selectedDate);

if (todaysMeals.length === 0) {
container.innerHTML = ‘<div class="text-center py-8 text-gray-500">No meals logged for this day</div>’;
return;
}

container.innerHTML = todaysMeals.map(meal => {
if (this.editingMeal && this.editingMeal.id === meal.id) {
return this.renderEditMealForm(meal);
} else {
return this.renderMealCard(meal);
}
}).join(’’);

// Add event listeners
this.attachMealEventListeners();
};

NutriLogApp.prototype.renderMealCard = function(meal) {
const componentsHTML = meal.components && meal.components.length > 0 ? `<div class="bg-green-50 border-l-4 border-green-400 p-3 rounded mb-3"> <div class="text-xs font-semibold text-green-800 mb-2">Nutrition Breakdown by Component:</div> <div class="space-y-1"> ${meal.components.map(comp =>`
<div class="text-xs text-green-700 flex justify-between">
<span class="font-medium">${comp.name}:</span>
<span>${comp.calories} cal | P:${comp.protein}g | F:${comp.fats}g | C:${comp.carbs}g</span>
</div>
`).join('')} <div class="border-t border-green-300 mt-2 pt-1 flex justify-between font-bold text-green-900"> <span>TOTAL:</span> <span>${meal.calories} cal | P:${meal.protein}g | F:${meal.fats}g | C:${meal.carbs}g</span> </div> </div> </div> ` : ‘’;

const assumptionsHTML = meal.assumptions && meal.assumptions.length > 0 ? `<div class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded"> <div class="text-xs font-semibold text-blue-800 mb-1">Calculation Assumptions:</div> <ul class="text-xs text-blue-700 space-y-1"> ${meal.assumptions.map(a =>`<li>• ${a}</li>`).join('')} </ul> </div> ` : ‘’;

return `<div class="bg-gray-50 rounded-lg p-4 meal-card" data-meal-id="${meal.id}"> <div class="flex justify-between items-start mb-2"> <div class="font-semibold text-gray-800">${meal.name}</div> <div class="flex gap-3 text-sm"> <span class="text-purple-600 cursor-pointer underline override-btn">Override</span> <span class="text-blue-600 cursor-pointer underline edit-btn">Edit</span> <span class="text-red-600 cursor-pointer underline delete-btn">Delete</span> </div> </div> <div class="text-sm text-gray-600 mb-2">${meal.description}</div> <div class="flex gap-4 text-sm mb-3"> <span class="text-blue-600 font-medium">${meal.calories} cal</span> <span class="text-green-600 font-medium">P: ${meal.protein}g</span> <span class="text-yellow-600 font-medium">F: ${meal.fats}g</span> <span class="text-purple-600 font-medium">C: ${meal.carbs}g</span> </div> ${componentsHTML} ${assumptionsHTML} </div>`;
};

NutriLogApp.prototype.renderEditMealForm = function(meal) {
return `<div class="bg-gray-50 rounded-lg p-4"> <input type="text" id="edit-meal-name" value="${meal.name}"  class="w-full p-2 border rounded mb-2 font-semibold"> <div class="grid grid-cols-2 gap-2 mb-3"> <div> <label class="text-xs text-gray-600">Calories</label> <input type="number" id="edit-meal-calories" value="${meal.calories}" class="w-full p-2 border rounded"> </div> <div> <label class="text-xs text-gray-600">Protein (g)</label> <input type="number" id="edit-meal-protein" value="${meal.protein}" class="w-full p-2 border rounded"> </div> <div> <label class="text-xs text-gray-600">Fats (g)</label> <input type="number" id="edit-meal-fats" value="${meal.fats}" class="w-full p-2 border rounded"> </div> <div> <label class="text-xs text-gray-600">Carbs (g)</label> <input type="number" id="edit-meal-carbs" value="${meal.carbs}" class="w-full p-2 border rounded"> </div> </div> <div class="flex gap-2"> <button class="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium save-edit-btn"> Save Changes </button> <button class="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 font-medium cancel-edit-btn"> Cancel </button> </div> </div>`;
};

NutriLogApp.prototype.attachMealEventListeners = function() {
// Edit buttons
document.querySelectorAll(’.edit-btn’).forEach(btn => {
btn.addEventListener(‘click’, (e) => {
const card = e.target.closest(’.meal-card’);
const mealId = parseInt(card.dataset.mealId);
const meal = this.meals.find(m => m.id === mealId);
if (meal) this.handleEditMeal(meal);
});
});

// Delete buttons
document.querySelectorAll(’.delete-btn’).forEach(btn => {
btn.addEventListener(‘click’, (e) => {
const card = e.target.closest(’.meal-card’);
const mealId = parseInt(card.dataset.mealId);
this.handleDeleteMeal(mealId);
});
});

// Save edit button
const saveBtn = document.querySelector(’.save-edit-btn’);
if (saveBtn) {
saveBtn.addEventListener(‘click’, () => {
this.editingMeal.editName = document.getElementById(‘edit-meal-name’).value;
this.editingMeal.editCalories = document.getElementById(‘edit-meal-calories’).value;
this.editingMeal.editProtein = document.getElementById(‘edit-meal-protein’).value;
this.editingMeal.editFats = document.getElementById(‘edit-meal-fats’).value;
this.editingMeal.editCarbs = document.getElementById(‘edit-meal-carbs’).value;
this.handleSaveEdit();
});
}

// Cancel edit button
const cancelBtn = document.querySelector(’.cancel-edit-btn’);
if (cancelBtn) {
cancelBtn.addEventListener(‘click’, () => {
this.editingMeal = null;
this.render();
});
}
};

NutriLogApp.prototype.renderProgress = function() {
const container = this.elements.progressBars;
if (!container) return;

const todaysMeals = this.getMealsForDate(this.selectedDate);
const totals = this.calculateTotals(todaysMeals);

const renderBar = (label, current, goal, color) => {
const percentage = Math.min((current / goal) * 100, 100);
return `<div class="mb-3"> <div class="flex justify-between text-sm mb-1"> <span class="font-medium text-gray-700">${label}</span> <span class="text-gray-600">${Math.round(current)} / ${goal}</span> </div> <div class="w-full bg-gray-200 rounded-full h-3"> <div class="h-3 rounded-full ${color}" style="width: ${percentage}%"></div> </div> </div>`;
};

container.innerHTML = `${renderBar('Calories', totals.calories, this.goals.calories, 'bg-blue-600')} ${renderBar('Protein', totals.protein, this.goals.protein, 'bg-green-600')} ${renderBar('Fats', totals.fats, this.goals.fats, 'bg-yellow-600')} ${renderBar('Carbs', totals.carbs, this.goals.carbs, 'bg-purple-600')}`;
};

NutriLogApp.prototype.renderTemplates = function() {
const container = this.elements.templatesContainer;
if (!container || this.templates.length === 0) return;

container.innerHTML = `<div class="space-y-2"> ${this.templates.map(template =>`
<div class="bg-purple-50 rounded p-2 flex justify-between items-center template-item" data-template-id="${template.id}">
<div class="flex-1">
<div class="font-medium text-sm">${template.name}</div>
<div class="text-xs text-gray-600">${template.calories} cal | P:${template.protein}g | F:${template.fats}g | C:${template.carbs}g</div>
</div>
<div class="flex gap-3 text-xs">
<span class="text-green-600 cursor-pointer underline font-medium add-template-btn">Add</span>
<span class="text-red-600 cursor-pointer text-base font-bold delete-template-btn">×</span>
</div>
</div>
`).join('')} </div> `;

// Add event listeners
document.querySelectorAll(’.add-template-btn’).forEach(btn => {
btn.addEventListener(‘click’, (e) => {
const item = e.target.closest(’.template-item’);
const templateId = parseInt(item.dataset.templateId);
const template = this.templates.find(t => t.id === templateId);
if (template) this.handleAddFromTemplate(template);
});
});

document.querySelectorAll(’.delete-template-btn’).forEach(btn => {
btn.addEventListener(‘click’, (e) => {
const item = e.target.closest(’.template-item’);
const templateId = parseInt(item.dataset.templateId);
this.handleDeleteTemplate(templateId);
});
});
};

NutriLogApp.prototype.renderBackupReminder = function() {
const container = this.elements.backupReminder;
if (!container) return;

if (!this.showBackupReminder) {
container.style.display = ‘none’;
return;
}

const reminders = {
urgent: {
class: ‘bg-red-100 border-red-500’,
icon: ‘🚨’,
title: ‘URGENT: Backup Your Data!’,
message: “You haven’t backed up in over 24 hours. You could lose all your meal data!”,
btnClass: ‘bg-red-600 hover:bg-red-700’
},
tonight: {
class: ‘bg-orange-100 border-orange-500’,
icon: ‘🌙’,
title: ‘End of Day - Time to Backup!’,
message: “Don’t forget to backup before bed. Takes 10 seconds!”,
btnClass: ‘bg-orange-600 hover:bg-orange-700’
},
warning: {
class: ‘bg-yellow-100 border-yellow-500’,
icon: ‘⚠️’,
title: ‘Backup Recommended’,
message: `You have ${this.meals.length} meals logged. Backup to save your progress!`,
btnClass: ‘bg-yellow-600 hover:bg-yellow-700’
}
};

const reminder = reminders[this.showBackupReminder];
if (!reminder) return;

container.innerHTML = `<div class="${reminder.class} border-2 rounded-2xl p-4"> <div class="flex items-start gap-3"> <div class="text-3xl">${reminder.icon}</div> <div class="flex-1"> <div class="font-bold text-lg mb-1">${reminder.title}</div> <div class="text-sm mb-3">${reminder.message}</div> <div class="flex gap-2"> <button class="${reminder.btnClass} text-white px-4 py-2 rounded-lg font-semibold text-sm" onclick="app.showBackupModal()"> 📋 Backup Now </button> <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm" onclick="app.showBackupReminder = false; app.render()"> Dismiss </button> </div> </div> </div> </div>`;

container.style.display = ‘block’;
};

// History and Comparison views will be in a separate file if needed
NutriLogApp.prototype.renderHistory = function(month) {
// Placeholder - implement if needed
const container = this.elements.historyMealsList;
if (container) {
container.innerHTML = ‘<div class="text-center py-8">History view - Coming soon</div>’;
}
};

NutriLogApp.prototype.renderComparison = function() {
// Placeholder - implement if needed
const container = this.elements.comparisonContent;
if (container) {
container.innerHTML = ‘<div class="text-center py-8">Comparison view - Coming soon</div>’;
}
};
