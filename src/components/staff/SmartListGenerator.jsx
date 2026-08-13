import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Plus, 
  Save, 
  Printer, 
  Download, 
  Users, 
  Calendar, 
  MapPin, 
  Layers, 
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  ChevronDown,
  UserCheck,
  CreditCard,
  Building2,
  GraduationCap,
  BookmarkPlus,
  Trash2,
  Edit3,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';
import { 
  MOCK_ACTIVITY_TYPES, 
  MOCK_DEPARTMENTS, 
  MOCK_YEARS, 
  MOCK_SECTIONS, 
  MOCK_SMART_STUDENT_ROSTER,
  MOCK_SAVED_ACTIVITY_LISTS
} from '../../data/mockData';

export function SmartListGenerator() {
  // Activity Configuration State
  const [selectedActivityType, setSelectedActivityType] = useState('Industrial Visit (IV)');
  const [activityTitle, setActivityTitle] = useState('Industrial Visit to ISRO Satellite Centre');
  const [activityDate, setActivityDate] = useState('2026-09-15');
  const [activityVenue, setActivityVenue] = useState('ISRO Bengaluru Centre, Karnataka');

  // Filter Criteria State
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [minAttendance, setMinAttendance] = useState(75);
  const [filterConsent, setFilterConsent] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Roster Data State (allows inline edits & custom additions)
  const [studentRoster, setStudentRoster] = useState(MOCK_SMART_STUDENT_ROSTER);
  const [savedLists, setSavedLists] = useState(MOCK_SAVED_ACTIVITY_LISTS);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Students Calculation
  const filteredStudents = useMemo(() => {
    return studentRoster.filter(st => {
      const matchDept = selectedDepartment === 'All' || st.department === selectedDepartment;
      const matchYear = selectedYear === 'All' || st.year === selectedYear;
      const matchSec = selectedSection === 'All' || st.section === selectedSection;
      const matchAtt = st.attendance >= minAttendance;
      const matchConsent = filterConsent === 'All' || st.consent === filterConsent;
      const matchPay = filterPayment === 'All' || st.paymentStatus === filterPayment;
      const matchSearch = searchQuery === '' || 
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        st.regNo.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDept && matchYear && matchSec && matchAtt && matchConsent && matchPay && matchSearch;
    });
  }, [studentRoster, selectedDepartment, selectedYear, selectedSection, minAttendance, filterConsent, filterPayment, searchQuery]);

  // Statistics
  const totalCount = filteredStudents.length;
  const grantedCount = filteredStudents.filter(s => s.consent === 'Granted').length;
  const pendingConsentCount = filteredStudents.filter(s => s.consent === 'Pending').length;
  const deniedConsentCount = filteredStudents.filter(s => s.consent === 'Denied').length;
  const paidCount = filteredStudents.filter(s => s.paymentStatus === 'Paid' || s.paymentStatus === 'Waived').length;
  const pendingPaymentCount = filteredStudents.filter(s => s.paymentStatus === 'Pending').length;

  // Toggle Single Student Consent
  const handleToggleConsent = (regNo, newConsent) => {
    setStudentRoster(prev => prev.map(st => st.regNo === regNo ? { ...st, consent: newConsent } : st));
  };

  // Toggle Single Student Payment
  const handleTogglePayment = (regNo, newPayment) => {
    setStudentRoster(prev => prev.map(st => st.regNo === regNo ? { ...st, paymentStatus: newPayment } : st));
  };

  // Inline edit remarks
  const handleUpdateRemarks = (regNo, newRemarks) => {
    setStudentRoster(prev => prev.map(st => st.regNo === regNo ? { ...st, remarks: newRemarks } : st));
  };

  // Select / Deselect All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(filteredStudents.map(s => s.regNo));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleSelectOne = (regNo) => {
    setSelectedStudentIds(prev => 
      prev.includes(regNo) ? prev.filter(id => id !== regNo) : [...prev, regNo]
    );
  };

  // Bulk Actions
  const handleBulkConsent = (status) => {
    if (selectedStudentIds.length === 0) {
      showToast("⚠️ Select at least one student for bulk action.");
      return;
    }
    setStudentRoster(prev => prev.map(st => 
      selectedStudentIds.includes(st.regNo) ? { ...st, consent: status } : st
    ));
    showToast(`Updated consent to '${status}' for ${selectedStudentIds.length} students.`);
  };

  const handleBulkPayment = (status) => {
    if (selectedStudentIds.length === 0) {
      showToast("⚠️ Select at least one student for bulk action.");
      return;
    }
    setStudentRoster(prev => prev.map(st => 
      selectedStudentIds.includes(st.regNo) ? { ...st, paymentStatus: status } : st
    ));
    showToast(`Updated payment status to '${status}' for ${selectedStudentIds.length} students.`);
  };

  // EXCEL EXPORT HANDLER (.xlsx)
  const handleExportExcel = () => {
    if (filteredStudents.length === 0) {
      showToast("⚠️ No students in the current generated list to export.");
      return;
    }

    const reportData = [];
    
    // Header Info Banner
    reportData.push(["LEARNSPHERE AI - ACADEMIC ACTIVITY STUDENT ROSTER"]);
    reportData.push(["Activity Title:", activityTitle || "General Activity"]);
    reportData.push(["Activity Type:", selectedActivityType, "Event Date:", activityDate || "N/A", "Venue:", activityVenue || "Campus"]);
    reportData.push(["Applied Filters:", `Dept: ${selectedDepartment} | Year: ${selectedYear} | Sec: ${selectedSection} | Min Att: ${minAttendance}%`]);
    reportData.push(["Export Time:", new Date().toLocaleString(), "Total Students:", totalCount]);
    reportData.push(["Consent Summary:", `Granted: ${grantedCount} | Pending: ${pendingConsentCount} | Denied: ${deniedConsentCount}`]);
    reportData.push(["Payment Summary:", `Paid/Waived: ${paidCount} | Pending: ${pendingPaymentCount}`]);
    reportData.push([]); // Blank spacing line

    // Column Headers
    reportData.push([
      "Sl. No",
      "Register Number",
      "Student Name",
      "Department",
      "Year",
      "Section",
      "Attendance (%)",
      "Consent Status",
      "Payment Status",
      "Phone Number",
      "Email Address",
      "Remarks / Notes"
    ]);

    // Data Rows
    filteredStudents.forEach((st, idx) => {
      reportData.push([
        idx + 1,
        st.regNo,
        st.name,
        st.department,
        st.year,
        st.section,
        `${st.attendance}%`,
        st.consent,
        st.paymentStatus,
        st.phone,
        st.email,
        st.remarks || "-"
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(reportData);

    // Custom column width sizing
    worksheet['!cols'] = [
      { wch: 8 },  // Sl. No
      { wch: 18 }, // Reg No
      { wch: 22 }, // Name
      { wch: 34 }, // Department
      { wch: 12 }, // Year
      { wch: 12 }, // Section
      { wch: 16 }, // Attendance
      { wch: 16 }, // Consent
      { wch: 16 }, // Payment
      { wch: 16 }, // Phone
      { wch: 28 }, // Email
      { wch: 28 }  // Remarks
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Smart Activity Roster");

    const sanitizedTitle = (activityTitle || 'Smart_Activity_List').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${sanitizedTitle}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    // Confetti celebration
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`📊 Excel spreadsheet exported successfully: ${fileName}`);
  };

  // Save Activity List to Memory
  const handleSaveActivityList = () => {
    const newList = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      title: activityTitle || `${selectedActivityType} List`,
      type: selectedActivityType,
      department: selectedDepartment,
      year: selectedYear,
      section: selectedSection,
      date: activityDate,
      venue: activityVenue,
      minAttendance: minAttendance,
      studentCount: totalCount,
      createdDate: new Date().toISOString().slice(0, 10)
    };

    setSavedLists(prev => [newList, ...prev]);
    showToast(`💾 Saved Activity List: '${newList.title}'`);
  };

  // Load Saved Activity List
  const handleLoadSavedList = (list) => {
    setSelectedActivityType(list.type || 'Industrial Visit (IV)');
    setActivityTitle(list.title || '');
    setSelectedDepartment(list.department || 'All');
    setSelectedYear(list.year || 'All');
    setSelectedSection(list.section || 'All');
    setActivityDate(list.date || '');
    setActivityVenue(list.venue || '');
    setMinAttendance(list.minAttendance || 75);
    setShowSavedModal(false);
    showToast(`Loaded list '${list.title}'`);
  };

  // Print Roster
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="animate-fade-up" style={{
          position: 'fixed',
          top: '84px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #3b82f6'
        }}>
          <Sparkles style={{ width: '18px', height: '18px', color: '#60a5fa' }} />
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #1e40af 100%)',
        borderRadius: '24px',
        padding: '2rem',
        color: '#ffffff',
        boxShadow: '0 12px 30px -4px rgba(30, 64, 175, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{
              backgroundColor: 'rgba(59, 130, 246, 0.25)',
              border: '1px solid rgba(147, 197, 253, 0.3)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#93c5fd',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Faculty Smart Tools
            </span>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>• Excel Export & Roster Engine</span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSpreadsheet style={{ width: '32px', height: '32px', color: '#60a5fa' }} />
            Smart Activity List Generator
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '680px', lineHeight: 1.5 }}>
            Create student rosters for <strong>Industrial Visits (IV), workshops, events, placements, trips, and exams</strong>. Filter by department, section, attendance %, consent status, and payment standing, then export directly to <strong>Excel (.xlsx)</strong>.
          </p>
        </div>

        {/* Export & Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowSavedModal(true)}
            className="btn-secondary" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.65rem 1.1rem', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <BookmarkPlus style={{ width: '18px', height: '18px' }} /> Saved Lists ({savedLists.length})
          </button>

          <button 
            onClick={handleSaveActivityList}
            className="btn-secondary" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.65rem 1.1rem', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <Save style={{ width: '18px', height: '18px' }} /> Save List
          </button>

          <button 
            onClick={handlePrint}
            className="btn-secondary" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.65rem 1.1rem', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <Printer style={{ width: '18px', height: '18px' }} /> Print
          </button>

          <button 
            onClick={handleExportExcel}
            className="btn-primary" 
            style={{ 
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
              color: '#ffffff', 
              border: 'none', 
              padding: '0.65rem 1.35rem', 
              borderRadius: '12px', 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' 
            }}
          >
            <Download style={{ width: '18px', height: '18px' }} /> Export to Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Activity Details & Configuration Card */}
      <div className="ls-card animate-fade-up">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          1. Activity Configuration & Criteria Setup
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          
          {/* Activity Type Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              Activity Category *
            </label>
            <select 
              value={selectedActivityType} 
              onChange={(e) => setSelectedActivityType(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}
            >
              {MOCK_ACTIVITY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Activity Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              Activity Name / Event Title *
            </label>
            <input 
              type="text" 
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              placeholder="e.g. Industrial Visit to ISRO"
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.875rem' }}
            />
          </div>

          {/* Event Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              Event Date
            </label>
            <input 
              type="date" 
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.875rem' }}
            />
          </div>

          {/* Venue / Location */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              Venue / Destination
            </label>
            <input 
              type="text" 
              value={activityVenue}
              onChange={(e) => setActivityVenue(e.target.value)}
              placeholder="e.g. Auditorium / City Center"
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Filter Selection Row */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            🎯 Target Student Criteria Filters
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            
            {/* Department */}
            <div>
              <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Department
              </label>
              <select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.825rem' }}
              >
                <option value="All">All Departments</option>
                {MOCK_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Academic Year
              </label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.825rem' }}
              >
                <option value="All">All Years</option>
                {MOCK_YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Section
              </label>
              <select 
                value={selectedSection} 
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.825rem' }}
              >
                <option value="All">All Sections</option>
                {MOCK_SECTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Min Attendance Threshold */}
            <div>
              <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Min Attendance ({minAttendance}%)
              </label>
              <select 
                value={minAttendance} 
                onChange={(e) => setMinAttendance(Number(e.target.value))}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.825rem' }}
              >
                <option value={0}>All (No Min Limit)</option>
                <option value={70}>70% and Above</option>
                <option value={75}>75% and Above (Standard)</option>
                <option value={80}>80% and Above</option>
                <option value={85}>85% and Above</option>
                <option value={90}>90% and Above (Strict)</option>
              </select>
            </div>

            {/* Consent Status */}
            <div>
              <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Consent Filter
              </label>
              <select 
                value={filterConsent} 
                onChange={(e) => setFilterConsent(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.825rem' }}
              >
                <option value="All">All Consent Statuses</option>
                <option value="Granted">Granted / Approved</option>
                <option value="Pending">Pending Signature</option>
                <option value="Denied">Denied / Rejected</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Payment Standing
              </label>
              <select 
                value={filterPayment} 
                onChange={(e) => setFilterPayment(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.825rem' }}
              >
                <option value="All">All Payment Statuses</option>
                <option value="Paid">Paid / Cleared</option>
                <option value="Pending">Pending Fee</option>
                <option value="Waived">Waived (Scholarship)</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid-responsive animate-fade-up">
        
        <div className="ls-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Generated Roster</span>
            <Users style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            {totalCount} Students
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            Matches criteria selection
          </div>
        </div>

        <div className="ls-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Consent Approved</span>
            <UserCheck style={{ width: '20px', height: '20px', color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>
            {grantedCount} / {totalCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            {pendingConsentCount} Pending, {deniedConsentCount} Denied
          </div>
        </div>

        <div className="ls-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Payment Cleared</span>
            <CreditCard style={{ width: '20px', height: '20px', color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7' }}>
            {paidCount} / {totalCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            {pendingPaymentCount} Pending Fee Receipts
          </div>
        </div>

      </div>

      {/* Roster Table Workspace Card */}
      <div className="ls-card animate-fade-up" style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Table Top Controls Bar */}
        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', width: '16px', height: '16px', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search name or Reg No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.3rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Bulk Action Controls */}
            {selectedStudentIds.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af' }}>
                  {selectedStudentIds.length} Selected:
                </span>
                
                <button 
                  onClick={() => handleBulkConsent('Granted')}
                  style={{ border: 'none', backgroundColor: '#10b981', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Approve Consent
                </button>

                <button 
                  onClick={() => handleBulkPayment('Paid')}
                  style={{ border: 'none', backgroundColor: '#0284c7', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Mark Paid
                </button>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
            Showing <strong>{filteredStudents.length}</strong> of {studentRoster.length} Total Students
          </div>

        </div>

        {/* Table View */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 1.25rem', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
                  />
                </th>
                <th style={{ padding: '0.85rem 1rem' }}>Sl. No</th>
                <th style={{ padding: '0.85rem 1rem' }}>Register No & Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Department & Class</th>
                <th style={{ padding: '0.85rem 1rem' }}>Attendance</th>
                <th style={{ padding: '0.85rem 1rem' }}>Consent Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Payment Standing</th>
                <th style={{ padding: '0.85rem 1rem' }}>Faculty Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>No students matched the selected filters.</div>
                    <div style={{ fontSize: '0.825rem' }}>Try lowering the attendance threshold or resetting department/year filters.</div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => {
                  const isSelected = selectedStudentIds.includes(st.regNo);
                  return (
                    <tr key={st.regNo} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isSelected ? '#f0f9ff' : 'transparent', transition: 'background-color 0.15s ease' }}>
                      
                      {/* Checkbox */}
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleSelectOne(st.regNo)}
                        />
                      </td>

                      {/* Sl. No */}
                      <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#64748b', fontSize: '0.8rem' }}>
                        {idx + 1}
                      </td>

                      {/* Reg No & Name */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{st.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#2563eb', fontFamily: 'monospace', fontWeight: 700 }}>{st.regNo}</div>
                      </td>

                      {/* Department & Class */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.825rem' }}>{st.department}</div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b' }}>{st.year} • {st.section}</div>
                      </td>

                      {/* Attendance % */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontWeight: 800, 
                            color: st.attendance >= 85 ? '#059669' : (st.attendance >= 75 ? '#0284c7' : '#dc2626') 
                          }}>
                            {st.attendance}%
                          </span>
                        </div>
                      </td>

                      {/* Consent Status Dropdown Toggle */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <select 
                          value={st.consent}
                          onChange={(e) => handleToggleConsent(st.regNo, e.target.value)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: st.consent === 'Granted' ? '#d1fae5' : (st.consent === 'Pending' ? '#fef3c7' : '#fee2e2'),
                            color: st.consent === 'Granted' ? '#047857' : (st.consent === 'Pending' ? '#b45309' : '#b91c1c')
                          }}
                        >
                          <option value="Granted">✓ Granted</option>
                          <option value="Pending">⏳ Pending</option>
                          <option value="Denied">✕ Denied</option>
                        </select>
                      </td>

                      {/* Payment Standing Dropdown Toggle */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <select 
                          value={st.paymentStatus}
                          onChange={(e) => handleTogglePayment(st.regNo, e.target.value)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: st.paymentStatus === 'Paid' ? '#e0f2fe' : (st.paymentStatus === 'Waived' ? '#f3e8ff' : '#fff7ed'),
                            color: st.paymentStatus === 'Paid' ? '#0369a1' : (st.paymentStatus === 'Waived' ? '#7e22ce' : '#c2410c')
                          }}
                        >
                          <option value="Paid">💳 Paid</option>
                          <option value="Pending">⏳ Pending</option>
                          <option value="Waived">🎁 Waived</option>
                        </select>
                      </td>

                      {/* Faculty Remarks Inline Edit */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <input 
                          type="text" 
                          value={st.remarks || ''}
                          placeholder="Add remark..."
                          onChange={(e) => handleUpdateRemarks(st.regNo, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.775rem'
                          }}
                        />
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', color: '#64748b' }}>
          <div>
            💡 Tip: Click on <strong>Consent Status</strong> or <strong>Payment Standing</strong> badges to update status in real-time.
          </div>
          <div>
            Excel format includes clean metadata headers for printing and archiving.
          </div>
        </div>

      </div>

      {/* Saved Activity Lists Modal */}
      {showSavedModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="animate-fade-up" style={{ backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '640px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
            
            <div style={{ padding: '1.25rem 1.75rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookmarkPlus style={{ width: '20px', height: '20px' }} /> Saved Activity Lists
              </div>
              <button onClick={() => setShowSavedModal(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto' }}>
              {savedLists.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No saved activity lists found.
                </div>
              ) : (
                savedLists.map((item) => (
                  <div key={item.id} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '2px' }}>
                        Type: {item.type} • Dept: {item.department} • Date: {item.date || 'N/A'}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleLoadSavedList(item)}
                      className="btn-primary" 
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                      Load Configuration
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <button className="btn-secondary" onClick={() => setShowSavedModal(false)}>Close</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
