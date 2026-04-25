import { db } from '../firebase/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export const ENGINE_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted for Approval',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NEEDS_CORRECTION: 'Needs Correction',
  BYPASSED: 'Admin Bypassed'
};

const logTransition = async (module, id, user, action, oldStatus, newStatus, reason) => {
  await addDoc(collection(db, "engine_logs"), {
    moduleId: id,
    moduleName: module,
    user,
    action,
    previousState: oldStatus,
    newState: newStatus,
    reason,
    timestamp: serverTimestamp()
  });
};

export const approvalEngine = {
  // Gated Submission
  submit: async (module, id, user, role, data) => {
    const docRef = doc(db, module, id);
    const status = ENGINE_STATUS.SUBMITTED;
    
    await updateDoc(docRef, { 
      status,
      submittedBy: user,
      submittedAt: serverTimestamp(),
      ...data
    });

    await logTransition(module, id, user, "SUBMIT_FOR_AUDIT", ENGINE_STATUS.DRAFT, status, "Initial submission");
    return status;
  },

  // Claim for review
  markUnderReview: async (module, id, supervisor) => {
    const docRef = doc(db, module, id);
    const status = ENGINE_STATUS.UNDER_REVIEW;
    
    await updateDoc(docRef, { 
      status,
      reviewerId: supervisor,
      reviewedAt: serverTimestamp()
    });

    await logTransition(module, id, supervisor, "CLAIM_FOR_REVIEW", ENGINE_STATUS.SUBMITTED, status, "Supervisor started audit");
    return status;
  },

  // Final Decision
  process: async (module, id, supervisor, decision, reason) => {
    const docRef = doc(db, module, id);
    let status;
    
    if (decision === 'approve') status = ENGINE_STATUS.APPROVED;
    else if (decision === 'reject') status = ENGINE_STATUS.REJECTED;
    else status = ENGINE_STATUS.NEEDS_CORRECTION;

    await updateDoc(docRef, { 
      status,
      decisionReason: reason,
      processedAt: serverTimestamp()
    });

    await logTransition(module, id, supervisor, "FINAL_DECISION", ENGINE_STATUS.UNDER_REVIEW, status, reason);
    return status;
  },

  // HIGH PRIVILEGE BYPASS
  adminBypass: async (module, id, admin, reason) => {
    if (!reason) throw new Error("Bypass reason is mandatory");

    const docRef = doc(db, module, id);
    const status = ENGINE_STATUS.BYPASSED;

    // 1. Update Document
    await updateDoc(docRef, { 
      status,
      bypassReason: reason,
      bypassedAt: serverTimestamp(),
      bypassedBy: admin
    });

    // 2. Regular Engine Log
    await logTransition(module, id, admin, "ADMIN_BYPASS", "ANY", status, reason);

    // 3. SECURE SECURITY AUDIT (Standalone Collection)
    await addDoc(collection(db, "security_audit"), {
      type: "ADMIN_SECURITY_BYPASS",
      moduleId: id,
      moduleName: module,
      adminId: admin,
      justification: reason,
      severity: "CRITICAL",
      timestamp: serverTimestamp()
    });

    return status;
  }
};
