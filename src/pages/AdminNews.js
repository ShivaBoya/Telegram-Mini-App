import React, { useState, useEffect } from 'react';
import {
  ref,
  push,
  set,
  update,
  onValue,
  remove,
  serverTimestamp,
  get,
  query,
  orderByChild
} from 'firebase/database';
import { database } from "../services/FirebaseConfig";
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Styles/AdminNews.css";

// Helper function to format a timestamp into a human-readable format
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const AdminNews = () => {
  // State for the list of news items
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for managing the add/edit modal
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // Can be 'add' or 'edit'
  const [currentNews, setCurrentNews] = useState({
    title: '',
    summary: '',
    category: '',
    imageUrl: '',
    readMoreLink: '',
  });
  const [editingNewsId, setEditingNewsId] = useState(null);
  
  // State for managing the delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteNewsId, setDeleteNewsId] = useState(null);
  const [deleteNewsTitle, setDeleteNewsTitle] = useState('');

  // Load news data from Firebase in realtime
  useEffect(() => {
    const newsRef = query(ref(database, 'news'), orderByChild('createdAt'));
    const unsubscribe = onValue(
      newsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Map each news item into an array and sort descending based on createdAt
          const newsArray = Object.entries(data)
            .map(([id, item]) => ({ id, ...item }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setNewsList(newsArray);
        } else {
          setNewsList([]);
        }
        setIsLoading(false);
      },
      (error) => {
        toast.error(`Error loading news: ${error.message}`);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Open modal for adding a new news item
  const openAddModal = () => {
    setModalMode('add');
    setCurrentNews({
      title: '',
      summary: '',
      category: '',
      imageUrl: '',
      readMoreLink: '',
    });
    setEditingNewsId(null);
    setNewsModalOpen(true);
  };

  // Open modal for editing an existing news item
  const openEditModal = async (newsId) => {
    try {
      const snapshot = await get(ref(database, `news/${newsId}`));
      const newsItem = snapshot.val();
      if (newsItem) {
        setCurrentNews({
          title: newsItem.title || '',
          summary: newsItem.summary || '',
          category: newsItem.category || '',
          imageUrl: newsItem.imageUrl || '',
          readMoreLink: newsItem.readMoreLink || '',
        });
        setEditingNewsId(newsId);
        setModalMode('edit');
        setNewsModalOpen(true);
      } else {
        toast.error('News item not found');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (newsId, title) => {
    setDeleteNewsId(newsId);
    setDeleteNewsTitle(title);
    setDeleteModalOpen(true);
  };

  // Handle add/edit form submission
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = currentNews.title.trim();
    const trimmedSummary = currentNews.summary.trim();
    const trimmedCategory = currentNews.category.trim();
    const trimmedImageUrl = currentNews.imageUrl.trim();
    const trimmedReadMoreLink = currentNews.readMoreLink.trim();
    
    if (!trimmedTitle || !trimmedSummary || !trimmedCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (modalMode === 'edit' && editingNewsId) {
        // Update existing news item without changing its ID
        await update(ref(database, `news/${editingNewsId}`), {
          title: trimmedTitle,
          summary: trimmedSummary,
          category: trimmedCategory,
          imageUrl: trimmedImageUrl,
          readMoreLink: trimmedReadMoreLink,
          updatedAt: serverTimestamp()
        });
        toast.success('News updated successfully');
      } else {
        // Add new news item. Using push() generates a unique ID and the news will be added last in the database.
        const newNewsRef = push(ref(database, 'news'));
        await set(newNewsRef, {
          title: trimmedTitle,
          summary: trimmedSummary,
          category: trimmedCategory,
          imageUrl: trimmedImageUrl,
          readMoreLink: trimmedReadMoreLink,
          createdAt: serverTimestamp()
        });
        toast.success(`News "${trimmedTitle}" added successfully`);
      }
      setNewsModalOpen(false);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  // Handle deletion of a news item
  const handleDeleteConfirm = async () => {
    try {
      await remove(ref(database, `news/${deleteNewsId}`));
      toast.success('News deleted successfully');
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="news-manager">
      <ToastContainer />
      <header>
        <h1>News Manager</h1>
        <button className="add-news-btn" onClick={openAddModal}>
          <FiPlus /> Add News
        </button>
      </header>
      <section className="news-list-section">
        {isLoading ? (
          <div className="loading">Loading news...</div>
        ) : newsList.length > 0 ? (
          <table className="news-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Summary</th>
                <th>Category</th>
                <th>Image</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((newsItem, index) => (
                <tr key={newsItem.id}>
                  <td>{index + 1}</td>
                  <td>{newsItem.title}</td>
                  <td>{newsItem.summary}</td>
                  <td>{newsItem.category}</td>
                  <td>
                    {newsItem.imageUrl ? (
                      <a
                        href={newsItem.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View image"
                      >
                        View
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{formatDate(newsItem.createdAt)}</td>
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(newsItem.id)}
                      title="Edit news"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => openDeleteModal(newsItem.id, newsItem.title)}
                      title="Delete news"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No news items available</div>
        )}
      </section>
      {/* Modal for Add/Edit News */}
      {newsModalOpen && (
        <div className="modal-overlay" onClick={() => setNewsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'edit' ? 'Edit News' : 'Add News'}</h2>
              <button className="modal-close" onClick={() => setNewsModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label htmlFor="modalNewsTitle">Title</label>
                <input
                  type="text"
                  id="modalNewsTitle"
                  value={currentNews.title}
                  onChange={(e) =>
                    setCurrentNews({ ...currentNews, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="modalNewsSummary">Summary</label>
                <input
                  id="modalNewsSummary"
                  value={currentNews.summary}
                  onChange={(e) =>
                    setCurrentNews({ ...currentNews, summary: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="modalNewsCategory">Category</label>
                <input
                  type="text"
                  id="modalNewsCategory"
                  value={currentNews.category}
                  onChange={(e) =>
                    setCurrentNews({ ...currentNews, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="modalNewsImageUrl">Image URL</label>
                <input
                  type="text"
                  id="modalNewsImageUrl"
                  value={currentNews.imageUrl}
                  onChange={(e) =>
                    setCurrentNews({ ...currentNews, imageUrl: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="modalNewsReadMoreLink">ReadMore URL</label>
                <input
                  type="text"
                  id="modalNewsReadMoreLink"
                  value={currentNews.readMoreLink}
                  onChange={(e) =>
                    setCurrentNews({ ...currentNews, readMoreLink: e.target.value })
                  }
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setNewsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {modalMode === 'edit' ? (
                    <>
                      <FiSave /> Update
                    </>
                  ) : (
                    <>
                      <FiPlus /> Add
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal for Delete Confirmation */}
      {deleteModalOpen && (
        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close" onClick={() => setDeleteModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>{deleteNewsTitle}</strong>?
              </p>
            </div>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="delete-btn" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNews;
