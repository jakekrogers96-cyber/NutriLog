// Nutrition Estimation Engine for NutriLog
// Estimates nutrition from meal descriptions

class NutritionEstimator {
estimateNutrition(description) {
const lower = description.toLowerCase();
let calories = 0;
let protein = 0;
let fats = 0;
let carbs = 0;
let assumptions = [];
let components = [];

```
// Check for pre-defined meals first
if (lower.includes('pizza') && !lower.includes('bread')) {
  return this.estimatePizza(description, lower);
}
if ((lower.includes('burger') || lower.includes('hamburger')) && !lower.includes('bun')) {
  return this.estimateBurger();
}

// Protein sources
if (lower.includes('chicken') || lower.includes('turkey')) {
  const comp = { name: "Grilled Chicken/Turkey Breast", calories: 300, protein: 45, fats: 8, carbs: 0 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("6oz (170g) grilled chicken breast or turkey, skinless");
}

if (lower.includes('beef') || lower.includes('steak')) {
  const comp = { name: "Sirloin Steak", calories: 400, protein: 40, fats: 20, carbs: 0 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("6oz (170g) sirloin steak, lean cut");
}

if (lower.includes('fish') || lower.includes('salmon') || lower.includes('tuna')) {
  const comp = { name: "Salmon Fillet", calories: 280, protein: 40, fats: 12, carbs: 0 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("6oz (170g) salmon fillet or tuna steak");
}

if (lower.includes('sausage')) {
  const count = description.match(/(\d+)\s*sausage/i);
  const sausages = count ? parseInt(count[1]) : 2;
  const comp = { name: `${sausages} Pork Sausages`, calories: sausages * 150, protein: sausages * 12, fats: sausages * 13, carbs: sausages * 1 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push(`${sausages} standard pork sausages (~50g each)`);
}

if (lower.includes('egg')) {
  const count = description.match(/(\d+)\s*egg/i);
  const eggs = count ? parseInt(count[1]) : 2;
  const cooking = lower.includes('fried') ? 'Fried' : 'Cooked';
  const eggCals = lower.includes('fried') ? 90 : 70;
  const eggFats = lower.includes('fried') ? 7 : 5;
  const comp = { name: `${eggs} ${cooking} Eggs`, calories: eggs * eggCals, protein: eggs * 6, fats: eggs * eggFats, carbs: eggs * 1 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push(`${eggs} large eggs (50g each)${lower.includes('fried') ? ', fried in oil' : ''}`);
}

// Carb sources
if (lower.includes('rice')) {
  const comp = { name: "Cooked White Rice", calories: 200, protein: 4, fats: 0, carbs: 45 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("1 cup (158g) cooked white rice, steamed");
}

if (lower.includes('pasta')) {
  const comp = { name: "Cooked Pasta", calories: 220, protein: 8, fats: 1, carbs: 43 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("1 cup (140g) cooked pasta, no sauce");
}

if (lower.includes('bread') || lower.includes('toast')) {
  const breadType = lower.includes('white') ? 'White' : lower.includes('sourdough') ? 'Sourdough' : 'Whole Wheat';
  const comp = { name: `2 Slices ${breadType} Bread`, calories: 160, protein: 6, fats: 2, carbs: 30 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push(`2 slices ${breadType.toLowerCase()} bread (~60g total)`);
}

if (lower.includes('potato')) {
  const comp = { name: "Baked Potato", calories: 130, protein: 3, fats: 0, carbs: 30 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("1 medium potato (150g), baked/boiled, no toppings");
}

if (lower.includes('oats') || lower.includes('oatmeal')) {
  const comp = { name: "Oatmeal", calories: 150, protein: 5, fats: 3, carbs: 27 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("1/2 cup (40g) dry oats, cooked in water");
}

// Vegetables
if (lower.includes('broccoli') || lower.includes('vegetables') || lower.includes('salad')) {
  const comp = { name: "Mixed Vegetables", calories: 50, protein: 3, fats: 0, carbs: 10 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("1 cup mixed vegetables or salad greens");
}

// Fats
if (lower.includes('avocado')) {
  const comp = { name: "Avocado", calories: 160, protein: 2, fats: 15, carbs: 9 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("1/2 medium avocado (~68g)");
}

if (lower.includes('oil') || lower.includes('butter')) {
  const comp = { name: "Cooking Oil/Butter", calories: 120, protein: 0, fats: 14, carbs: 0 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("1 tablespoon (14g) oil or butter");
}

if (lower.includes('nuts') || lower.includes('peanut butter')) {
  const comp = { name: "Peanut Butter", calories: 180, protein: 7, fats: 16, carbs: 6 };
  components.push(comp);
  calories += comp.calories; protein += comp.protein; fats += comp.fats; carbs += comp.carbs;
  assumptions.push("2 tablespoons peanut butter or 1oz mixed nuts");
}

// Sandwiches and shakes
if (lower.includes('sandwich') && !lower.includes('burger')) {
  return this.estimateSandwich();
}

if (lower.includes('protein shake') || lower.includes('shake')) {
  return this.estimateProteinShake();
}

// Default if nothing matched
if (components.length === 0) {
  components.push({ name: "General Meal Estimate", calories: 400, protein: 25, fats: 15, carbs: 45 });
  calories = 400; protein = 25; fats = 15; carbs = 45;
  assumptions.push("⚠️ GENERIC ESTIMATE - Not brand-specific!");
  assumptions.push("Based on average portion sizes from USDA database");
  assumptions.push("Recommend checking product packaging for accurate values");
} else {
  assumptions.unshift("⚠️ These are ESTIMATES based on generic food data");
  assumptions.push("Check product labels for brand-specific nutrition info");
}

const name = components.length === 1 ? components[0].name : components.map(c => c.name).join(" + ");

return {
  calories: Math.round(calories),
  protein: Math.round(protein),
  fats: Math.round(fats),
  carbs: Math.round(carbs),
  name: name.length > 50 ? description.substring(0, 47) + '...' : name,
  assumptions,
  components
};
```

}

estimatePizza(description, lower) {
const slices = description.match(/(\d+)\s*slice/i);
const count = slices ? parseInt(slices[1]) : 2;
const comp = { name: `${count} Pizza Slices (Cheese)`, calories: count * 285, protein: count * 12, fats: count * 10, carbs: count * 36 };
return {
calories: comp.calories,
protein: comp.protein,
fats: comp.fats,
carbs: comp.carbs,
name: `Pizza (${count} slices)`,
assumptions: [
`${count} slices from 14-inch pizza (1/8 of pie per slice)`,
“~30g mozzarella cheese per slice”,
“Tomato sauce and regular crust”,
“Add 50-100 cal/slice for meat toppings”
],
components: [comp]
};
}

estimateBurger() {
const components = [
{ name: “Beef Patty (1/4 lb)”, calories: 290, protein: 25, fats: 20, carbs: 0 },
{ name: “Burger Bun”, calories: 150, protein: 5, fats: 2, carbs: 28 },
{ name: “Cheese Slice”, calories: 70, protein: 3, fats: 5, carbs: 1 },
{ name: “Condiments & Toppings”, calories: 30, protein: 1, fats: 1, carbs: 11 }
];
return {
calories: components.reduce((sum, c) => sum + c.calories, 0),
protein: components.reduce((sum, c) => sum + c.protein, 0),
fats: components.reduce((sum, c) => sum + c.fats, 0),
carbs: components.reduce((sum, c) => sum + c.carbs, 0),
name: “Burger”,
assumptions: [
“Standard 1/4 lb (113g) beef patty”,
“Sesame seed bun, 1 cheese slice”,
“Lettuce, tomato, onion, pickles, mayo/sauce”
],
components
};
}

estimateSandwich() {
const components = [
{ name: “2 Slices Bread”, calories: 160, protein: 6, fats: 2, carbs: 30 },
{ name: “3oz Deli Meat”, calories: 120, protein: 12, fats: 3, carbs: 2 },
{ name: “Cheese Slice”, calories: 70, protein: 3, fats: 5, carbs: 1 },
{ name: “Vegetables & Condiments”, calories: 20, protein: 1, fats: 2, carbs: 12 }
];
return {
calories: components.reduce((sum, c) => sum + c.calories, 0),
protein: components.reduce((sum, c) => sum + c.protein, 0),
fats: components.reduce((sum, c) => sum + c.fats, 0),
carbs: components.reduce((sum, c) => sum + c.carbs, 0),
name: “Sandwich”,
assumptions: [
“Turkey or ham deli meat (3oz)”,
“Lettuce, tomato, mustard or light mayo”
],
components
};
}

estimateProteinShake() {
const components = [
{ name: “Whey Protein Powder (1 scoop)”, calories: 120, protein: 25, fats: 1, carbs: 3 },
{ name: “Liquid Base (water/milk)”, calories: 130, protein: 15, fats: 2, carbs: 12 }
];
return {
calories: components.reduce((sum, c) => sum + c.calories, 0),
protein: components.reduce((sum, c) => sum + c.protein, 0),
fats: components.reduce((sum, c) => sum + c.fats, 0),
carbs: components.reduce((sum, c) => sum + c.carbs, 0),
name: “Protein Shake”,
assumptions: [
“1 scoop (30g) whey protein powder”,
“8oz water or unsweetened almond milk”
],
components
};
}
}

// Export for use in main app
window.NutritionEstimator = NutritionEstimator;
