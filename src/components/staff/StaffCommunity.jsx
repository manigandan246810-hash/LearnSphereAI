import React, { useState, useRef } from 'react';
import { 
  MessageSquare, 
  Users, 
  Paperclip, 
  Send, 
  ThumbsUp, 
  MessageCircle, 
  Download, 
  Search, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Pin, 
  Plus, 
  CheckCircle2,
  Trash2,
  Tag,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_STAFF_MESSAGES = [
  {
    id: 'MSG-101',
    author: 'Dr. Evelyn Vance',
    role: 'HOD',
    title: 'Head of AI & Data Science',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    channel: 'HOD Official Bulletins',
    timestamp: '2 hours ago',
    content: 'Dear Faculty Team, please note that the Mid-Semester Examination rubrics for CS-401 and DS-302 must be finalized in the Evaluation Desk by Friday 5:00 PM. Attached is the department rubric template for reference.',
    attachment: {
      name: 'MidSem_Grading_Rubric_Template_2026.pdf',
      size: '1.4 MB',
      type: 'pdf'
    },
    likes: 14,
    likedByMe: true,
    isPinned: true,
    replies: [
      {
        id: 'R-1',
        author: 'Dr. Sarah Jenkins',
        role: 'Faculty',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        timestamp: '1 hour ago',
        content: 'Received Dr. Vance. The CS-401 rubrics are already updated in the Assignment Builder.'
      }
    ]
  },
  {
    id: 'MSG-102',
    author: 'Dr. Sarah Jenkins',
    role: 'Staff',
    title: 'Associate Professor of AI',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    channel: 'Syllabus & Curriculum',
    timestamp: '4 hours ago',
    content: 'I have uploaded the new PyTorch 2.4 Deep Learning Starter Notebook for Module 3. Feel free to copy this notebook into your lab sessions.',
    attachment: {
      name: 'PyTorch_Deep_Learning_Lab3.ipynb',
      size: '4.8 MB',
      type: 'ipynb'
    },
    likes: 9,
    likedByMe: false,
    isPinned: false,
    replies: []
  },
  {
    id: 'MSG-103',
    author: 'Prof. Marcus Brody',
    role: 'Staff',
    title: 'Assistant Professor of Data Systems',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    channel: 'Research & Grants',
    timestamp: 'Yesterday',
    content: 'We are organizing a joint IEEE AI Research Paper Submission workshop next Tuesday at 3 PM in Seminar Hall B. Anyone interested in co-authoring NLP benchmark papers is welcome to join.',
    attachment: null,
    likes: 18,
    likedByMe: false,
    isPinned: false,
    replies: [
      {
        id: 'R-2',
        author: 'Dr. Evelyn Vance',
        role: 'HOD',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        timestamp: 'Yesterday',
        content: 'Excellent initiative Marcus. Department funding will cover registration fees for accepted IEEE papers.'
      }
    ]
  }
];

const CHANNELS = [
  'All Messages',
  'HOD Official Bulletins',
  'General Faculty Lounge',
  'Syllabus & Curriculum',
  'Exam & Grading Coordination',
  'Research & Grants'
];

export function StaffCommunity({ activeRole = 'Staff', profile }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('learnsphere_staff_community_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error reading saved messages:", e);
      }
    }
    return INITIAL_STAFF_MESSAGES;
  });

  const [activeChannel, setActiveChannel] = useState('All Messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('General Faculty Lounge');
  const [attachedFile, setAttachedFile] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});
  const fileInputRef = useRef(null);

  const saveMessagesToStorage = (updatedMessages) => {
    setMessages(updatedMessages);
    localStorage.setItem('learnsphere_staff_community_messages', JSON.stringify(updatedMessages));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFile({
        name: file.name,
        size: fileSizeMb,
        type: file.name.split('.').pop().toLowerCase(),
        dataUrl: event.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePostMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim() && !attachedFile) return;

    const currentAuthor = profile?.name || (activeRole === 'HOD' ? 'Dr. Evelyn Vance' : 'Dr. Sarah Jenkins');
    const currentTitle = profile?.title || (activeRole === 'HOD' ? 'Head of AI & Data Science' : 'Associate Professor of AI');
    const currentAvatar = profile?.avatar || (activeRole === 'HOD' 
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');

    const newMsg = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      author: currentAuthor,
      role: activeRole,
      title: currentTitle,
      avatar: currentAvatar,
      channel: selectedChannel,
      timestamp: 'Just now',
      content: newMessageText.trim(),
      attachment: attachedFile ? {
        name: attachedFile.name,
        size: attachedFile.size,
        type: attachedFile.type,
        dataUrl: attachedFile.dataUrl
      } : null,
      likes: 0,
      likedByMe: false,
      isPinned: false,
      replies: []
    };

    const updated = [newMsg, ...messages];
    saveMessagesToStorage(updated);

    setNewMessageText('');
    setAttachedFile(null);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
  };

  const handleToggleLike = (msgId) => {
    const updated = messages.map(msg => {
      if (msg.id === msgId) {
        const liked = !msg.likedByMe;
        return {
          ...msg,
          likedByMe: liked,
          likes: liked ? msg.likes + 1 : Math.max(0, msg.likes - 1)
        };
      }
      return msg;
    });
    saveMessagesToStorage(updated);
  };

  const handleAddReply = (msgId) => {
    const text = replyInputs[msgId];
    if (!text || !text.trim()) return;

    const currentAuthor = profile?.name || (activeRole === 'HOD' ? 'Dr. Evelyn Vance' : 'Dr. Sarah Jenkins');
    const currentAvatar = profile?.avatar || (activeRole === 'HOD' 
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');

    const updated = messages.map(msg => {
      if (msg.id === msgId) {
        return {
          ...msg,
          replies: [
            ...msg.replies,
            {
              id: `R-${Date.now().toString().slice(-4)}`,
              author: currentAuthor,
              role: activeRole,
              avatar: currentAvatar,
              timestamp: 'Just now',
              content: text.trim()
            }
          ]
        };
      }
      return msg;
    });

    saveMessagesToStorage(updated);
    setReplyInputs({ ...replyInputs, [msgId]: '' });
  };

  const filteredMessages = messages.filter(m => {
    const matchesChannel = activeChannel === 'All Messages' || m.channel === activeChannel;
    const matchesSearch = !searchQuery.trim() || 
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        borderRadius: '24px',
        padding: '2rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 12px 30px -4px rgba(30, 27, 75, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <Users style={{ width: '30px', height: '30px', color: '#fbbf24' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '2px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck style={{ width: '14px', height: '14px', color: '#a7f3d0' }} /> Staff & HOD Private Community
              </span>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>• Verified Faculty Lounge</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              Faculty & HOD Collaboration Hub
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: '4px 0 0 0', maxWidth: '650px' }}>
              Share course announcements, collaborate on research, coordinate exam schedules, and exchange teaching resources with fellow educators.
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '0.85rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
            {messages.length} Posts
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600, marginTop: '2px' }}>
            Active Faculty Network
          </div>
        </div>
      </div>

      {/* Main Grid: Channels & Feeds */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Sidebar: Channels Filter */}
        <div className="ls-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem' }}>
            Discussion Channels
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {CHANNELS.map(ch => {
              const isActive = activeChannel === ch;
              const count = ch === 'All Messages' 
                ? messages.length 
                : messages.filter(m => m.channel === ch).length;

              return (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#475569',
                    fontWeight: isActive ? 800 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ch === 'All Messages' ? '💬 All Messages' : `# ${ch}`}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#2563eb' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Messages */}
          <div style={{ marginTop: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: '10px', width: '15px', height: '15px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.6rem 0.5rem 2rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Main Content: Post Box & Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Post Message Card */}
          <form onSubmit={handlePostMessage} className="ls-card animate-fade-up" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={profile?.avatar || (activeRole === 'HOD' 
                    ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')}
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }}
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                    {profile?.name || (activeRole === 'HOD' ? 'Dr. Evelyn Vance' : 'Dr. Sarah Jenkins')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Posting as <strong style={{ color: '#2563eb' }}>{activeRole}</strong>
                  </div>
                </div>
              </div>

              {/* Select Channel */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag style={{ width: '15px', height: '15px', color: '#64748b' }} />
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    backgroundColor: '#ffffff',
                    color: '#0f172a'
                  }}
                >
                  {CHANNELS.filter(c => c !== 'All Messages').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Share an announcement, teaching resource, syllabus query, or exam note with fellow staff..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />

            {/* Attached file preview if attached */}
            {attachedFile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#eff6ff',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                fontSize: '0.8rem',
                color: '#1e40af'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                  <span>Attached: <strong>{attachedFile.name}</strong> ({attachedFile.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}
                >
                  ✕ Remove
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept=".pdf,.docx,.ipynb,.py,.zip,.png,.jpg,.txt"
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip style={{ width: '15px', height: '15px' }} /> Attach File / Resource
                </button>
              </div>

              <button
                type="submit"
                disabled={!newMessageText.trim() && !attachedFile}
                className="btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', opacity: (!newMessageText.trim() && !attachedFile) ? 0.6 : 1 }}
              >
                <Send style={{ width: '15px', height: '15px' }} /> Post to Community
              </button>
            </div>
          </form>

          {/* Messages Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <div key={msg.id} className="ls-card animate-fade-up" style={{ padding: '1.35rem' }}>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={msg.avatar}
                        alt={msg.author}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{msg.author}</span>
                          <span className={`chip ${msg.role === 'HOD' ? 'chip-amber' : 'chip-indigo'}`} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                            {msg.role}
                          </span>
                          {msg.isPinned && (
                            <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Pin style={{ width: '12px', height: '12px' }} /> Pinned Notice
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {msg.title} • {msg.timestamp}
                        </div>
                      </div>
                    </div>

                    <span className="chip chip-sky" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      # {msg.channel}
                    </span>
                  </div>

                  {/* Message Content */}
                  <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </p>

                  {/* Attachment Card if present */}
                  {msg.attachment && (
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: '#dbeafe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2563eb'
                        }}>
                          <FileText style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{msg.attachment.name}</div>
                          <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Size: {msg.attachment.size}</div>
                        </div>
                      </div>

                      {msg.attachment.dataUrl ? (
                        <a
                          href={msg.attachment.dataUrl}
                          download={msg.attachment.name}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none' }}
                        >
                          <Download style={{ width: '13px', height: '13px' }} /> Download File
                        </a>
                      ) : (
                        <button
                          onClick={() => alert(`Downloading reference file: ${msg.attachment.name}`)}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          <Download style={{ width: '13px', height: '13px' }} /> Download File
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action Bar (Like & Reply Buttons) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        onClick={() => handleToggleLike(msg.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: 'none',
                          background: msg.likedByMe ? '#dbeafe' : '#f8fafc',
                          color: msg.likedByMe ? '#1d4ed8' : '#64748b',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ThumbsUp style={{ width: '14px', height: '14px', fill: msg.likedByMe ? '#1d4ed8' : 'none' }} />
                        <span>{msg.likes} Likes</span>
                      </button>

                      <button
                        onClick={() => setShowReplyBox({ ...showReplyBox, [msg.id]: !showReplyBox[msg.id] })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: 'none',
                          background: '#f8fafc',
                          color: '#64748b',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        <MessageCircle style={{ width: '14px', height: '14px' }} />
                        <span>{msg.replies.length} Replies</span>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                      ID: {msg.id}
                    </div>
                  </div>

                  {/* Replies List */}
                  {msg.replies.length > 0 && (
                    <div style={{ marginTop: '0.85rem', paddingLeft: '1rem', borderLeft: '3px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {msg.replies.map(reply => (
                        <div key={reply.id} style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                            <img src={reply.avatar} alt={reply.author} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{reply.author}</span>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>• {reply.timestamp}</span>
                          </div>
                          <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0 }}>
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input Box */}
                  {showReplyBox[msg.id] && (
                    <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Write a faculty reply..."
                        value={replyInputs[msg.id] || ''}
                        onChange={(e) => setReplyInputs({ ...replyInputs, [msg.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddReply(msg.id); }}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.825rem' }}
                      />
                      <button
                        onClick={() => handleAddReply(msg.id)}
                        className="btn-primary"
                        style={{ padding: '0.5rem 0.85rem', fontSize: '0.775rem' }}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="ls-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <MessageSquare style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>No Posts Found in this Channel</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Be the first faculty member to start a discussion!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
