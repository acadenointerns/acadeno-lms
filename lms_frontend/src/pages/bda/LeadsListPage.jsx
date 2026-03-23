import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/leads.css';

const LeadsListPage = () => {
  const [leads, setLeads] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  const navigate = useNavigate();

  const fetchLeads = useCallback(async (currentSearch, currentStatus, currentPage) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/leads', {
        params: {
          search: currentSearch,
          status: currentStatus,
          page: currentPage,
          limit: limit
        }
      });
      setLeads(response.data.leads);
      setTotalCount(response.data.total_count);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced Search Effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1); // Reset to first page on new search
      fetchLeads(search, status, 1);
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [search, status, fetchLeads]);

  // Pagination Change Effect
  useEffect(() => {
    if (page > 1) {
       fetchLeads(search, status, page);
    }
  }, [page, fetchLeads]); // Only trigger on page change if not resetting

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="leads-container">
      <div className="page-header">
        <h1>Lead Management</h1>
        <button className="btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/leads/new')}>
          + New Lead
        </button>
      </div>

      <div className="lead-controls">
        <input 
          type="text" 
          placeholder="Search by name, email or phone..." 
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="negotiating">Negotiating</option>
          <option value="converted">Converted</option>
          <option value="cold">Cold</option>
        </select>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Course Interest</th>
              <th>Status</th>
              <th>Last Activity</th>
              <th>Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading leads...</td></tr>
            ) : leads.length > 0 ? (
              leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className={lead.overdue ? 'overdue-row' : ''}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <td><strong>{lead.full_name}</strong></td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{lead.email}</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-text)' }}>{lead.phone}</div>
                  </td>
                  <td>{lead.course_interest}</td>
                  <td><span className={`status-badge status-${lead.status}`}>{lead.status}</span></td>
                  <td>{new Date(lead.last_activity_at).toLocaleDateString()}</td>
                  <td>{lead.follow_up_date ? new Date(lead.follow_up_date).toLocaleDateString() : 'None'}</td>
                  <td><button className="btn-link">Details</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No leads found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i + 1}
              className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button 
            className="pagination-btn" 
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadsListPage;
