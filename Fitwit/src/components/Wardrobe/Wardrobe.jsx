import React from 'react';
import {useState} from 'react'
import { Upload, ShoppingBag, Trash2, Search, Clock } from 'lucide-react';
import '../../Styles/Wardrobe.css'

const Wardrobe = ({ 
  wardrobe, 
  activeCategory, 
  setActiveCategory, 
  categories, 
  handleImageUpload, 
  addToOutfit, 
  deleteClothingItem 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const getRecentItems = () => {
    const allItems = Object.values(wardrobe).flat();
    return allItems
      .filter(item => item.wearCount > 0)
      .sort((a, b) => b.wearCount - a.wearCount)
      .slice(0, 10);
  };
  const getFilteredItems = () => {
    if (activeCategory === 'recent') {
      return getRecentItems().filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return wardrobe[activeCategory].filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const allCategories = [
    { key: 'recent', label: 'Recent', icon: Clock, color: 'btn-orange' },
    ...categories
  ];

  return (
    <div className="card">
      <h2 className="card-title">
        <ShoppingBag className="icon-pink" />
        Your Wardrobe
      </h2>
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search your wardrobe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="category-tabs">
        {allCategories.map(category => {
          const Icon = category.icon;
          const count = category.key === 'recent' 
            ? getRecentItems().length 
            : wardrobe[category.key]?.length || 0;
          
          return (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`category-tab ${activeCategory === category.key ? `active ${category.color}` : ''}`}
            >
              <Icon size={16} />
              {category.label} ({count})
            </button>
          );
        })}
      </div>
      {activeCategory !== 'recent' && (
        <label className="upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(activeCategory, e)}
          />
          <Upload className="upload-icon" size={32} />
          <p className="upload-text">
            Click to upload {categories.find(c => c.key === activeCategory)?.label.toLowerCase()}
          </p>
        </label>
      )}
      <div className="clothing-grid">
        {getFilteredItems().map(item => (
          <div key={item.id} className="clothing-item">
            <img
              src={item.src}
              alt={item.name}
              onClick={() => addToOutfit(item)}
            />
            <div className="clothing-item-info">
              <p className="clothing-item-name">{item.name}</p>
              {item.wearCount > 0 && (
                <p className="wear-count">Worn {item.wearCount} times</p>
              )}
            </div>
            {activeCategory !== 'recent' && (
              <button
                onClick={() => deleteClothingItem(activeCategory, item.id)}
                className="delete-btn"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
