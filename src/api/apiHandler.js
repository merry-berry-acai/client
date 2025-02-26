import axios from 'axios';

const apiURL = "https://merry-berry.onrender.com/";

const apiHandler = axios.create({
  baseURL: apiURL,
  timeout: 5000,
});

const state = {
  menuItems: null,
  categories: null,
  toppings: null,
  featuredItems: null,
};

async function fetchData(endpoint) {
  try {
    const response = await apiHandler.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function getMenuItems() {
  if (!state.menuItems) {
    state.menuItems = await fetchData('/items/');
  }
  return state.menuItems;
}

// Optionally fetch a specific category if provided; otherwise fetch all categories
async function getCategories(category = '') {
  if (!state.categories) {
    state.categories = await fetchData(category ? `/categories/${category}` : '/categories/');
  }
  return state.categories;
}

async function getToppings() {
  if (!state.toppings) {
    state.toppings = await fetchData('/toppings/');
  }
  return state.toppings;
}

async function getItemsInCategory(category) {
  const menuItems = await fetchData(`/items/category/${category}`)
    return menuItems;
};

async function getFeaturedItems() {
    if (!state.featuredItems) {
      state.featuredItems = await fetchData('/items/home/featured');
    }
    return state.featuredItems;
}
async function sendUserToDB(user) {
    await apiHandler.post('/users/', user);
  // Send user to the database
  console.log("Sending user to the database:", user);
}


async function createMenuItem(item, userCredential) {
    const menuItem = await apiHandler.post('/items/', item, {
      headers: {
        'X-User-ID': userCredential,
      },
    });
    return menuItem;
}
export { getMenuItems, getCategories, getToppings, getItemsInCategory, getFeaturedItems };
