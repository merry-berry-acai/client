// Updated CATEGORIES with new item IDs
export const CATEGORIES = [
  { id: 1, name: "Category 1", items: [1, 2, 3, 4] },
  { id: 2, name: "Category 2", items: [5, 6, 7] },
  { id: 3, name: "Category 3", items: [8, 9] },
];

// Add new TOPPINGS export
export const TOPPINGS = [
  { id: 1, name: "Granola", price: "$0.99" },
  { id: 2, name: "Fresh Berries", price: "$1.49" },
  { id: 3, name: "Coconut Flakes", price: "$0.79" },
  { id: 4, name: "Honey", price: "$0.50" }
];

// Updated MENU_ITEMS with 6 more items (IDs 4 to 9) and toppings property for each item
export const MENU_ITEMS = [
  {
    id: 1,
    name: "Classic Açaí Bowl",
    description: "Organic açaí topped with granola and seasonal fruits",
    price: "$9.99",
    image: new URL("../assets/acai-bowl.png", import.meta.url).href,
    toppings: [ TOPPINGS[0], TOPPINGS[1], TOPPINGS[2] ]
  },
  {
    id: 2,
    name: "Tropical Smoothie",
    description: "Mango, pineapple, and coconut milk blend",
    price: "$7.99",
    image: new URL("../assets/smoothie.png", import.meta.url).href,
    toppings: [ TOPPINGS[1], TOPPINGS[3] ]
  },
  {
    id: 3,
    name: "Merry Berry Smoothie",
    description: "Strawberry, blueberry, and banana blend",
    price: "$8.99",
    image: new URL("../assets/smoothie2.png", import.meta.url).href,
    toppings: [ TOPPINGS[1], TOPPINGS[0] ]
  },
  {
    id: 4,
    name: "Green Detox Smoothie",
    description: "Spinach, kale, apple, and ginger blend",
    price: "$8.49",
    image: new URL("../assets/green-detox.png", import.meta.url).href,
    toppings: [ TOPPINGS[3] ]
  },
  {
    id: 5,
    name: "Berry Blast Smoothie",
    description: "Mixed berries with almond milk",
    price: "$8.99",
    image: new URL("../assets/berry-blast.png", import.meta.url).href,
    toppings: [ TOPPINGS[0], TOPPINGS[1] ]
  },
  {
    id: 6,
    name: "Peach Paradise",
    description: "Peach, mango, and yogurt blend",
    price: "$7.99",
    image: new URL("../assets/peach-paradise.png", import.meta.url).href,
    toppings: [ TOPPINGS[2], TOPPINGS[3] ]
  },
  {
    id: 7,
    name: "Chocolate Protein Shake",
    description: "Chocolate, banana, and protein powder blend",
    price: "$9.49",
    image: new URL("../assets/chocolate-protein.png", import.meta.url).href,
    toppings: [ TOPPINGS[2] ]
  },
  {
    id: 8,
    name: "Vanilla Almond Smoothie",
    description: "Vanilla, almond, and oats blend",
    price: "$8.29",
    image: new URL("../assets/vanilla-almond.png", import.meta.url).href,
    toppings: [ TOPPINGS[0] ]
  },
  {
    id: 9,
    name: "Citrus Refresher",
    description: "Orange, lemon, and mint blend",
    price: "$7.50",
    image: new URL("../assets/citrus-refresher.png", import.meta.url).href,
    toppings: [ TOPPINGS[1], TOPPINGS[2] ]
  }
];

// Add FEATURED_ITEMS export
export const FEATURED_ITEMS = MENU_ITEMS.filter(item => [1, 2, 3].includes(item.id));

export function getCategories() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(CATEGORIES);
    }, 500);
  });
}

export function getMenuItems() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MENU_ITEMS);
    }, 500);
  });
}

export function getCategoriesWithItems() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categoriesWithItems = CATEGORIES.map(category => ({
        ...category,
        menuItems: MENU_ITEMS.filter(item => category.items.includes(item.id))
      }));
      resolve(categoriesWithItems);
    }, 500);
  });
}

export function getFeaturedItems() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(FEATURED_ITEMS);
    }, 500);
  });
}