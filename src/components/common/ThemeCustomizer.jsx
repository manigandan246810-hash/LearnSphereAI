import React, { useState, useEffect } from 'react';
import { Palette, Moon, Sun, Check, Plus, X, Sparkles } from 'lucide-react';

export const CURATED_COLOR_THEMES = [
  { id: 'blue', name: 'Engineering Blue', primary: '#2563eb', dark: '#1e3a8a', sky: '#0ea5e9' },
  { id: 'indigo', name: 'Indigo Spark', primary: '#4f46e5', dark: '#312e81', sky: '#6366f1' },
  { id: 'emerald', name: 'Emerald Forest', primary: '#059669', dark: '#064e3b', sky: '#10b981' },
  { id: 'purple', name: 'Royal Purple', primary: '#7c3aed', dark: '#4c1d95', sky: '#a855f7' },
  { id: 'rose', name: 'Crimson Rose', primary: '#e11d48', dark: '#881337', sky: '#f43f5e' },
  { id: 'amber', name: 'Sunset Amber', primary: '#d97706', dark: '#78350f', sky: '#f59e0b' },
  { id: 'teal', name: 'Ocean Teal', primary: '#0d9488', dark: '#134e4a', sky: '#14b8a6' },
  { id: 'cyan', name: 'Electric Cyan', primary: '#0891b2', dark: '#164e63', sky: '#06b6d4' },
  { id: 'slate', name: 'Midnight Slate', primary: '#334155', dark: '#0f172a', sky: '#64748b' },
  { id: 'coral', name: 'Flamingo Coral', primary: '#f43f5e', dark: '#9f1239', sky: '#fb7185' }
];

export function ThemeCustomizer({ isOpen, onClose }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('learnsphere_dark_mode') === 'true';
  });

  const [activeColorId, setActiveColorId] = useState(() => {
    return localStorage.getItem('learnsphere_color_id') || 'blue';
  });

  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem('learnsphere_custom_colors');
    return saved ? JSON.parse(saved) : CURATED_COLOR_THEMES;
  });

  const [newCustomHex, setNewCustomHex] = useState('#6366f1');

  // Apply Theme Changes
  const applyTheme = (colorObj, darkState) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-indigo', colorObj.primary);
    root.style.setProperty('--primary-indigo-dark', colorObj.dark);
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${colorObj.dark} 0%, ${colorObj.primary} 50%, ${colorObj.sky || colorObj.primary} 100%)`);
    root.style.setProperty('--shadow-hover', `0 20px 35px -5px ${colorObj.primary}40, 0 10px 15px -5px rgba(15, 23, 42, 0.04)`);

    if (darkState) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  useEffect(() => {
    const currentColor = customColors.find(c => c.id === activeColorId) || customColors[0];
    applyTheme(currentColor, isDarkMode);
  }, [activeColorId, isDarkMode, customColors]);

  const handleSelectTheme = (theme) => {
    setActiveColorId(theme.id);
    localStorage.setItem('learnsphere_color_id', theme.id);
  };

  const handleToggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    localStorage.setItem('learnsphere_dark_mode', String(nextDark));
  };

  const handleAddCustomColor = (e) => {
    e.preventDefault();
    if (!newCustomHex) return;

    const newId = `custom-${Date.now()}`;
    const newTheme = {
      id: newId,
      name: `Custom ${customColors.length - 9}`,
      primary: newCustomHex,
      dark: newCustomHex,
      sky: newCustomHex
    };

    const updated = [...customColors, newTheme];
    // Keep max 10 custom list entries if requested
    setCustomColors(updated);
    localStorage.setItem('learnsphere_custom_colors', JSON.stringify(updated));
    handleSelectTheme(newTheme);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div className="animate-fade-up" style={{
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        borderRadius: '24px',
        padding: '2rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Palette style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                Theme & Color Customizer
              </h2>
              <p style={{ fontSize: '0.775rem', color: isDarkMode ? '#94a3b8' : '#64748b', margin: 0 }}>
                Personalize workspace colors & toggle dark mode.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: isDarkMode ? '#cbd5e1' : '#64748b', padding: '4px' }}
          >
            <X style={{ width: '22px', height: '22px' }} />
          </button>
        </div>

        {/* Mode Switch Card */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '16px',
          backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isDarkMode ? (
              <Moon style={{ width: '22px', height: '22px', color: '#818cf8' }} />
            ) : (
              <Sun style={{ width: '22px', height: '22px', color: '#f59e0b' }} />
            )}
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                {isDarkMode ? 'Dark Theme Active' : 'Light Theme Active'}
              </div>
              <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                Comfortable eye rest mode for evening study sessions
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleDarkMode}
            style={{
              width: '56px',
              height: '30px',
              borderRadius: '9999px',
              backgroundColor: isDarkMode ? '#2563eb' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
              padding: '3px'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              transform: isDarkMode ? 'translateX(26px)' : 'translateX(0)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </button>
        </div>

        {/* 10 Curated Color Swatches Grid */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '0.75rem' }}>
            Choose Primary Accent Palette (10 Preset Themes)
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
            {customColors.slice(0, 10).map((theme) => {
              const isSelected = activeColorId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme)}
                  title={theme.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 0.5rem',
                    borderRadius: '14px',
                    border: isSelected ? `2px solid ${theme.primary}` : `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`,
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: theme.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: `0 4px 10px ${theme.primary}50`
                  }}>
                    {isSelected && <Check style={{ width: '18px', height: '18px', strokeWidth: 3 }} />}
                  </div>
                  <span style={{ fontSize: '0.675rem', fontWeight: 700, marginTop: '6px', textAlign: 'center', color: isDarkMode ? '#cbd5e1' : '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {theme.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add User Custom Color */}
        <form onSubmit={handleAddCustomColor} style={{
          padding: '1rem',
          borderRadius: '14px',
          border: `1px dashed ${isDarkMode ? '#334155' : '#cbd5e1'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Custom Accent Color:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="color" 
              value={newCustomHex} 
              onChange={(e) => setNewCustomHex(e.target.value)} 
              style={{ width: '36px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
              <Plus style={{ width: '14px', height: '14px' }} /> Add Color
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
