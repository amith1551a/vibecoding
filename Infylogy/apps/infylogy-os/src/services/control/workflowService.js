import { db } from '../firebase/firebase';
import { 
  collection, doc, addDoc, updateDoc, serverTimestamp, 
  getDoc, setDoc 
} from 'firebase/firestore';

export const APPROVAL_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted for Approval',
  APPROVED: 'Supervisor Approved',
  REJECTED: 'Rejected',
  NEEDS_CORRECTION: 'Needs Correction'
};

export const workflowService = {
  /**
   * Submit a record for supervisor approval
   */
  async submitForApproval(module, docId, userId, data = {}) {
    try {
      // 1. Update the document status
      const docRef = doc(db, module, docId);
      await updateDoc(docRef, {
        status: APPROVAL_STATUS.SUBMITTED,
        lastModifiedBy: userId,
        lastModifiedAt: serverTimestamp()
      });

      // 2. Log the approval request
      await addDoc(collection(db, 'approvals'), {
        module,
        docId,
        submittedBy: userId,
        status: APPROVAL_STATUS.SUBMITTED,
        createdAt: serverTimestamp(),
        ...data
      });

      return { success: true };
    } catch (error) {
      console.error('Submission failed:', error);
      throw error;
    }
  },

  /**
   * Supervisor action (Approve/Reject)
   */
  async takeAction(module, docId, approvalId, status, supervisorId, reason = '') {
    try {
      // 1. Update the original document
      const docRef = doc(db, module, docId);
      await updateDoc(docRef, {
        status: status,
        approvedBy: supervisorId,
        approvedAt: serverTimestamp(),
        rejectionReason: reason
      });

      // 2. Update the approval log
      const approvalRef = doc(db, 'approvals', approvalId);
      await updateDoc(approvalRef, {
        status: status,
        processedBy: supervisorId,
        processedAt: serverTimestamp(),
        reason: reason
      });

      // 3. Create Audit Log
      await addDoc(collection(db, 'auditLogs'), {
        module,
        docId,
        action: status,
        performedBy: supervisorId,
        timestamp: serverTimestamp(),
        reason
      });

      return { success: true };
    } catch (error) {
      console.error('Approval action failed:', error);
      throw error;
    }
  },

  /**
   * Check if approval is required for a module (Admin Config)
   */
  async isApprovalRequired(module) {
    try {
      const configRef = doc(db, 'systemSettings', 'approvals');
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        return configSnap.data()[module] !== false; // Default to true
      }
      return true;
    } catch {
      return true;
    }
  }
};
