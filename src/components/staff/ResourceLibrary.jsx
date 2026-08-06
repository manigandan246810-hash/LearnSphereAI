import React, { useState } from 'react';
import { FolderOpen, FileText, Video, Link, Search, UploadCloud, Folder } from 'lucide-react';

export function ResourceLibrary() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const resources = [
    { name: 'PyTorch_Deep_Learning_Cheatsheet.pdf', type: 'PDF', size: '3.4 MB', updated: 'Aug 02, 2026', category: 'Cheatsheet' },
    { name: 'Transformer_Attention_Mechanisms_Lecture.mp4', type: 'Video', size: '420 MB', updated: 'Jul 28, 2026', category: 'Lecture' },
    { name: 'CNN_CIFAR10_Starter_Code.zip', type: 'ZIP', size: '12 MB', updated: 'Jul 25, 2026', category: 'Code Starter' },
    { name: 'Official PyTorch Documentation & Tutorials', type: 'External Link', size: 'Link', updated: 'Jul 20, 2026', category: 'Docs' }
  ];

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

          <button className="btn-primary">
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
              <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>Download</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
