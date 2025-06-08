import React from 'react';
import { Heart, Trash2, Copy } from 'lucide-react';
import '../../Styles/SavedOutfits.css';

const SavedOutfits = ({ savedOutfits, loadOutfit, deleteOutfit, copyOutfit }) => {
  return (
    <div className="card">
      <h2 className="card-title">
        <Heart className="icon-red" />
        Saved Outfits ({savedOutfits.length})
      </h2>

      <div className="saved-outfits-grid">
        {savedOutfits.length === 0 ? (
          <p className="empty-text">No saved outfits yet</p>
        ) : (
          savedOutfits.map(outfit => (
            <div key={outfit.id} className="saved-outfit-card">
              <div className="saved-outfit-header">
                <h3 className="saved-outfit-name">{outfit.name || 'Unnamed Outfit'}</h3>
                <div className="outfit-actions">
                  {/* Copy button */}
                  <button
                    onClick={() => copyOutfit(outfit)}
                    className="copy-btn"
                    title="Copy outfit"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => deleteOutfit(outfit.id)}
                    className="delete-btn"
                    title="Delete outfit"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Notes section */}
              {outfit.notes && (
                <p className="outfit-notes">"{outfit.notes}"</p>
              )}

              {/* Outfit preview items */}
              <div className="saved-outfit-preview">
                {outfit.items && Object.entries(outfit.items).map(([category, item]) => 
                  item && (
                    <div key={category} className="preview-item">
                      <img 
                        src={item.src} 
                        alt={item.name || category}
                        className="preview-image"
                      />
                    </div>
                  )
                )}
              </div>

              <div className="saved-outfit-footer">
                <div className="outfit-stats">
                  <span className="saved-date">{outfit.createdAt || 'No Date'}</span>
                  {outfit.timesWorn > 0 && (
                    <span className="times-worn">Worn {outfit.timesWorn} times</span>
                  )}
                </div>
                <button 
                  onClick={() => loadOutfit(outfit)}
                  className="btn btn-blue btn-sm"
                >
                  Load Outfit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedOutfits;
