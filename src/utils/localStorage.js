export const storeUserPhoto = async (photoURL) => {
  if (photoURL) {
    try {
      const response = await fetch(photoURL);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64data = reader.result;
        localStorage.setItem('userPhotoData', base64data);
      };
      
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error storing user photo:', error);
    }
  }
};

export const getUserPhoto = () => {
  return localStorage.getItem('userPhotoData');
};

export const clearUserPhoto = () => {
  localStorage.removeItem('userPhotoData');
};
