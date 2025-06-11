import React, { useState, useEffect } from 'react';
import { Shirt, ShoppingBag, Sparkles } from 'lucide-react';
import Header from './components/Header/Header';
import Wardrobe from './components/Wardrobe/Wardrobe';
import OutfitBuilder from './components/OutfitBuilder/OutfitBuilder';
import SavedOutfits from './components/SavedOutfits/SavedOutfits';
import { 
  handleImageUpload, 
  addToOutfit, 
  removeFromOutfit, 
  saveOutfit, 
  shuffleOutfit, 
  deleteClothingItem,
  loadOutfit,
  deleteOutfit,
  copyOutfit,
  loadFromLocalStorageSafely,
  saveToLocalStorageSafely,
  getStorageInfo
} from './utils/functions';

function App() {
  const [wardrobe, setWardrobe] = useState({
    tops: [],
    bottoms: [],
    shoes: [],
    accessories: []
  });
  
  const [currentOutfit, setCurrentOutfit] = useState({
    tops: null,
    bottoms: null,
    shoes: null,
    accessories: null
  });
  
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [activeCategory, setActiveCategory] = useState('tops');
  const [showSavedOutfits, setShowSavedOutfits] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const categories = [
    { key: 'tops', label: 'Tops', icon: Shirt, color: 'btn-pink' },
    { key: 'bottoms', label: 'Bottoms', icon: ShoppingBag, color: 'btn-blue' },
    { key: 'shoes', label: 'Shoes', icon: ShoppingBag, color: 'btn-green' },
    { key: 'accessories', label: 'Accessories', icon: Sparkles, color: 'btn-purple' }
  ];
  useEffect(() => {
    try {
      const defaultWardrobe = { tops: [], bottoms: [], shoes: [], accessories: [] };
      const defaultOutfits = [];
      
      const savedWardrobe = loadFromLocalStorageSafely('wardrobe', defaultWardrobe);
      const savedOutfitsList = loadFromLocalStorageSafely('savedOutfits', defaultOutfits);
      
      setWardrobe(savedWardrobe);
      setSavedOutfits(savedOutfitsList);
      const storageInfo = getStorageInfo();
      console.log('Storage usage:', storageInfo);
      
      if (storageInfo.percentage > 80) {
        console.warn('Storage is getting full!', storageInfo);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setWardrobe({ tops: [], bottoms: [], shoes: [], accessories: [] });
      setSavedOutfits([]);
    }
  }, []);
  const handleUpload = async (category, event) => {
    try {
      await handleImageUpload(category, event, setWardrobe);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again with a smaller image.');
    }
  };

  const handleAddToOutfit = (item) => {
    try {
      addToOutfit(item, setCurrentOutfit, setWardrobe);
    } catch (error) {
      console.error('Error adding to outfit:', error);
      setCurrentOutfit(prev => ({
        ...prev,
        [item.category]: item
      }));
    }
  };

  const handleRemoveFromOutfit = (category) => {
    removeFromOutfit(category, setCurrentOutfit);
  };

  const handleSaveOutfit = () => {
    try {
      saveOutfit(currentOutfit, savedOutfits, setSavedOutfits);
    } catch (error) {
      console.error('Error saving outfit:', error);
      alert('Failed to save outfit. Storage might be full.');
    }
  };

  const handleShuffleOutfit = () => {
    shuffleOutfit(wardrobe, setCurrentOutfit);
  };

  const handleDeleteClothingItem = (category, itemId) => {
    try {
      deleteClothingItem(category, itemId, setWardrobe, currentOutfit, handleRemoveFromOutfit);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleLoadOutfit = (outfit) => {
    try {
      loadOutfit(outfit, setCurrentOutfit, setShowSavedOutfits, setSavedOutfits);
    } catch (error) {
      console.error('Error loading outfit:', error);
      setCurrentOutfit(outfit.items);
      setShowSavedOutfits(false);
    }
  };

  const handleDeleteOutfit = (outfitId) => {
    try {
      deleteOutfit(outfitId, setSavedOutfits);
    } catch (error) {
      console.error('Error deleting outfit:', error);
      alert('Failed to delete outfit. Please try again.');
    }
  };

  const handleCopyOutfit = (outfit) => {
    try {
      copyOutfit(outfit, savedOutfits, setSavedOutfits);
    } catch (error) {
      console.error('Error copying outfit:', error);
      alert('Failed to copy outfit. Storage might be full.');
    }
  };

  return (
    <div className={`closet-app ${darkMode ? 'dark' : ''}`}>
      <Header 
        showSavedOutfits={showSavedOutfits}
        setShowSavedOutfits={setShowSavedOutfits}
        shuffleOutfit={handleShuffleOutfit}
        saveOutfit={handleSaveOutfit}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <div className="main-content">
        <div className="content-grid">
          <Wardrobe 
            wardrobe={wardrobe}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={categories}
            handleImageUpload={handleUpload}
            addToOutfit={handleAddToOutfit}
            deleteClothingItem={handleDeleteClothingItem}
          />
          
          <div className="sidebar">
            <OutfitBuilder 
              currentOutfit={currentOutfit}
              categories={categories}
              removeFromOutfit={handleRemoveFromOutfit}
            />
            
            {showSavedOutfits && (
              <SavedOutfits 
                savedOutfits={savedOutfits}
                loadOutfit={handleLoadOutfit}
                deleteOutfit={handleDeleteOutfit}
                copyOutfit={handleCopyOutfit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;