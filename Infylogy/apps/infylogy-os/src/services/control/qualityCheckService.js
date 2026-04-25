import { db } from '../firebase/firebase';
import { 
  collection, doc, addDoc, updateDoc, serverTimestamp, 
  getDoc, setDoc 
} from 'firebase/firestore';

export const QC_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted for Quality Check',
  APPROVED: 'Quality Check Approved',
  REJECTED: 'Rejected',
  NEEDS_CORRECTION: 'Needs Correction'
};

export const qualityCheckService = {
  /**
   * Submit a record for Quality Check
   */
  async submitForQC(module, docId, userId, userRole, data = {}) {
    try {
      // 1. Update the document status to lock it
      const docRef = doc(db, module, docId);
      const docSnap = await getDoc(docRef);
      const previousStatus = docSnap.exists() ? docSnap.data().status : 'Draft';

      await updateDoc(docRef, {
        status: QC_STATUS.SUBMITTED,
        lastSubmittedBy: userId,
        lastSubmittedRole: userRole,
        lastSubmittedAt: serverTimestamp()
      });

      // 2. Create the Quality Check Task
      const qcRef = await addDoc(collection(db, 'qualityChecks'), {
        module,
        docId,
        submittedBy: userId,
        submittedRole: userRole,
        previousStatus,
        status: QC_STATUS.SUBMITTED,
        createdAt: serverTimestamp(),
        ...data
      });

      return { success: true, qcId: qcRef.id };
    } catch (error) {
      console.error('QC Submission failed:', error);
      throw error;
    }
  },

  /**
   * Process a Quality Check (Approve/Reject/Correction)
   */
  async processQC(module, docId, qcId, decision, supervisorId, reason = '') {
    try {
      // 1. Update the original document
      const docRef = doc(db, module, docId);
      const finalStatus = decision === 'Approve' ? QC_STATUS.APPROVED : 
                         decision === 'Reject' ? QC_STATUS.REJECTED : QC_STATUS.NEEDS_CORRECTION;

      await updateDoc(docRef, {
        status: finalStatus,
        qcReviewedBy: supervisorId,
        qcReviewedAt: serverTimestamp(),
        qcRejectionReason: reason
      });

      // 2. Resolve the QC Task
      const qcRef = doc(db, 'qualityChecks', qcId);
      await updateDoc(qcRef, {
        status: finalStatus,
        reviewedBy: supervisorId,
        reviewedAt: serverTimestamp(),
        rejectionReason: reason
      });

      // 3. Immutable Audit Log
      await addDoc(collection(db, 'auditLogs'), {
        module,
        docId,
        action: finalStatus,
        performerId: supervisorId,
        performerRole: 'Supervisor',
        timestamp: serverTimestamp(),
        reason,
        metadata: { qcId }
      });

      return { success: true };
    } catch (error) {
      console.error('QC processing failed:', error);
      throw error;
    }
  },

  /**
   * Admin: Check if QC is enabled for a module
   */
  async isQCEnabled(module) {
    try {
      const configRef = doc(db, 'systemSettings', 'qcConfigs');
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        return configSnap.data()[module] !== false; // Default: true
      }
      return true;
    } catch {
      return true;
    }
  }
};
