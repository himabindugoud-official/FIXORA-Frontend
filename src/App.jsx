import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import { apiRequest } from './api';

const AdminCharts = lazy(() => import('./DashboardCharts.jsx'));

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('fixora-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setSession = (user, token) => {
  localStorage.setItem('fixora-user', JSON.stringify(user));
  localStorage.setItem('fixora-token', token);
};

const clearSession = () => {
  localStorage.removeItem('fixora-user');
  localStorage.removeItem('fixora-token');
};

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem('fixora-token') || '');

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('fixora-user', JSON.stringify(user));
      localStorage.setItem('fixora-token', token);
    }
  }, [user, token]);

  const logout = () => {
    clearSession();
    setUser(null);
    setToken('');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage user={user} logout={logout} />} />
        <Route
          path="/login"
          element={<AuthPage mode="login" user={user} onAuthenticated={setUser} setToken={setToken} />}
        />
        <Route
          path="/register"
          element={<AuthPage mode="register" user={user} onAuthenticated={setUser} setToken={setToken} />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage user={user} logout={logout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/complaints/new"
          element={user ? <NewComplaintPage user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/complaints/:id"
          element={user ? <ComplaintDetailPage /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function LandingPage({ user, logout }) {
  return (
    <div className="app-shell app-shell--landing">
      <header className="topbar">
        <Link to="/" className="brand">
          Fixora<span>.</span>
        </Link>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="ghost-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="primary-btn small-btn">Get Started</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">SMART COMPLAINT MANAGEMENT</span>
            <h1>
              Problems happen.
              <span> Fixora fixes them.</span>
            </h1>
            <p>
              Report issues, track complaint lifecycle progress, and resolve service requests faster with an
              intelligent platform built for modern teams.
            </p>

            <div className="cta-row">
              <Link to={user ? '/dashboard' : '/register'} className="primary-btn">
                Submit a Complaint
              </Link>
              <Link to={user ? '/dashboard' : '/login'} className="secondary-btn">
                Track Complaint
              </Link>
            </div>

            <div className="stats-row">
              <div>
                <strong>24/7</strong>
                <span>Complaint Access</span>
              </div>
              <div>
                <strong>Smart</strong>
                <span>Classification</span>
              </div>
              <div>
                <strong>Real-time</strong>
                <span>Status Tracking</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="mini-card">
              <div className="mini-header">
                <div>
                  <span className="small-label">YOUR DASHBOARD</span>
                  <h3>Complaint Overview</h3>
                </div>
                <span className="status-pill ok">Online</span>
              </div>

              <div className="summary-grid">
                <div className="summary-box">
                  <span>Total</span>
                  <strong>12</strong>
                </div>
                <div className="summary-box">
                  <span>Pending</span>
                  <strong>03</strong>
                </div>
                <div className="summary-box">
                  <span>Resolved</span>
                  <strong>09</strong>
                </div>
              </div>

              <div className="complaint-line">
                <div className="complaint-icon electrical">⚡</div>
                <div className="complaint-text">
                  <h4>Electrical Issue</h4>
                  <p>FIX-1001 · Hostel Block A</p>
                </div>
                <span className="tag warning">Pending</span>
              </div>

              <div className="complaint-line">
                <div className="complaint-icon plumbing">💧</div>
                <div className="complaint-text">
                  <h4>Water Leakage</h4>
                  <p>FIX-1002 · Hostel Block B</p>
                </div>
                <span className="tag success">Resolved</span>
              </div>

              <div className="progress-block">
                <div className="progress-label">
                  <span>Resolution Progress</span>
                  <strong>75%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="section-heading">
            <span>WHY FIXORA?</span>
            <h2>One platform. Smarter resolutions.</h2>
            <p>Everything needed to report, manage, and resolve issues efficiently.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Easy Reporting</h3>
              <p>Submit requests through a simple flow designed for users and staff.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Classification</h3>
              <p>Power smart categorization and priority recommendations before assignment.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Live Tracking</h3>
              <p>Monitor status transitions, ownership, and resolution progress in real time.</p>
            </article>
          </div>
        </section>
      </main>

      <footer id="about" className="footer">
        <Link to="/" className="brand">
          Fixora<span>.</span>
        </Link>
        <p>Making complaint management smarter, simpler, and more transparent.</p>
        <span>© 2026 Fixora. All rights reserved.</span>
      </footer>
    </div>
  );
}

function AuthPage({ mode, onAuthenticated, setToken, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginRole, setLoginRole] = useState('USER');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (mode === 'register') {
      const fullName = form.fullName.trim();
      const email = form.email.trim();
      const phoneNumber = form.phoneNumber.trim();

      if (!fullName) {
        setError('Enter your full name.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Enter a valid email address.');
        return;
      }
      if (!/^\+?[0-9]{7,15}$/.test(phoneNumber)) {
        setError('Enter a phone number with 7 to 15 digits and an optional leading +.');
        return;
      }
      if (!form.password.trim() || form.password.length < 8 || form.password.length > 72) {
        setError('Password must be between 8 and 72 characters.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload =
        mode === 'login'
          ? { email: form.email.trim(), password: form.password }
          : {
              fullName: form.fullName.trim(),
              email: form.email.trim(),
              password: form.password,
              confirmPassword: form.confirmPassword,
              phoneNumber: form.phoneNumber.trim(),
            };

      const result = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (mode === 'register') {
        setForm((current) => ({ ...current, password: '', confirmPassword: '' }));
        navigate('/login', {
          replace: true,
          state: { registrationNotice: `Account created for ${result.email}. Sign in to continue.` },
        });
        return;
      }

      if (!result?.token) {
        throw new Error('Authentication response was incomplete.');
      }

      const authenticatedRole = String(result.user?.role ?? result.role ?? 'USER').trim().toUpperCase();
      const nextUser = {
        id: result.user?.id ?? result.id,
        fullName: result.user?.fullName ?? result.fullName ?? form.fullName,
        email: result.user?.email ?? result.email ?? form.email,
        role: authenticatedRole,
        phoneNumber: result.user?.phoneNumber ?? result.phoneNumber ?? '',
      };

      if (mode === 'login' && nextUser.role !== loginRole.trim().toUpperCase()) {
        const roleName = nextUser.role.charAt(0) + nextUser.role.slice(1).toLowerCase();
        throw new Error(`These credentials are for the ${roleName} role. Select ${roleName} and try again.`);
      }

      setSession(nextUser, result.token);
      onAuthenticated(nextUser);
      setToken(result.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="brand centered-brand">
          Fixora<span>.</span>
        </Link>

        <div className="auth-header">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p>{mode === 'login' ? 'Login to manage complaints' : 'Start resolving issues faster'}</p>
        </div>

        {mode === 'login' && location.state?.registrationNotice && (
          <div className="success-box auth-notice" role="status">{location.state.registrationNotice}</div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate={mode === 'register'}
          className={`auth-form${mode === 'register' ? ' auth-form--register' : ''}`}
        >
          {mode === 'register' && (
            <>
              <label className="auth-field--wide">
                Full name
                <input name="fullName" value={form.fullName} onChange={handleChange} maxLength={150} autoComplete="name" required />
              </label>
              <label>
                Phone number
                <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} pattern={String.raw`\+?[0-9]{7,15}`} maxLength={16} placeholder="+15550123456" autoComplete="tel" required />
              </label>
            </>
          )}

          {mode === 'login' && (
            <label>
              Sign in as
              <select value={loginRole} onChange={(event) => setLoginRole(event.target.value)}>
                <option value="USER">User</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
          )}

          <label className={mode === 'register' ? 'auth-field--wide' : undefined}>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} maxLength={150} autoComplete="email" required />
          </label>

          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} minLength={8} maxLength={72} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
          </label>

          {mode === 'register' && (
            <label>
              Confirm password
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} minLength={8} maxLength={72} autoComplete="new-password" required />
            </label>
          )}

          {error && <div className="error-box auth-field--wide" role="alert">{error}</div>}

          <button type="submit" className="primary-btn full-width auth-field--wide" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="switch-text">
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
          <Link to={mode === 'login' ? '/register' : '/login'}>
            {mode === 'login' ? 'Register' : 'Login'}
          </Link>
        </p>
      </div>
    </div>
  );
}

function DashboardPage({ user, logout }) {
  const [complaints, setComplaints] = useState([]);
  const [summary, setSummary] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [staffForm, setStaffForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });
  const [staffFormError, setStaffFormError] = useState('');
  const [staffFormNotice, setStaffFormNotice] = useState('');
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [resolutionNotes, setResolutionNotes] = useState({});
  const [actionError, setActionError] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '', priority: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const navigate = useNavigate();
  const roleLabel = user.role === 'ADMIN' ? 'Administrator' : user.role === 'STAFF' ? 'Staff' : 'User';
  const complaintListEndpoint = user.role === 'STAFF' ? '/staff/complaints' : '/complaints';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [complaintList, summaryResp, staffList] = await Promise.all([
          apiRequest(complaintListEndpoint),
          user.role === 'ADMIN' ? apiRequest('/admin/dashboard') : Promise.resolve(null),
          user.role === 'ADMIN' ? apiRequest('/admin/staff') : Promise.resolve([]),
        ]);

        setComplaints(Array.isArray(complaintList) ? complaintList : []);
        setSummary(summaryResp);
        setStaffMembers(Array.isArray(staffList) ? staffList : []);
      } catch (error) {
        setActionError(error.message || 'Could not load complaints.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [complaintListEndpoint, refreshVersion, user.role]);

  const replaceComplaint = (updatedComplaint) => {
    setComplaints((current) => current.map((complaint) =>
      complaint.id === updatedComplaint.id ? updatedComplaint : complaint
    ));
  };

  const handleStaffFormChange = (event) => {
    const { name, value } = event.target;
    setStaffForm((current) => ({ ...current, [name]: value }));
    setStaffFormError('');
    setStaffFormNotice('');
  };

  const createStaffAccount = async (event) => {
    event.preventDefault();
    setStaffFormError('');
    setStaffFormNotice('');

    const fullName = staffForm.fullName.trim();
    const email = staffForm.email.trim();
    const phoneNumber = staffForm.phoneNumber.trim();
    if (!fullName) {
      setStaffFormError('Enter the staff member’s full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStaffFormError('Enter a valid email address.');
      return;
    }
    if (staffForm.password.length < 12 || staffForm.password.length > 72) {
      setStaffFormError('Staff passwords must be between 12 and 72 characters.');
      return;
    }
    if (!/^\+?[0-9]{7,15}$/.test(phoneNumber)) {
      setStaffFormError('Enter a phone number with 7 to 15 digits and an optional leading +.');
      return;
    }

    setCreatingStaff(true);
    try {
      const staff = await apiRequest('/admin/staff', {
        method: 'POST',
        body: JSON.stringify({ ...staffForm, fullName, email, phoneNumber }),
      });
      setStaffMembers((current) => [...current, staff]);
      setStaffForm({ fullName: '', email: '', password: '', phoneNumber: '' });
      setStaffFormNotice(`Staff account created for ${staff.email}.`);
    } catch (error) {
      setStaffFormError(error.message || 'Could not create the staff account.');
    } finally {
      setCreatingStaff(false);
    }
  };

  const assignComplaint = async (complaint) => {
    const staffId = selectedStaff[complaint.id] || complaint.assignedToId;
    if (!staffId) return;

    try {
      setActionError('');
      const updated = await apiRequest(`/admin/complaints/${complaint.id}/assign?staffId=${staffId}`, { method: 'PATCH' });
      replaceComplaint(updated);
    } catch (error) {
      setActionError(error.message || 'Could not assign complaint.');
    }
  };

  const startComplaint = async (complaint) => {
    try {
      setActionError('');
      const updated = await apiRequest(`/staff/complaints/${complaint.id}/status?status=IN_PROGRESS`, { method: 'PATCH' });
      replaceComplaint(updated);
    } catch (error) {
      setActionError(error.message || 'Could not start complaint.');
    }
  };

  const resolveComplaint = async (complaint) => {
    const notes = resolutionNotes[complaint.id]?.trim();
    if (!notes) {
      setActionError('Add resolution notes before marking this complaint resolved.');
      return;
    }

    try {
      setActionError('');
      const updated = await apiRequest(
        `/staff/complaints/${complaint.id}/resolution?resolutionNotes=${encodeURIComponent(notes)}`,
        { method: 'POST' }
      );
      replaceComplaint(updated);
    } catch (error) {
      setActionError(error.message || 'Could not resolve complaint.');
    }
  };

  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter((item) => ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'REOPENED'].includes(item.status)).length;
  const resolvedCount = complaints.filter((item) => ['RESOLVED', 'CLOSED'].includes(item.status)).length;
  const matchingComplaints = complaints.filter((complaint) => {
    const searchText = filters.search.trim().toLowerCase();
    const searchableText = [complaint.code, complaint.title, complaint.location, complaint.category, complaint.createdBy?.fullName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return (!searchText || searchableText.includes(searchText))
      && (!filters.category || complaint.category === filters.category)
      && (!filters.priority || complaint.priority === filters.priority)
      && (!filters.status || complaint.status === filters.status);
  });
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(matchingComplaints.length / pageSize));
  const visibleComplaints = matchingComplaints.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="app-shell">
      <header className="topbar dashboard-bar">
        <Link to="/" className="brand">
          Fixora<span>.</span>
        </Link>

        <nav className="nav-links nav-links--dashboard">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/complaints/new">New complaint</Link>
          <button className="ghost-btn" onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="dashboard-layout">
        <section className="welcome-panel">
          <div>
            <span className="eyebrow">{roleLabel} workspace</span>
            <h2>{user.fullName || 'User'}</h2>
          </div>
          {user.role !== 'STAFF' && (
            <button className="primary-btn" onClick={() => navigate('/complaints/new')}>+ Raise complaint</button>
          )}
        </section>

        <section className="stats-grid">
          <article className="stat-card accent-blue">
            <span>Total issues</span>
            <strong>{loading ? '...' : totalComplaints}</strong>
          </article>
          <article className="stat-card accent-orange">
            <span>Pending</span>
            <strong>{loading ? '...' : pendingCount}</strong>
          </article>
          <article className="stat-card accent-green">
            <span>Resolved</span>
            <strong>{loading ? '...' : resolvedCount}</strong>
          </article>
        </section>

        {summary && (
          <section className="stats-grid summary-grid--admin">
            <article className="stat-card accent-gray">
              <span>Open complaints</span>
              <strong>{summary.openComplaints ?? 0}</strong>
            </article>
            <article className="stat-card accent-gray">
              <span>Resolved</span>
              <strong>{summary.resolvedComplaints ?? 0}</strong>
            </article>
            <article className="stat-card accent-gray">
              <span>Overdue</span>
              <strong>{summary.overdueComplaints ?? 0}</strong>
            </article>
          </section>
        )}

        {user.role === 'ADMIN' && (
          <section className="panel-list staff-management">
            <div className="panel-head">
              <div>
                <h3>Staff management</h3>
                <p className="muted">Create staff accounts for complaint assignment.</p>
              </div>
            </div>
            <form className="complaint-form" onSubmit={createStaffAccount} noValidate>
              <div className="two-col">
                <label>
                  Full name
                  <input name="fullName" autoComplete="name" maxLength={150} value={staffForm.fullName} onChange={handleStaffFormChange} required />
                </label>
                <label>
                  Email address
                  <input name="email" type="email" autoComplete="email" maxLength={150} value={staffForm.email} onChange={handleStaffFormChange} required />
                </label>
                <label>
                  Phone number
                  <input name="phoneNumber" type="tel" autoComplete="tel" pattern={String.raw`\+?[0-9]{7,15}`} maxLength={16} placeholder="+15550123456" value={staffForm.phoneNumber} onChange={handleStaffFormChange} required />
                </label>
                <label>
                  Temporary password
                  <input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={72} value={staffForm.password} onChange={handleStaffFormChange} required />
                </label>
              </div>
              {staffFormError && <div className="error-box" role="alert">{staffFormError}</div>}
              {staffFormNotice && <div className="success-box" role="status">{staffFormNotice}</div>}
              <button className="primary-btn" type="submit" disabled={creatingStaff}>
                {creatingStaff ? 'Creating account...' : 'Create staff account'}
              </button>
            </form>

            <div className="staff-directory" aria-label="Staff accounts">
              <h4>Staff accounts</h4>
              {staffMembers.length === 0 ? <p className="muted">No staff accounts have been created.</p> : (
                <ul>
                  {staffMembers.map((staff) => (
                    <li key={staff.id}>
                      <strong>{staff.fullName}</strong>
                      <span>{staff.email}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {summary && (
          <Suspense fallback={<p className="muted">Loading analytics...</p>}>
            <AdminCharts summary={summary} />
          </Suspense>
        )}

        <section className="panel-list">
          <div className="panel-head">
            <h3>{user.role === 'STAFF' ? 'Assigned cases' : user.role === 'ADMIN' ? 'All complaints' : 'My complaints'}</h3>
            <button className="ghost-btn" onClick={() => setRefreshVersion((version) => version + 1)}>Refresh</button>
          </div>

          <div className="complaint-filters">
            <label>
              Search
              <input
                type="search"
                value={filters.search}
                onChange={(event) => updateFilter('search', event.target.value)}
                placeholder="ID, title, location, or reporter"
              />
            </label>
            <label>
              Category
              <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
                <option value="">All categories</option>
                {['ELECTRICAL', 'PLUMBING', 'NETWORK', 'CLEANING', 'MAINTENANCE', 'SAFETY', 'FOOD_CANTEEN', 'OTHER'].map((category) => (
                  <option key={category} value={category}>{category.replace('_', ' ')}</option>
                ))}
              </select>
            </label>
            <label>
              Priority
              <select value={filters.priority} onChange={(event) => updateFilter('priority', event.target.value)}>
                <option value="">All priorities</option>
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
                <option value="">All statuses</option>
                {['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED', 'REJECTED'].map((status) => (
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>
            </label>
          </div>

          {actionError && <div className="error-box">{actionError}</div>}
          {loading ? (
            <p className="muted">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="muted">No complaints yet. Raise your first request.</p>
          ) : matchingComplaints.length === 0 ? (
            <p className="muted">No complaints match these filters.</p>
          ) : (
            visibleComplaints.map((complaint) => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-main">
                  <div className="complaint-chip">{complaint.category || 'General'}</div>
                  <h4>{complaint.title}</h4>
                  <p>{complaint.description}</p>
                  {complaint.createdBy?.fullName && <small>Reported by {complaint.createdBy.fullName}</small>}
                  {complaint.assignedToName && <small>Assigned to {complaint.assignedToName}</small>}
                </div>
                <div className="complaint-meta">
                  <span className={`status-badge status-${(complaint.status || 'SUBMITTED').toLowerCase()}`}>
                    {complaint.status || 'SUBMITTED'}
                  </span>
                  <Link className="complaint-code-link" to={`/complaints/${complaint.id}`}>
                    {complaint.code || 'View complaint'}
                  </Link>
                  {user.role === 'ADMIN' && (
                    <div className="complaint-actions">
                      <select
                        aria-label={`Assign ${complaint.code} to staff`}
                        value={selectedStaff[complaint.id] ?? complaint.assignedToId ?? ''}
                        onChange={(event) => setSelectedStaff((current) => ({ ...current, [complaint.id]: event.target.value }))}
                      >
                        <option value="">Choose staff member</option>
                        {staffMembers.map((staff) => (
                          <option key={staff.id} value={staff.id}>{staff.fullName}</option>
                        ))}
                      </select>
                      <button
                        className="secondary-btn small-btn"
                        onClick={() => assignComplaint(complaint)}
                        disabled={!staffMembers.length || !(selectedStaff[complaint.id] || complaint.assignedToId)}
                      >
                        Assign
                      </button>
                    </div>
                  )}
                  {user.role === 'STAFF' && ['ASSIGNED', 'REOPENED'].includes(complaint.status) && (
                    <button className="secondary-btn small-btn" onClick={() => startComplaint(complaint)}>Start work</button>
                  )}
                  {user.role === 'STAFF' && complaint.status === 'IN_PROGRESS' && (
                    <div className="complaint-actions">
                      <textarea
                        aria-label={`Resolution notes for ${complaint.code}`}
                        placeholder="Describe the fix"
                        value={resolutionNotes[complaint.id] || ''}
                        onChange={(event) => setResolutionNotes((current) => ({ ...current, [complaint.id]: event.target.value }))}
                      />
                      <button className="primary-btn small-btn" onClick={() => resolveComplaint(complaint)}>Mark resolved</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {!loading && matchingComplaints.length > 0 && (
            <div className="complaint-pagination">
              <span>{matchingComplaints.length} complaints · Page {currentPage} of {pageCount}</span>
              <div>
                <button className="ghost-btn" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>Previous</button>
                <button className="ghost-btn" onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} disabled={currentPage === pageCount}>Next</button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ComplaintDetailPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadComplaint = async () => {
      setLoading(true);
      setError('');
      try {
        const [details, timeline] = await Promise.all([
          apiRequest(`/complaints/${id}`),
          apiRequest(`/complaints/${id}/history`),
        ]);
        if (active) {
          setComplaint(details);
          setHistory(Array.isArray(timeline) ? timeline : []);
        }
      } catch (requestError) {
        if (active) setError(requestError.message || 'Could not load this complaint.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadComplaint();
    return () => { active = false; };
  }, [id]);

  return (
    <div className="app-shell">
      <header className="topbar dashboard-bar">
        <Link to="/" className="brand">Fixora<span>.</span></Link>
        <nav className="nav-links nav-links--dashboard">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/complaints/new">New complaint</Link>
        </nav>
      </header>

      <main className="detail-layout">
        <Link className="back-link" to="/dashboard">&larr; Back to dashboard</Link>
        {loading ? <p className="muted">Loading complaint...</p> : error ? (
          <div className="error-box" role="alert">{error}</div>
        ) : complaint && (
          <>
            <section className="detail-header">
              <div>
                <span className="eyebrow">{complaint.code}</span>
                <h1>{complaint.title}</h1>
                <p>{complaint.description}</p>
              </div>
              <span className={`status-badge status-${complaint.status.toLowerCase()}`}>
                {complaint.status.replaceAll('_', ' ')}
              </span>
            </section>

            <section className="detail-grid" aria-label="Complaint details">
              <article><span>Category</span><strong>{complaint.category.replaceAll('_', ' ')}</strong></article>
              <article><span>Priority</span><strong>{complaint.priority}</strong></article>
              <article><span>Location</span><strong>{complaint.location || 'Not provided'}</strong></article>
              <article><span>Submitted</span><strong>{new Date(complaint.createdAt).toLocaleString()}</strong></article>
              <article><span>Department</span><strong>{complaint.departmentName || 'Awaiting triage'}</strong></article>
              <article><span>Assigned staff</span><strong>{complaint.assignedToName || 'Not assigned'}</strong></article>
            </section>

            {complaint.resolutionNotes && (
              <section className="detail-section">
                <h2>Resolution</h2>
                <p>{complaint.resolutionNotes}</p>
                {complaint.resolutionAt && <time dateTime={complaint.resolutionAt}>{new Date(complaint.resolutionAt).toLocaleString()}</time>}
              </section>
            )}

            <section className="detail-section">
              <h2>Status history</h2>
              {history.length === 0 ? <p className="muted">No status history available.</p> : (
                <ol className="timeline-list">
                  {history.map((entry) => (
                    <li key={entry.id}>
                      <span className="timeline-marker" />
                      <div>
                        <strong>{entry.newStatus?.replaceAll('_', ' ') || 'Update'}</strong>
                        <p>{entry.changeNote}</p>
                        <small>{entry.updatedByName} · <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time></small>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function NewComplaintPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    priority: 'MEDIUM',
    location: '',
  });
  const [error, setError] = useState('');
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmittedComplaint(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const title = form.title.trim();
    const location = form.location.trim();
    const description = form.description.trim();
    if (!title || !location || !description) {
      setError('Enter a title, location, and description before submitting.');
      return;
    }

    setLoading(true);

    try {
      const complaint = await apiRequest('/complaints', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category: form.category,
          priority: form.priority,
          location,
        }),
      });

      setSubmittedComplaint(complaint);
    } catch (err) {
      setError(err.message || 'Could not create the complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar dashboard-bar">
        <Link to="/" className="brand">
          Fixora<span>.</span>
        </Link>
        <nav className="nav-links nav-links--dashboard">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/complaints/new">New complaint</Link>
        </nav>
      </header>

      <main className="form-layout">
        <section className="panel-form">
          <div className="panel-head">
            <h3>Submit a service request</h3>
          </div>

          {submittedComplaint ? (
            <div className="success-box" role="status">
              <strong>Complaint submitted</strong>
              <span>Your reference number is {submittedComplaint.code}.</span>
              <Link to="/dashboard">View my complaints</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="complaint-form">
            <label>
              Title
              <input name="title" value={form.title} onChange={handleChange} maxLength={180} required />
            </label>

            <label>
              Location
              <input name="location" value={form.location} onChange={handleChange} maxLength={150} placeholder="Block A / Floor 2" required />
            </label>

            <div className="two-col">
              <label>
                Category
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="OTHER">General</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="PLUMBING">Plumbing</option>
                  <option value="MAINTENANCE">Maintenance / HVAC</option>
                  <option value="SAFETY">Safety / Security</option>
                  <option value="NETWORK">Network / Internet</option>
                  <option value="FOOD_CANTEEN">Food and Canteen</option>
                  <option value="CLEANING">Housekeeping</option>
                </select>
              </label>

              <label>
                Priority
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Urgent</option>
                </select>
              </label>
            </div>

            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows="6" maxLength={5000} required />
            </label>

            {error && <div className="error-box">{error}</div>}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit complaint'}
            </button>
          </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;