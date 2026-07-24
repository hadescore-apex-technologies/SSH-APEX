import { useState, useEffect, useCallback } from 'react';
import ResourceListView from './ResourceListView';
import apiClient from '../utils/apiClient';

const TABS = [
  { key: 'contacts',                 resource: 'contacts',                 title: 'Contacts'       },
  { key: 'contact-inquiries',        resource: 'contact-inquiries',        title: 'Inquiries'      },
  { key: 'regular-job-applications', resource: 'regular-job-applications', title: 'Job Apps'       },
  { key: 'internship-applications',  resource: 'internship-applications',  title: 'Intern Apps'    },
  { key: 'enrollments',              resource: 'enrollments',              title: 'Enrollments'    },
  { key: 'project-briefs',           resource: 'project-briefs',           title: 'Project Briefs' },
  { key: 'newsletters',              resource: 'newsletters',              title: 'Newsletters'    },
];

const AdminInbox = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [notifications, setNotifications] = useState({});
  const active = TABS.find(t => t.key === activeTab) || TABS[0];

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await apiClient.get('/admin/notifications/');
      setNotifications(res.data || {});
    } catch (e) {
      // silent fail
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <div className="admin-animate-fade-in">
      {/* Tab Selectors with notification badges */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        marginBottom: '1.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '0.5rem',
        flexWrap: 'wrap',
      }}>
        {TABS.map(t => {
          const isActive = activeTab === t.key;
          const count = notifications[t.key] || 0;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                position: 'relative',
                padding: '0.5rem 1rem',
                paddingRight: count > 0 ? '1.75rem' : '1rem',
                border: 'none',
                background: isActive ? 'rgba(79, 156, 255, 0.12)' : 'transparent',
                color: isActive ? '#4f9cff' : 'rgba(255,255,255,0.45)',
                borderBottom: isActive ? '2px solid #4f9cff' : 'none',
                fontWeight: '700',
                fontSize: '0.8rem',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {t.title}
              {count > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.6rem',
                  fontWeight: '800',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  lineHeight: 1,
                  boxShadow: '0 0 6px rgba(239,68,68,0.6)',
                  animation: 'pulseBadge 1.8s infinite',
                }}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes pulseBadge {
          0%, 100% { transform: scale(1); box-shadow: 0 0 6px rgba(239,68,68,0.6); }
          50% { transform: scale(1.15); box-shadow: 0 0 12px rgba(239,68,68,0.9); }
        }
      `}</style>

      {/* Embedded list view — refresh notifications after any delete */}
      <ResourceListView
        key={active.resource}
        resource={active.resource}
        title={active.title}
        onDeleteSuccess={fetchNotifications}
      />
    </div>
  );
};

export default AdminInbox;
