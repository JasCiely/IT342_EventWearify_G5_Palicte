import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  MoreHorizontal,
  Filter,
  Eye,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import '../../../components/css/adminDashboard/CustomersFragment.css';

const MOCK_CUSTOMERS = [
  { id: '1',  firstName: 'Maria',  lastName: 'Santos',     email: 'maria.santos@gmail.com',    active: true,  role: 'USER', createdAt: '2025-01-12' },
  { id: '2',  firstName: 'Juan',   lastName: 'Dela Cruz',  email: 'juan.delacruz@yahoo.com',   active: true,  role: 'USER', createdAt: '2025-02-03' },
  { id: '3',  firstName: 'Ana',    lastName: 'Reyes',      email: 'ana.reyes@gmail.com',       active: false, role: 'USER', createdAt: '2025-02-18' },
  { id: '4',  firstName: 'Carlo',  lastName: 'Mendoza',    email: 'carlo.mendoza@gmail.com',   active: true,  role: 'USER', createdAt: '2025-03-01' },
  { id: '5',  firstName: 'Liza',   lastName: 'Bautista',   email: 'liza.bautista@gmail.com',   active: true,  role: 'USER', createdAt: '2025-03-14' },
  { id: '6',  firstName: 'Mark',   lastName: 'Torres',     email: 'mark.torres@outlook.com',   active: false, role: 'USER', createdAt: '2025-03-22' },
  { id: '7',  firstName: 'Grace',  lastName: 'Villanueva', email: 'grace.v@gmail.com',         active: true,  role: 'USER', createdAt: '2025-04-05' },
  { id: '8',  firstName: 'Kevin',  lastName: 'Aquino',     email: 'kevin.aquino@gmail.com',    active: true,  role: 'USER', createdAt: '2025-04-19' },
  { id: '9',  firstName: 'Sofia',  lastName: 'Castro',     email: 'sofia.castro@gmail.com',    active: true,  role: 'USER', createdAt: '2025-04-22' },
  { id: '10', firstName: 'Diego',  lastName: 'Ramos',      email: 'diego.ramos@yahoo.com',     active: false, role: 'USER', createdAt: '2025-04-28' },
  { id: '11', firstName: 'Isabel', lastName: 'Flores',     email: 'isabel.flores@gmail.com',   active: true,  role: 'USER', createdAt: '2025-05-01' },
  { id: '12', firstName: 'Marco',  lastName: 'Navarro',    email: 'marco.navarro@outlook.com', active: true,  role: 'USER', createdAt: '2025-05-05' },
];

const PAGE_SIZE = 8;

const getInitials = (f, l) => `${f?.[0] ?? ''}${l?.[0] ?? ''}`.toUpperCase();
const formatDate  = (s) =>
  new Date(s).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });

const AVATAR_COLORS = ['#6b2d39','#8b3a4a','#a34f60','#4a1f28','#7a3040','#5c2433','#92455a','#3d1820'];
const getAvatarColor = (id) => AVATAR_COLORS[parseInt(id, 10) % AVATAR_COLORS.length];

const getPageNumbers = (page, totalPages) => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  let start = Math.max(1, page - 2);
  let end   = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Renders the dropdown at the correct screen position via a portal,
// completely escaping any overflow:hidden/auto ancestor.
function DropdownPortal({ anchorRef, onClose, children }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({
      top:  rect.bottom + window.scrollY + 6,
      left: rect.right  + window.scrollX - 210, // 210 = min-width of dropdown
    });
  }, [anchorRef]);

  useEffect(() => {
    const handler = (e) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [anchorRef, onClose]);

  return ReactDOM.createPortal(
    <div className="cf-dropdown" style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 9999 }}>
      {children}
    </div>,
    document.body
  );
}

export default function CustomersFragment() {
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [page,     setPage]     = useState(1);
  const [openMenu, setOpenMenu] = useState(null);
  // one ref per row button so the portal can measure position
  const btnRefs = useRef({});

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    const matchSearch = `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'active' ? c.active : !c.active);
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNums   = getPageNumbers(page, totalPages);

  const totalActive   = MOCK_CUSTOMERS.filter(c => c.active).length;
  const totalInactive = MOCK_CUSTOMERS.filter(c => !c.active).length;

  return (
    <div className="cf-root">

      {/* ── Title + Stats + Toolbar — never moves ── */}
      <div className="cf-top">
        <div className="cf-header">
          <div>
            <h2 className="cf-title">Customers</h2>
            <p className="cf-subtitle">All registered users on the platform</p>
          </div>
        </div>

        <div className="cf-stats">
          <div className="cf-stat-card">
            <div className="cf-stat-icon total"><Users size={18} /></div>
            <div>
              <p className="cf-stat-value">{MOCK_CUSTOMERS.length}</p>
              <p className="cf-stat-label">Total Customers</p>
            </div>
          </div>
          <div className="cf-stat-card">
            <div className="cf-stat-icon active"><UserCheck size={18} /></div>
            <div>
              <p className="cf-stat-value">{totalActive}</p>
              <p className="cf-stat-label">Active</p>
            </div>
          </div>
          <div className="cf-stat-card">
            <div className="cf-stat-icon inactive"><UserX size={18} /></div>
            <div>
              <p className="cf-stat-value">{totalInactive}</p>
              <p className="cf-stat-label">Inactive</p>
            </div>
          </div>
        </div>

        <div className="cf-toolbar">
          <div className="cf-search-wrap">
            <Search size={15} className="cf-search-icon" />
            <input
              className="cf-search"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="cf-filters">
            <Filter size={14} style={{ color: '#999' }} />
            {['all', 'active', 'inactive'].map(f => (
              <button
                key={f}
                className={`cf-filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => { setFilter(f); setPage(1); }}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table card — never moves, rows scroll inside ── */}
      <div className="cf-table-card">

        {/* Header row — locked, never scrolls */}
        <div className="cf-thead">
          <div className="cf-thead-row">
            <span className="cf-th col-customer">Customer</span>
            <span className="cf-th col-email">Email</span>
            <span className="cf-th col-joined">Joined</span>
            <span className="cf-th col-status">Status</span>
            <span className="cf-th col-action"></span>
          </div>
        </div>

        {/* Rows — only this part scrolls */}
        <div className="cf-tbody">
          {paginated.length === 0 ? (
            <div className="cf-empty">No customers found.</div>
          ) : (
            paginated.map((c, i) => (
              <div key={c.id} className="cf-row" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="cf-td col-customer">
                  <div className="cf-customer-cell">
                    <div className="cf-avatar" style={{ background: getAvatarColor(c.id) }}>
                      {getInitials(c.firstName, c.lastName)}
                    </div>
                    <span className="cf-name">{c.firstName} {c.lastName}</span>
                  </div>
                </div>
                <div className="cf-td col-email">
                  <div className="cf-email-cell">
                    <Mail size={13} className="cf-email-icon" />
                    {c.email}
                  </div>
                </div>
                <div className="cf-td col-joined">
                  <div className="cf-date-cell">
                    <Calendar size={13} className="cf-date-icon" />
                    {formatDate(c.createdAt)}
                  </div>
                </div>
                <div className="cf-td col-status">
                  <span className={`cf-badge ${c.active ? 'active' : 'inactive'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="cf-td col-action">
                  <div className="cf-actions-wrap">
                    <button
                      ref={el => btnRefs.current[c.id] = el}
                      className={`cf-menu-btn${openMenu === c.id ? ' open' : ''}`}
                      onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenu === c.id && (
                      <DropdownPortal
                        anchorRef={{ current: btnRefs.current[c.id] }}
                        onClose={() => setOpenMenu(null)}
                      >
                        <div className="cf-dropdown-header">
                          <div className="cf-dropdown-avatar" style={{ background: getAvatarColor(c.id) }}>
                            {getInitials(c.firstName, c.lastName)}
                          </div>
                          <div className="cf-dropdown-info">
                            <span className="cf-dropdown-name">{c.firstName} {c.lastName}</span>
                            <span className={`cf-dropdown-status ${c.active ? 'active' : 'inactive'}`}>
                              {c.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="cf-dropdown-divider" />
                        <button className="cf-dropdown-item" onClick={() => setOpenMenu(null)}>
                          <Eye size={14} className="cf-dropdown-icon" />
                          View Details
                        </button>
                        <button className={`cf-dropdown-item ${c.active ? 'danger' : 'success'}`} onClick={() => setOpenMenu(null)}>
                          {c.active
                            ? <><UserMinus size={14} className="cf-dropdown-icon" />Deactivate</>
                            : <><UserPlus  size={14} className="cf-dropdown-icon" />Activate</>
                          }
                        </button>
                      </DropdownPortal>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Pagination — never moves ── */}
      {filtered.length > 0 && (
        <div className="cf-pagination">
          <span className="cf-page-info">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="cf-page-btns">
            <button className="cf-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={15} />
            </button>

            {pageNums[0] > 1 && (
              <>
                <button className="cf-page-btn num" onClick={() => setPage(1)}>1</button>
                {pageNums[0] > 2 && <span className="cf-page-ellipsis">…</span>}
              </>
            )}

            {pageNums.map(n => (
              <button
                key={n}
                className={`cf-page-btn num${page === n ? ' active' : ''}`}
                onClick={() => setPage(n)}
              >{n}</button>
            ))}

            {pageNums.at(-1) < totalPages && (
              <>
                {pageNums.at(-1) < totalPages - 1 && <span className="cf-page-ellipsis">…</span>}
                <button className="cf-page-btn num" onClick={() => setPage(totalPages)}>{totalPages}</button>
              </>
            )}

            <button className="cf-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}