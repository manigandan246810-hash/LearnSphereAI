import React, { useState } from 'react';
import { FolderOpen, FileText, Video, Link, Search, UploadCloud, Folder, X, Paperclip } from 'lucide-react';

export function ResourceLibrary() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newResourceCategory, setNewResourceCategory] = useState('Lecture');
  const [selectedFile, setSelectedFile] = useState(null);

  const [resources, setResources] = useState([
    { name: 'PyTorch_Deep_Learning_Cheatsheet.pdf', type: 'PDF', size: '3.4 MB', updated: 'Aug 02, 2026', category: 'Cheatsheet' },
    { name: 'Transformer_Attention_Mechanisms_Lecture.mp4', type: 'Video', size: '420 MB', updated: 'Jul 28, 2026', category: 'Lecture' },
    { name: 'CNN_CIFAR10_Starter_Code.zip', type: 'ZIP', size: '12 MB', updated: 'Jul 25, 2026', category: 'Code Starter' },
    { name: 'Official PyTorch Documentation & Tutorials', type: 'External Link', size: 'Link', updated: 'Jul 20, 2026', category: 'Docs' }
  ]);

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const ext = selectedFile.name.split('.').pop().toUpperCase();
    const typeStr = ext === 'PDF' ? 'PDF' : (['MP4', 'MOV', 'AVI'].includes(ext) ? 'Video' : (['ZIP', 'RAR'].includes(ext) ? 'ZIP' : 'Document'));

    const newRes = {
      name: selectedFile.name,
      type: typeStr,
      size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
      updated: 'Just now',
      category: newResourceCategory
    };

    setResources([newRes, ...resources]);
    alert(`File "${selectedFile.name}" uploaded successfully to Faculty Resource Repository!`);
    setSelectedFile(null);
    setShowUploadModal(false);
  };

  const filtered = resources.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || r.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Faculty Resource Library & Asset Repository
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Central repository for lecture slides, code starters, PDF summaries, and video recordings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search style={{ position: 'absolute', left: '10px', top: '10px', width: '16px', height: '16px', color: '#94a3b8' }} />
            <input type="text" placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.2rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
          </div>

          <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
            <UploadCloud style={{ width: '16px', height: '16px' }} /> Upload Resource
          </button>
        </div>
      </div>

      <div className="ls-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((res, i) => (
            <div key={i} style={{ padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FolderOpen style={{ width: '22px', height: '22px', color: '#4f46e5' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{res.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{res.category} • {res.size} • Updated {res.updated}</div>
                </div>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => alert(`Downloading ${res.name}...`)}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="animate-fade-up" style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Upload New Resource File
              </h3>
              <button onClick={() => setShowUploadModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Resource Category</label>
                <select 
                  value={newResourceCategory} 
                  onChange={(e) => setNewResourceCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.85rem' }}
                >
                  <option value="Lecture">Lecture Slides / Video</option>
                  <option value="Cheatsheet">PDF Reference Cheatsheet</option>
                  <option value="Code Starter">Code Starter / Repository (ZIP)</option>
                  <option value="Assignment">Assignment Starter Material</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Choose File from System</label>
                <input 
                  type="file"
                  required
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
