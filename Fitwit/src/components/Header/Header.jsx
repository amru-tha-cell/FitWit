import React from 'react';
import { Save, Shuffle, Moon, Sun } from 'lucide-react';
import '../../Styles/Header.css'
const Header = ({ showSavedOutfits, setShowSavedOutfits, shuffleOutfit, saveOutfit, darkMode, setDarkMode }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>Virtual Closet</h1>
          <p>Plan Outfits. Mix & Match. Style Yourself.</p>
        </div>
        
        <div className="header-buttons">
          {}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn btn-gray"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light' : 'Dark'}
          </button>
          
          <button
            onClick={() => setShowSavedOutfits(!showSavedOutfits)}
            className="btn btn-purple"
          >
            {showSavedOutfits ? 'Hide' : 'Show'} Saved Outfits
          </button>
          
          <button onClick={shuffleOutfit} className="btn btn-green">
            <Shuffle size={18} />
            Shuffle
          </button>
          
          <button onClick={saveOutfit} className="btn btn-blue">
            <Save size={18} />
            Save Outfit
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;