// Enhanced utility functions for the Virtual Closet App with localStorage quota fixes

// Safe localStorage operations
export const saveToLocalStorageSafely = (key, data) => {
  try {
    const jsonString = JSON.stringify(data);
    // Check if data is too large (leaving some buffer space)
    if (jsonString.length > 4500000) { // ~4.5MB limit
      console.warn('Data too large for localStorage, using memory storage only');
      return false;
    }
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old data...');
      // Try to clear some space and retry
      try {
        // Clear old wardrobe data if it exists
        localStorage.removeItem('wardrobe');
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (retryError) {
        console.error('Failed to save even after clearing space:', retryError);
        alert('Storage full! Please try uploading smaller images or fewer items.');
        return false;
      }
    }
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

// Load from localStorage safely
export const loadFromLocalStorageSafely = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Compress image before storing
export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Enhanced image upload with compression
export const handleImageUpload = async (category, event, setWardrobe) => {
  const file = event.target.files[0];
  if (file) {
    // Check file size
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image too large! Please choose a smaller image (under 5MB).');
      event.target.value = '';
      return;
    }

    const itemName = prompt('Enter a name/description for this item:') || file.name.split('.')[0];
    
    try {
      // Compress the image
      const compressedImageSrc = await compressImage(file);
      
      const newItem = {
        id: Date.now() + Math.random(),
        src: compressedImageSrc,
        name: itemName,
        category,
        wearCount: 0,
        notes: '',
        dateAdded: new Date().toLocaleDateString()
      };
      
      setWardrobe(prev => {
        const newWardrobe = {
          ...prev,
          [category]: [...prev[category], newItem]
        };
        
        // Save to localStorage safely
        saveToLocalStorageSafely('wardrobe', newWardrobe);
        return newWardrobe;
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    }
  }
  event.target.value = '';
};

// Add to outfit with wear tracking
export const addToOutfit = (item, setCurrentOutfit, setWardrobe) => {
  // Increment wear count
  setWardrobe(prev => {
    const newWardrobe = {
      ...prev,
      [item.category]: prev[item.category].map(wardrobeItem =>
        wardrobeItem.id === item.id
          ? { ...wardrobeItem, wearCount: wardrobeItem.wearCount + 1 }
          : wardrobeItem
      )
    };
    
    // Save to localStorage safely
    saveToLocalStorageSafely('wardrobe', newWardrobe);
    return newWardrobe;
  });
  
  setCurrentOutfit(prev => ({
    ...prev,
    [item.category]: item
  }));
};

// Remove item from current outfit
export const removeFromOutfit = (category, setCurrentOutfit) => {
  setCurrentOutfit(prev => ({
    ...prev,
    [category]: null
  }));
};

// Enhanced save outfit with size checking
export const saveOutfit = (currentOutfit, savedOutfits, setSavedOutfits) => {
  const outfitItems = Object.values(currentOutfit).filter(item => item !== null);
  if (outfitItems.length === 0) {
    alert('Please add some items to your outfit before saving!');
    return;
  }

  // Check if we're approaching storage limits
  if (savedOutfits.length >= 50) {
    alert('You have reached the maximum number of saved outfits (50). Please delete some old outfits first.');
    return;
  }

  const outfitName = prompt('Enter a name for this outfit:') || `Outfit ${savedOutfits.length + 1}`;
  const outfitNotes = prompt('Add notes for this outfit (optional):') || '';
  
  const newOutfit = {
    id: Date.now(),
    name: outfitName,
    items: { ...currentOutfit },
    notes: outfitNotes,
    createdAt: new Date().toLocaleDateString(),
    timesWorn: 0
  };
  
  setSavedOutfits(prev => {
    const newSavedOutfits = [newOutfit, ...prev];
    
    // Try to save to localStorage
    const saved = saveToLocalStorageSafely('savedOutfits', newSavedOutfits);
    if (saved) {
      alert('Outfit saved successfully!');
    } else {
      alert('Outfit saved in memory only (storage full). It will be lost when you refresh the page.');
    }
    
    return newSavedOutfits;
  });
};

// Copy outfit function
export const copyOutfit = (outfit, savedOutfits, setSavedOutfits) => {
  if (savedOutfits.length >= 50) {
    alert('You have reached the maximum number of saved outfits (50). Please delete some old outfits first.');
    return;
  }

  const newName = prompt('Enter a name for the copied outfit:') || `${outfit.name} (Copy)`;
  
  const copiedOutfit = {
    ...outfit,
    id: Date.now(),
    name: newName,
    createdAt: new Date().toLocaleDateString(),
    timesWorn: 0
  };
  
  setSavedOutfits(prev => {
    const newSavedOutfits = [copiedOutfit, ...prev];
    saveToLocalStorageSafely('savedOutfits', newSavedOutfits);
    return newSavedOutfits;
  });
  
  alert('Outfit copied successfully!');
};

// Load outfit with wear tracking
export const loadOutfit = (outfit, setCurrentOutfit, setShowSavedOutfits, setSavedOutfits) => {
  setCurrentOutfit(outfit.items);
  setShowSavedOutfits(false);
  
  // Increment times worn for this outfit
  setSavedOutfits(prev => {
    const newSavedOutfits = prev.map(savedOutfit =>
      savedOutfit.id === outfit.id
        ? { ...savedOutfit, timesWorn: savedOutfit.timesWorn + 1 }
        : savedOutfit
    );
    saveToLocalStorageSafely('savedOutfits', newSavedOutfits);
    return newSavedOutfits;
  });
};

// Shuffle outfit randomly
export const shuffleOutfit = (wardrobe, setCurrentOutfit) => {
  const categories = ['tops', 'bottoms', 'shoes', 'accessories'];
  const newOutfit = {};
  
  categories.forEach(category => {
    const items = wardrobe[category];
    if (items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      newOutfit[category] = randomItem;
    } else {
      newOutfit[category] = null;
    }
  });
  
  setCurrentOutfit(newOutfit);
};

// Delete clothing item
export const deleteClothingItem = (category, itemId, setWardrobe, currentOutfit, removeFromOutfit) => {
  if (confirm('Are you sure you want to delete this item?')) {
    setWardrobe(prev => {
      const newWardrobe = {
        ...prev,
        [category]: prev[category].filter(item => item.id !== itemId)
      };
      saveToLocalStorageSafely('wardrobe', newWardrobe);
      return newWardrobe;
    });
    
    // Remove from current outfit if it's being worn
    if (currentOutfit[category]?.id === itemId) {
      removeFromOutfit(category);
    }
  }
};

// Delete saved outfit
export const deleteOutfit = (outfitId, setSavedOutfits) => {
  if (confirm('Are you sure you want to delete this saved outfit?')) {
    setSavedOutfits(prev => {
      const newSavedOutfits = prev.filter(outfit => outfit.id !== outfitId);
      saveToLocalStorageSafely('savedOutfits', newSavedOutfits);
      return newSavedOutfits;
    });
  }
};

// Clear all localStorage data (useful for debugging)
export const clearAllData = () => {
  if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
    localStorage.removeItem('wardrobe');
    localStorage.removeItem('savedOutfits');
    window.location.reload();
  }
};

// Get storage usage info
export const getStorageInfo = () => {
  try {
    const total = 5 * 1024 * 1024; // Approximate 5MB limit
    let used = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
    
    return {
      used: used,
      total: total,
      percentage: Math.round((used / total) * 100),
      remaining: total - used
    };
  } catch (error) {
    return { used: 0, total: 0, percentage: 0, remaining: 0 };
  }
};