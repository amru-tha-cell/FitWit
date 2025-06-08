import React from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import '../../Styles/OutfitBuilder.css'

const OutfitBuilder = ({ currentOutfit, categories, removeFromOutfit }) => {
  return (
    <div className="card">
      <h2 className="card-title">
        <Sparkles className="icon-purple" />
        Current Outfit
      </h2>
      
      <div className="outfit-slots">
        {categories.map(category => (
          <div key={category.key} className="outfit-slot">
            <div className="slot-header">
              <span className="slot-label">{category.label}</span>
              {currentOutfit[category.key] && (
                <button
                  onClick={() => removeFromOutfit(category.key)}
                  className="delete-btn"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            <div className={`slot-content ${!currentOutfit[category.key] ? 'empty' : ''}`}>
              {currentOutfit[category.key] ? (
                <>
                  <img
                    src={currentOutfit[category.key].src}
                    alt={currentOutfit[category.key].name}
                    className="slot-image"
                  />
                  <span className="slot-name">{currentOutfit[category.key].name}</span>
                </>
              ) : (
                <p className="empty-text">Click items to add</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitBuilder;