// Updated CATEGORIES with renamed categories
export const CATEGORIES = [
  { id: 1, name: "Signature Blends", items: [1, 2, 3, 4] },
  { id: 2, name: "Vitality Mixes", items: [5, 6, 7] },
  { id: 3, name: "Exotic Flavors", items: [8, 9] },
];

// Updated TOPPINGS export with additional toppings
export const TOPPINGS = [
  { id: 1, name: "Granola", price: "$0.99" },
  { id: 2, name: "Fresh Berries", price: "$1.49" },
  { id: 3, name: "Coconut Flakes", price: "$0.79" },
  { id: 4, name: "Honey", price: "$0.50" },
  { id: 5, name: "Chia Seeds", price: "$0.69" },
  { id: 6, name: "Cinnamon", price: "$0.40" }
];

// Updated MENU_ITEMS with added details for each item
export const MENU_ITEMS = [
  {
    id: 1,
    name: "Classic Açaí Bowl",
    description: "Organic açaí topped with granola and seasonal fruits",
    details: "Made with organic açaí, topped with fresh seasonal fruits and crunchy granola.",
    price: "$9.99",
    image: new URL("../assets/acai-bowl.png", import.meta.url).href,
    toppings: [ TOPPINGS[0], TOPPINGS[1], TOPPINGS[2] ]
  },
  {
    id: 2,
    name: "Tropical Smoothie",
    description: "Mango, pineapple, and coconut milk blend",
    details: "A refreshing blend of tropical fruits with a hint of coconut milk.",
    price: "$7.99",
    image: new URL("../assets/smoothie.png", import.meta.url).href,
    toppings: [ TOPPINGS[1], TOPPINGS[3] ]
  },
  {
    id: 3,
    name: "Merry Berry Smoothie",
    description: "Strawberry, blueberry, and banana blend",
    details: "Bursting with mixed berries and banana for a naturally sweet taste.",
    price: "$8.99",
    image: new URL("../assets/smoothie2.png", import.meta.url).href,
    toppings: [ TOPPINGS[1], TOPPINGS[0] ]
  },
  {
    id: 4,
    name: "Green Detox Smoothie",
    description: "Spinach, kale, apple, and ginger blend",
    details: "A nutrient-packed blend to detox and energize your day.",
    price: "$8.49",
    image: new URL("../assets/green-detox.png", import.meta.url).href,
    toppings: [ TOPPINGS[3] ]
  },
  {
    id: 5,
    name: "Berry Blast Smoothie",
    description: "Mixed berries with almond milk",
    details: "A vibrant mix of berries blended with creamy almond milk.",
    price: "$8.99",
    image: new URL("../assets/berry-blast.png", import.meta.url).href,
    toppings: [ TOPPINGS[0], TOPPINGS[1] ]
  },
  {
    id: 6,
    name: "Peach Paradise",
    description: "Peach, mango, and yogurt blend",
    details: "A deliciously creamy blend that brings out the sweetness of peach and mango.",
    price: "$7.99",
    image: new URL("../assets/peach-paradise.png", import.meta.url).href,
    toppings: [ TOPPINGS[2], TOPPINGS[3] ]
  },
  {
    id: 7,
    name: "Chocolate Protein Shake",
    description: "Chocolate, banana, and protein powder blend",
    details: "A protein-packed shake with rich chocolate and banana flavors.",
    price: "$9.49",
    image: new URL("../assets/chocolate-protein.png", import.meta.url).href,
    toppings: [ TOPPINGS[2] ]
  },
  {
    id: 8,
    name: "Vanilla Almond Smoothie",
    description: "Vanilla, almond, and oats blend",
    details: "A smooth combination of vanilla and almond with a hint of oats.",
    price: "$8.29",
    image: new URL("../assets/vanilla-almond.png", import.meta.url).href,
    toppings: [ TOPPINGS[0] ]
  },
  {
    id: 9,
    name: "Citrus Refresher",
    description: "Orange, lemon, and mint blend",
    details: "A zesty mix of citrus fruits with a refreshing finish of mint.",
    price: "$7.50",
    image: new URL("../assets/citrus-refresher.png", import.meta.url).href,
    toppings: [ TOPPINGS[1], TOPPINGS[2] ]
  }
];

// Add FEATURED_ITEMS export
export const FEATURED_ITEMS = MENU_ITEMS.filter(item => [1, 2, 3].includes(item.id));

// Add a new constant for mock previous orders keyed by user uid
const PREVIOUS_ORDERS = {
  "EszW3BDsb4P6qLp9gJ03IRkCTKn2": [
    {
      id: 1,
      title: "Classic Açaí Bowl Order",
      company: "Smoothie Express",
      period: "2023-01-15",
      description: "Order delivered successfully.",
    },
    {
      id: 2,
      title: "Tropical Smoothie Order",
      company: "Smoothie Express",
      period: "2023-02-03",
      description: "Order delivered successfully.",
    },
  ],
  // ...add more uid orders as needed...
};

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

// New function to get orders by user uid
export function getOrdersByUserId(uid) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = PREVIOUS_ORDERS[uid] || "No previous orders";
      resolve(orders);
    }, 500);
  });
}