// IndexedDB Storage Module for NutriLog
// Provides persistent storage that survives app restarts

class NutriLogDB {
constructor() {
this.dbName = ‘NutriLogDB’;
this.version = 1;
this.db = null;
}

async init() {
return new Promise((resolve, reject) => {
const request = indexedDB.open(this.dbName, this.version);

```
  request.onerror = () => reject(request.error);
  request.onsuccess = () => {
    this.db = request.result;
    console.log('✅ IndexedDB initialized');
    resolve(this.db);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create object stores if they don't exist
    if (!db.objectStoreNames.contains('meals')) {
      const mealStore = db.createObjectStore('meals', { keyPath: 'id' });
      mealStore.createIndex('date', 'date', { unique: false });
      console.log('Created meals store');
    }

    if (!db.objectStoreNames.contains('templates')) {
      db.createObjectStore('templates', { keyPath: 'id' });
      console.log('Created templates store');
    }

    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'key' });
      console.log('Created settings store');
    }
  };
});
```

}

// Meal operations
async saveMeal(meal) {
const transaction = this.db.transaction([‘meals’], ‘readwrite’);
const store = transaction.objectStore(‘meals’);
return new Promise((resolve, reject) => {
const request = store.put(meal);
request.onsuccess = () => resolve(request.result);
request.onerror = () => reject(request.error);
});
}

async getAllMeals() {
const transaction = this.db.transaction([‘meals’], ‘readonly’);
const store = transaction.objectStore(‘meals’);
return new Promise((resolve, reject) => {
const request = store.getAll();
request.onsuccess = () => resolve(request.result);
request.onerror = () => reject(request.error);
});
}

async deleteMeal(id) {
const transaction = this.db.transaction([‘meals’], ‘readwrite’);
const store = transaction.objectStore(‘meals’);
return new Promise((resolve, reject) => {
const request = store.delete(id);
request.onsuccess = () => resolve();
request.onerror = () => reject(request.error);
});
}

async clearAllMeals() {
const transaction = this.db.transaction([‘meals’], ‘readwrite’);
const store = transaction.objectStore(‘meals’);
return new Promise((resolve, reject) => {
const request = store.clear();
request.onsuccess = () => resolve();
request.onerror = () => reject(request.error);
});
}

// Template operations
async saveTemplate(template) {
const transaction = this.db.transaction([‘templates’], ‘readwrite’);
const store = transaction.objectStore(‘templates’);
return new Promise((resolve, reject) => {
const request = store.put(template);
request.onsuccess = () => resolve(request.result);
request.onerror = () => reject(request.error);
});
}

async getAllTemplates() {
const transaction = this.db.transaction([‘templates’], ‘readonly’);
const store = transaction.objectStore(‘templates’);
return new Promise((resolve, reject) => {
const request = store.getAll();
request.onsuccess = () => resolve(request.result);
request.onerror = () => reject(request.error);
});
}

async deleteTemplate(id) {
const transaction = this.db.transaction([‘templates’], ‘readwrite’);
const store = transaction.objectStore(‘templates’);
return new Promise((resolve, reject) => {
const request = store.delete(id);
request.onsuccess = () => resolve();
request.onerror = () => reject(request.error);
});
}

// Settings operations
async saveSetting(key, value) {
const transaction = this.db.transaction([‘settings’], ‘readwrite’);
const store = transaction.objectStore(‘settings’);
return new Promise((resolve, reject) => {
const request = store.put({ key, value });
request.onsuccess = () => resolve();
request.onerror = () => reject(request.error);
});
}

async getSetting(key) {
const transaction = this.db.transaction([‘settings’], ‘readonly’);
const store = transaction.objectStore(‘settings’);
return new Promise((resolve, reject) => {
const request = store.get(key);
request.onsuccess = () => {
const result = request.result;
resolve(result ? result.value : null);
};
request.onerror = () => reject(request.error);
});
}

// Bulk import/export for backups
async exportAll() {
const [meals, templates, goals] = await Promise.all([
this.getAllMeals(),
this.getAllTemplates(),
this.getSetting(‘goals’)
]);

```
return {
  meals,
  templates: templates || [],
  goals: goals || { calories: 2500, protein: 175, fats: 117, carbs: 218 },
  exportDate: new Date().toISOString(),
  version: '1.0'
};
```

}

async importAll(data) {
// Clear existing data
await this.clearAllMeals();

```
// Import meals
if (data.meals && Array.isArray(data.meals)) {
  for (const meal of data.meals) {
    await this.saveMeal(meal);
  }
}

// Import templates
if (data.templates && Array.isArray(data.templates)) {
  for (const template of data.templates) {
    await this.saveTemplate(template);
  }
}

// Import goals
if (data.goals) {
  await this.saveSetting('goals', data.goals);
}

return {
  meals: data.meals?.length || 0,
  templates: data.templates?.length || 0
};
```

}
}

// Export for use in main app
window.NutriLogDB = NutriLogDB;
