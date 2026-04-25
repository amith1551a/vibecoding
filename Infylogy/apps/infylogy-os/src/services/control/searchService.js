import { db } from '../firebase/firebase';
import { 
  collection, query, where, getDocs, limit, startAfter, orderBy 
} from 'firebase/firestore';
import { ENGINE_STATUS } from './approvalEngine';

export const globalSearch = async (searchTerm, role, userId, filters = {}) => {
  if (!searchTerm && !filters.status) return [];

  const results = [];
  const searchLimit = 10;

  // 1. Define Search Scope based on Role
  // Admin sees all. Recruiters see their scope. Clients see assigned.
  
  const entities = [
    { name: 'candidates', fields: ['name', 'skills'] },
    { name: 'leads', fields: ['clientName', 'roleRequirement'] },
    { name: 'timesheets', fields: ['title', 'notes'] }
  ];

  for (const entity of entities) {
    let q = collection(db, entity.name);
    let constraints = [];

    // Role-Based Filtering (RBAC)
    if (role === 'Recruiter' && entity.name === 'candidates') {
      constraints.push(where('ownerId', '==', userId));
    }
    
    if (role === 'Client') {
      constraints.push(where('clientVisible', '==', true));
      // Add client-specific id if available
    }

    // Control Engine Status Filtering
    if (filters.status && filters.status !== 'All') {
      constraints.push(where('status', '==', filters.status));
    }

    // Keyword Search (Basic Firestore implementation)
    // In production, Algolia or ElasticSearch is recommended for full-text.
    // Here we use native where for the start of the string or specific categories.
    if (searchTerm) {
      constraints.push(orderBy(entity.fields[0]));
      constraints.push(where(entity.fields[0], '>=', searchTerm));
      constraints.push(where(entity.fields[0], '<=', searchTerm + '\uf8ff'));
    }

    constraints.push(limit(searchLimit));

    try {
      const snapshot = await getDocs(query(q, ...constraints));
      snapshot.forEach(doc => {
        results.push({
          id: doc.id,
          type: entity.name,
          ...doc.data()
        });
      });
    } catch (e) {
      console.warn(`Search failed for ${entity.name}:`, e);
    }
  }

  return results;
};

// Debounce helper for Search UI
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};
