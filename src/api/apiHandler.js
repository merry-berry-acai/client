import axios from 'axios';

const apiURL = 'https://server-b4co.onrender.com/';

const apiHandler = axios.create({
  baseURL: apiURL,
  timeout: 5000,
});

async function getMenuItems() {
    try {
        const response = await apiHandler.get('/items/');
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

getMenuItems().then(result => console.log(result));
export { getMenuItems };
