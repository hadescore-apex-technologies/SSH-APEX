import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../utils/apiClient';
import { useToast } from '../../components/Toast';

const formatDateToReadable = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const formatDateToInput = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    return '';
  }
  return date.toISOString().split('T')[0];
};

const renderFilePreview = (url, file, width = '80px', height = '56px') => {
  if (!url) return null;
  const isImage = file ? file.type.startsWith('image/') : (url.match(/\.(jpg|jpeg|png|webp|gif)/i) || !url.toLowerCase().includes('.pdf'));
  if (isImage) {
    return <img src={url} alt="Preview" style={{ width, height, objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />;
  }
  return (
    <div style={{ width, height, borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    </div>
  );
};

const EMPTY = {
  certificate_id: '',
  student_name: '',
  course_name: '',
  issue_date: '',
  issuer: 'Hadescore Apex & Technologies Certification Board'
};

const inputCls = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', color: 'white', fontSize: '0.88rem', outline: 'none',
  transition: 'border-color 0.25s, box-shadow 0.25s', fontFamily: 'inherit',
};

const Field = ({ label, children, hint }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    {children}
    {hint && <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.2rem', display: 'block' }}>{hint}</span>}
  </div>
);

const AdminCertificates = () => {
  const [certs, setCerts] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_certificates');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hadescore_cache_admin_certificates');
      return !cached;
    } catch {
      return true;
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  const fetchCerts = useCallback(async () => {
    const cached = localStorage.getItem('hadescore_cache_admin_certificates');
    if (!cached) setLoading(true);
    try {
      const res = await apiClient.get('/admin/certificates/');
      setCerts(res.data);
      localStorage.setItem('hadescore_cache_admin_certificates', JSON.stringify(res.data));
    } catch {
      showToast('Failed to load certificates registry', 'error');
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => {
    if (certs && certs.length > 0) {
      localStorage.setItem('hadescore_cache_admin_certificates', JSON.stringify(certs));
    } else {
      localStorage.removeItem('hadescore_cache_admin_certificates');
    }
  }, [certs]);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setPhotoFile(null);
    setPhotoPreview('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      certificate_id: c.certificate_id,
      student_name: c.student_name,
      course_name: c.course_name,
      issue_date: formatDateToInput(c.issue_date),
      issuer: c.issuer || 'Hadescore Apex & Technologies Certification Board'
    });
    setPhotoFile(null);
    setPhotoPreview(c.certificate_photo || '');
    setModalOpen(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "certificate_id,student_name,course_name,issue_date,issuer\n"
      + "HTHAT-2026-AI-9999,John Doe,Advanced AI & ML Pro,2026-06-25,Hadescore Apex & Technologies Certification Board\n"
      + "HTHAT-2026-FS-8888,Jane Smith,Full Stack Web Engineering Cohort,2026-06-25,Hadescore Apex & Technologies Certification Board";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "certificates_bulk_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fd = new FormData();
    fd.append('file', file);
    
    showToast('Uploading bulk data...', 'info');
    
    try {
      const res = await apiClient.post('/admin/certificates/bulk-upload/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { detail, errors, created_count, updated_count } = res.data;
      
      if (errors && errors.length > 0) {
        showToast(`Bulk upload finished. Registered ${created_count}, updated ${updated_count}. Some rows had errors.`, 'warning', 8000);
        console.warn("Bulk upload errors:", errors);
      } else {
        showToast(detail || 'Bulk data imported successfully!', 'success');
      }
      
      fetchCerts();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Bulk upload failed.';
      showToast(msg, 'error');
    } finally {
      e.target.value = '';
    }
  };

  const exportToExcel = () => {
    if (certs.length === 0) {
      showToast('No certificates to export.', 'info');
      return;
    }
    
    const headers = ['Certificate ID', 'Student Name', 'Course / Program', 'Issue Date', 'Issuer Body'];
    const rows = certs.map(c => [
      c.certificate_id,
      c.student_name,
      c.course_name,
      c.issue_date,
      c.issuer
    ]);
    
    const escapeCsvCell = (str) => {
      if (str === null || str === undefined) return '';
      const stringified = String(str);
      if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
        return `"${stringified.replace(/"/g, '""')}"`;
      }
      return stringified;
    };
    
    const csvContent = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map(row => row.map(escapeCsvCell).join(','))
    ].join('\n');
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hadescore_certificates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Registry exported successfully for Excel', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.certificate_id.trim()) {
      showToast('Certificate ID is required', 'error');
      return;
    }
    if (!form.student_name.trim()) {
      showToast('Student Name is required', 'error');
      return;
    }
    if (!form.course_name.trim()) {
      showToast('Course / Program is required', 'error');
      return;
    }
    if (!form.issue_date.trim()) {
      showToast('Issue Date is required', 'error');
      return;
    }
    if (!form.issuer.trim()) {
      showToast('Issuer Body is required', 'error');
      return;
    }
    if (!photoFile && !photoPreview) {
      showToast('Certificate file is required', 'error');
      return;
    }

    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'issue_date') {
        fd.append(k, formatDateToReadable(v));
      } else {
        fd.append(k, v);
      }
    });
    if (photoFile) {
      fd.append('certificate_photo', photoFile);
    }

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
    try {
      if (editingId) {
        await apiClient.patch(`/admin/certificates/${editingId}/`, fd, cfg);
        showToast('Certificate updated successfully', 'success');
      } else {
        await apiClient.post('/admin/certificates/', fd, cfg);
        showToast('Certificate registered successfully', 'success');
      }
      setModalOpen(false);
      fetchCerts();
    } catch (err) {
      const errorData = err.response?.data;
      const msg = errorData ? Object.entries(errorData).map(([k, v]) => `${k}: ${v}`).join(' | ') : 'Save failed';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, certCode) => {
    if (window.confirm(`Delete certificate "${certCode}" permanently?`)) {
      try {
        await apiClient.delete(`/admin/certificates/${id}/`);
        showToast('Certificate record deleted', 'success');
        fetchCerts();
      } catch { showToast('Delete failed', 'error'); }
    }
  };

  const filtered = certs.filter(c =>
    !search || 
    c.certificate_id.toLowerCase().includes(search.toLowerCase()) || 
    c.student_name.toLowerCase().includes(search.toLowerCase()) || 
    c.course_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16,185,129,0.15)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="admin-animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Certificates Registry</h1>
          <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            Manage secure student completion certificates and verification hashes
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={downloadTemplate}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Template
          </button>
          
          <button
            onClick={() => document.getElementById('bulk-file-input').click()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'rgba(0, 229, 255, 0.1)', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(0, 229, 255, 0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)'}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Bulk Import
          </button>
          
          <button
            onClick={exportToExcel}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
            Export Excel
          </button>
          <input 
            type="file" 
            id="bulk-file-input" 
            accept=".csv" 
            style={{ display: 'none' }} 
            onChange={handleBulkUpload} 
          />

          <button
            onClick={openAdd}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #10b981, #00e5ff)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 16px rgba(16,185,129,0.3)', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.45)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.3)'; }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Certificate
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: '380px' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search ID, Student, or Course…"
          style={{ ...inputCls, paddingLeft: '2.4rem', paddingRight: search ? '2rem' : '1rem' }}
          onFocus={e => e.target.style.borderColor = '#10b981'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>}
      </div>

      {/* Table view */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>No certificate records found matching the search criteria.</p>
        </div>
      ) : (
        <div className="admin-table-scroll-wrapper" style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,12,24,0.7)', backdropFilter: 'blur(12px)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Cert ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Student Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Course</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Issue Date</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>File</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1rem', color: '#10b981', fontWeight: '700', fontSize: '0.88rem', fontFamily: 'monospace' }}>{c.certificate_id}</td>
                  <td style={{ padding: '1rem', color: 'white', fontWeight: '600', fontSize: '0.88rem' }}>{c.student_name}</td>
                  <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{c.course_name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{c.issue_date}</td>
                  <td style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {c.certificate_photo ? renderFilePreview(c.certificate_photo, null, '40px', '28px') : (
                      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.78rem' }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => openEdit(c)} style={{ padding: '0.35rem 0.8rem', marginRight: '0.4rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>Edit</button>
                    <button onClick={() => handleDelete(c.id, c.certificate_id)} style={{ padding: '0.35rem 0.8rem', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && createPortal(
        <div
          className="admin-modal-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1rem' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="admin-animate-scale-in admin-modal-panel"
            style={{ width: '100%', maxWidth: '680px', background: '#0a0e1c', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '20px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '1px', background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
                {editingId ? 'Edit Certificate Details' : 'Register New Certificate'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', width: '34px', height: '34px', borderRadius: '999px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              
              <div className="admin-modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Certificate ID */}
                <Field label="Certificate ID" hint="Unique format e.g. HTHAT-2026-AI-04829">
                  <input required style={inputCls} value={form.certificate_id}
                    onChange={e => setForm(p => ({ ...p, certificate_id: e.target.value.toUpperCase() }))}
                    placeholder="HTHAT-2026-AI-04829"
                  />
                </Field>
                {/* Student Name */}
                <Field label="Student Name">
                  <input required style={inputCls} value={form.student_name}
                    onChange={e => setForm(p => ({ ...p, student_name: e.target.value }))}
                    placeholder="e.g. Ramesh Kumar"
                  />
                </Field>
              </div>

              <div className="admin-modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Course Name */}
                <Field label="Course / Program">
                  <input required style={inputCls} value={form.course_name}
                    onChange={e => setForm(p => ({ ...p, course_name: e.target.value }))}
                    placeholder="e.g. Advanced AI & ML Pro"
                  />
                </Field>
                {/* Issue Date */}
                <Field label="Issue Date">
                  <input required type="date" style={{ ...inputCls, colorScheme: 'dark' }} value={form.issue_date}
                    onChange={e => setForm(p => ({ ...p, issue_date: e.target.value }))}
                  />
                </Field>
              </div>

              {/* Issuer */}
              <Field label="Issuer Body">
                <input required style={inputCls} value={form.issuer}
                  onChange={e => setForm(p => ({ ...p, issuer: e.target.value }))}
                  placeholder="Hadescore Apex & Technologies Certification Board"
                />
              </Field>

              {/* File Upload */}
              <Field label="Certificate File (Image, PDF, Document)" hint="Full resolution certificate file for verification">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {photoPreview && renderFilePreview(photoPreview, photoFile)}
                  <input type="file" onChange={handlePhotoChange} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }} />
                </div>
              </Field>

              {/* Submit / Cancel buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button
                  type="submit" disabled={saving}
                  style={{ flex: 2, padding: '0.8rem', background: saving ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #00e5ff)', color: 'white', border: 'none', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '700', boxShadow: '0 4px 16px rgba(16,185,129,0.35)', transition: 'all 0.2s' }}
                >
                  {saving ? 'Registering...' : (editingId ? 'Save Changes' : 'Create Certificate')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminCertificates;
