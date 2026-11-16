"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  HouseholdUser,
  CollectorUser,
  AdminUser,
  CollectionRequest,
  CollectionStatus,
  Complaint,
  NotificationItem,
  ActivityLog,
  OfflineAction,
  PriceOffer,
} from "@/types";
import {
  INITIAL_HOUSEHOLDS,
  INITIAL_COLLECTORS,
  INITIAL_ADMIN,
  INITIAL_REQUESTS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
} from "@/lib/mockData";

interface WasteAppContextType {
  currentUser: User;
  currentRole: UserRole;
  setCurrentUser: (user: User) => void;
  switchUserById: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  
  households: HouseholdUser[];
  collectors: CollectorUser[];
  admin: AdminUser;
  requests: CollectionRequest[];
  complaints: Complaint[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  
  // PWA Offline simulation
  isOfflineSimulated: boolean;
  toggleOfflineSimulation: () => void;
  offlineQueue: OfflineAction[];
  syncOfflineQueue: () => Promise<void>;
  isSyncing: boolean;
  
  // Actions
  resetAllDemoData: () => void;
  createCollectionRequest: (data: Partial<CollectionRequest>) => CollectionRequest;
  proposePrice: (requestId: string, amount: number, note?: string) => void;
  acceptPriceOffer: (requestId: string, offerId: string) => void;
  rejectPriceOffer: (requestId: string, offerId: string) => void;
  updateCollectionStatus: (
    requestId: string,
    newStatus: CollectionStatus,
    completionPhotoUrl?: string
  ) => void;
  processPayment: (
    requestId: string,
    method: "cash" | "momo",
    momoDetails?: { provider: "MTN MoMo" | "Telecel Cash" | "AT Money"; phone: string }
  ) => Promise<{ success: boolean; receiptNumber: string; reference: string }>;
  submitReview: (requestId: string, rating: number, comment: string) => void;
  submitComplaint: (complaintData: Partial<Complaint>) => void;
  resolveComplaint: (complaintId: string, adminNotes: string) => void;
  verifyCollector: (collectorId: string, approved: boolean) => void;
  toggleCollectorOnline: (collectorId: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
}

const STORAGE_KEYS = {
  CURRENT_USER: "wastelink_current_user",
  HOUSEHOLDS: "wastelink_households",
  COLLECTORS: "wastelink_collectors",
  REQUESTS: "wastelink_requests",
  COMPLAINTS: "wastelink_complaints",
  NOTIFICATIONS: "wastelink_notifications",
  ACTIVITY_LOGS: "wastelink_activity_logs",
  OFFLINE_QUEUE: "wastelink_offline_queue",
};

const WasteAppContext = createContext<WasteAppContextType | undefined>(undefined);

export function WasteAppProvider({ children }: { children: React.ReactNode }) {
  // Primary State
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_HOUSEHOLDS[0]);
  const [households, setHouseholds] = useState<HouseholdUser[]>(INITIAL_HOUSEHOLDS);
  const [collectors, setCollectors] = useState<CollectorUser[]>(INITIAL_COLLECTORS);
  const [admin, setAdmin] = useState<AdminUser>(INITIAL_ADMIN);
  const [requests, setRequests] = useState<CollectionRequest[]>(INITIAL_REQUESTS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  
  // Offline State
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const savedHouseholds = localStorage.getItem(STORAGE_KEYS.HOUSEHOLDS);
      const savedCollectors = localStorage.getItem(STORAGE_KEYS.COLLECTORS);
      const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      const savedComplaints = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const savedLogs = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      const savedQueue = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedHouseholds) setHouseholds(JSON.parse(savedHouseholds));
      if (savedCollectors) setCollectors(JSON.parse(savedCollectors));
      if (savedRequests) setRequests(JSON.parse(savedRequests));
      if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      if (savedLogs) setActivityLogs(JSON.parse(savedLogs));
      if (savedQueue) setOfflineQueue(JSON.parse(savedQueue));
    } catch (err) {
      console.warn("Could not read from local storage:", err);
    }
    setIsHydrated(true);
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.HOUSEHOLDS, JSON.stringify(households));
      localStorage.setItem(STORAGE_KEYS.COLLECTORS, JSON.stringify(collectors));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs));
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(offlineQueue));
    } catch (err) {
      console.warn("Could not save to local storage:", err);
    }
  }, [
    currentUser,
    households,
    collectors,
    requests,
    complaints,
    notifications,
    activityLogs,
    offlineQueue,
    isHydrated,
  ]);

  // Switch role helper
  const switchRole = (role: UserRole) => {
    if (role === "household") {
      setCurrentUser(households[0]);
    } else if (role === "collector") {
      setCurrentUser(collectors[0]);
    } else {
      setCurrentUser(admin);
    }
  };

  // Switch user by ID
  const switchUserById = (userId: string) => {
    const foundHh = households.find((h) => h.id === userId);
    if (foundHh) {
      setCurrentUser(foundHh);
      return;
    }
    const foundCol = collectors.find((c) => c.id === userId);
    if (foundCol) {
      setCurrentUser(foundCol);
      return;
    }
    if (admin.id === userId) {
      setCurrentUser(admin);
    }
  };

  // Reset demo data
  const resetAllDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_HOUSEHOLDS[0]);
    setHouseholds(INITIAL_HOUSEHOLDS);
    setCollectors(INITIAL_COLLECTORS);
    setAdmin(INITIAL_ADMIN);
    setRequests(INITIAL_REQUESTS);
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setOfflineQueue([]);
    setIsOfflineSimulated(false);
  };

  // Helper to add activity log
  const logActivity = (action: string, actor: string, actorRole: UserRole | "system", details: string) => {
    const newLog: ActivityLog = {
      id: "act-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      action,
      actor,
      actorRole,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Helper to add notification
  const addNotification = (
    userId: string,
    role: UserRole | "all",
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "negotiation" | "payment",
    link?: string
  ) => {
    const newNotif: NotificationItem = {
      id: "notif-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      userId,
      role,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // 1. Create on-demand collection request
  const createCollectionRequest = (data: Partial<CollectionRequest>): CollectionRequest => {
    const newReq: CollectionRequest = {
      id: "req-" + Date.now().toString().slice(-4),
      householdId: currentUser.id,
      householdName: currentUser.name,
      householdPhone: currentUser.phone,
      householdAvatar: currentUser.avatar,
      wasteCategory: data.wasteCategory || "General Household Rubbish",
      quantity: data.quantity || "1 - 2 Standard Bags",
      description: data.description || "On-demand waste collection request",
      photoUrl: data.photoUrl,
      specialInstructions: data.specialInstructions,
      area: data.area || currentUser.location || "Madina",
      address: data.address || "Main Street",
      landmark: data.landmark || "Near junction",
      lat: data.lat || 5.65,
      lng: data.lng || -0.16,
      status: "requested",
      createdAt: new Date().toISOString(),
      initialEstimatedPrice: data.initialEstimatedPrice || 45,
      negotiationHistory: [],
    };

    setRequests((prev) => [newReq, ...prev]);

    // Update household stats
    setHouseholds((prev) =>
      prev.map((h) =>
        h.id === currentUser.id ? { ...h, totalRequests: h.totalRequests + 1 } : h
      )
    );

    logActivity(
      "NEW_COLLECTION_REQUEST",
      currentUser.name,
      "household",
      `Created request #${newReq.id} for ${newReq.area} (${newReq.quantity})`
    );

    // Notify collectors operating in that area
    addNotification(
      "all",
      "collector",
      "New Collection Request Available",
      `${currentUser.name} requested collection in ${newReq.area} (${newReq.wasteCategory}).`,
      "info",
      `/collector/requests`
    );

    return newReq;
  };

  // 2. Price negotiation: Propose price
  const proposePrice = (requestId: string, amount: number, note?: string) => {
    const isCollector = currentUser.role === "collector";
    const senderRole = isCollector ? "collector" : "household";

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;

        // If collector is proposing and not yet assigned to request, assign this collector
        let updatedCollectorFields = {};
        if (isCollector && (!r.collectorId || r.collectorId === currentUser.id)) {
          const col = currentUser as CollectorUser;
          updatedCollectorFields = {
            collectorId: col.id,
            collectorName: col.name,
            collectorPhone: col.phone,
            collectorAvatar: col.avatar,
            collectorTricycle: `${col.tricycleRegNumber} (${col.tricycleModel})`,
          };
        }

        const newOffer: PriceOffer = {
          id: "neg-" + Date.now(),
          proposedBy: senderRole,
          senderId: currentUser.id,
          senderName: currentUser.name,
          amount,
          note,
          timestamp: new Date().toISOString(),
          status: "pending",
        };

        // Mark previous pending offers as countered
        const updatedHistory = r.negotiationHistory.map((o) =>
          o.status === "pending" ? { ...o, status: "countered" as const } : o
        );

        return {
          ...r,
          ...updatedCollectorFields,
          status: "negotiating",
          negotiationHistory: [...updatedHistory, newOffer],
        };
      })
    );

    logActivity(
      "PRICE_PROPOSAL_SUBMITTED",
      currentUser.name,
      senderRole,
      `Offered GH₵${amount} for Request #${requestId}`
    );

    // Notify the other party
    const targetRole = isCollector ? "household" : "collector";
    addNotification(
      "all",
      targetRole,
      "Price Proposal Received",
      `${currentUser.name} submitted an offer of GH₵${amount} for collection #${requestId}.`,
      "negotiation"
    );
  };

  // 3. Accept price offer
  const acceptPriceOffer = (requestId: string, offerId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const targetOffer = r.negotiationHistory.find((o) => o.id === offerId);
        if (!targetOffer) return r;

        const updatedHistory = r.negotiationHistory.map((o) =>
          o.id === offerId ? { ...o, status: "accepted" as const } : o
        );

        return {
          ...r,
          agreedPrice: targetOffer.amount,
          status: "price_agreed",
          negotiationHistory: updatedHistory,
        };
      })
    );

    logActivity(
      "PRICE_AGREED",
      currentUser.name,
      currentUser.role,
      `Price confirmed for #${requestId}`
    );

    addNotification(
      "all",
      "all",
      "Collection Price Agreed!",
      `Price agreed for #${requestId}. Collector can now proceed to household.`,
      "success"
    );
  };

  // 4. Reject price offer
  const rejectPriceOffer = (requestId: string, offerId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const updatedHistory = r.negotiationHistory.map((o) =>
          o.id === offerId ? { ...o, status: "rejected" as const } : o
        );
        return {
          ...r,
          negotiationHistory: updatedHistory,
        };
      })
    );

    logActivity(
      "PRICE_REJECTED",
      currentUser.name,
      currentUser.role,
      `Offer rejected for #${requestId}`
    );
  };

  // 5. Update collection status (with offline simulation support)
  const updateCollectionStatus = (
    requestId: string,
    newStatus: CollectionStatus,
    completionPhotoUrl?: string
  ) => {
    // If offline simulation is on and this is an offline-capable collector action:
    if (isOfflineSimulated && currentUser.role === "collector") {
      let actionType: OfflineAction["actionType"] = "complete_collection";
      if (newStatus === "collector_arrived") actionType = "mark_arrived";
      else if (newStatus === "in_progress") actionType = "start_collection";

      const queuedAction: OfflineAction = {
        id: "off-" + Date.now(),
        actionType,
        requestId,
        payload: { newStatus, completionPhotoUrl },
        queuedAt: new Date().toISOString(),
      };

      setOfflineQueue((prev) => [...prev, queuedAction]);
      return;
    }

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const updates: Partial<CollectionRequest> = { status: newStatus };
        if (completionPhotoUrl) {
          updates.completionPhotoUrl = completionPhotoUrl;
        }
        if (newStatus === "completed") {
          updates.completedAt = new Date().toISOString();
        }
        return { ...r, ...updates };
      })
    );

    logActivity(
      `STATUS_UPDATED_${newStatus.toUpperCase()}`,
      currentUser.name,
      currentUser.role,
      `Request #${requestId} changed to ${newStatus}`
    );

    addNotification(
      "all",
      "household",
      `Collection Update: ${newStatus.replace("_", " ")}`,
      `Your waste collection #${requestId} is now: ${newStatus.replace("_", " ")}`,
      "info"
    );
  };

  // 6. Process Payment (Simulated Cash or Mobile Money)
  const processPayment = async (
    requestId: string,
    method: "cash" | "momo",
    momoDetails?: { provider: "MTN MoMo" | "Telecel Cash" | "AT Money"; phone: string }
  ): Promise<{ success: boolean; receiptNumber: string; reference: string }> => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) {
      throw new Error("Request not found");
    }

    const receiptNumber = `REC-GH-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const prefix = method === "momo" ? "WL-MOMO" : "WL-CASH";
    const reference = `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const amount = targetReq.agreedPrice || targetReq.initialEstimatedPrice || 50;

    // Update request
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: "paid",
          paymentMethod: method,
          momoProvider: momoDetails?.provider,
          momoPhoneNumber: momoDetails?.phone,
          paymentReference: reference,
          receiptNumber,
          paidAt: new Date().toISOString(),
        };
      })
    );

    // Update collector earnings & completed count
    if (targetReq.collectorId) {
      setCollectors((prev) =>
        prev.map((c) => {
          if (c.id !== targetReq.collectorId) return c;
          return {
            ...c,
            completedJobs: c.completedJobs + 1,
            earnings: {
              ...c.earnings,
              today: c.earnings.today + amount,
              thisWeek: c.earnings.thisWeek + amount,
              thisMonth: c.earnings.thisMonth + amount,
              total: c.earnings.total + amount,
            },
          };
        })
      );
    }

    // Update household completed count
    setHouseholds((prev) =>
      prev.map((h) => {
        if (h.id !== targetReq.householdId) return h;
        return {
          ...h,
          completedRequests: h.completedRequests + 1,
        };
      })
    );

    logActivity(
      "PAYMENT_CONFIRMED",
      currentUser.name,
      currentUser.role,
      `Paid GH₵${amount} via ${method.toUpperCase()} (${reference}) for #${requestId}`
    );

    addNotification(
      targetReq.householdId,
      "household",
      "Payment Successful & Receipt Ready",
      `Payment of GH₵${amount} confirmed. Receipt #${receiptNumber} generated.`,
      "payment",
      `/household/receipt?id=${requestId}`
    );

    if (targetReq.collectorId) {
      addNotification(
        targetReq.collectorId,
        "collector",
        "Payment Received!",
        `GH₵${amount} received from ${targetReq.householdName} via ${method.toUpperCase()}.`,
        "payment"
      );
    }

    return { success: true, receiptNumber, reference };
  };

  // 7. Submit Review
  const submitReview = (requestId: string, rating: number, comment: string) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              rating,
              reviewComment: comment,
              ratedAt: new Date().toISOString(),
            }
          : r
      )
    );

    // Update collector rating
    if (targetReq.collectorId) {
      setCollectors((prev) =>
        prev.map((c) => {
          if (c.id !== targetReq.collectorId) return c;
          const newTotalRatings = c.totalRatings + 1;
          const newAvgRating =
            Math.round(((c.rating * c.totalRatings + rating) / newTotalRatings) * 10) / 10;
          return {
            ...c,
            rating: newAvgRating,
            totalRatings: newTotalRatings,
          };
        })
      );
    }

    logActivity(
      "REVIEW_SUBMITTED",
      currentUser.name,
      "household",
      `Rated #${requestId} with ${rating} stars`
    );
  };

  // 8. Submit Complaint
  const submitComplaint = (data: Partial<Complaint>) => {
    const newComplaint: Complaint = {
      id: "comp-" + Date.now().toString().slice(-4),
      requestId: data.requestId || "req-unknown",
      complainantId: currentUser.id,
      complainantName: currentUser.name,
      complainantRole: currentUser.role,
      targetId: data.targetId || "target-user",
      targetName: data.targetName || "User",
      category: data.category || "Other",
      description: data.description || "Issue report",
      status: "open",
      createdAt: new Date().toISOString(),
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    logActivity(
      "COMPLAINT_FILED",
      currentUser.name,
      currentUser.role,
      `Filed complaint #${newComplaint.id} regarding ${newComplaint.category}`
    );

    addNotification(
      admin.id,
      "admin",
      "New Dispute / Complaint Filed",
      `${currentUser.name} reported: "${newComplaint.category}" on #${newComplaint.requestId}`,
      "warning",
      `/admin/complaints`
    );
  };

  // 9. Admin Resolve Complaint
  const resolveComplaint = (complaintId: string, adminNotes: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: "resolved",
              adminNotes,
              resolvedAt: new Date().toISOString(),
            }
          : c
      )
    );

    logActivity(
      "COMPLAINT_RESOLVED",
      admin.name,
      "admin",
      `Resolved dispute #${complaintId} with notes: ${adminNotes}`
    );
  };

  // 10. Admin Verify Collector
  const verifyCollector = (collectorId: string, approved: boolean) => {
    setCollectors((prev) =>
      prev.map((c) => {
        if (c.id !== collectorId) return c;
        return {
          ...c,
          isVerified: approved,
          verificationStatus: approved ? "approved" : "rejected",
        };
      })
    );

    logActivity(
      approved ? "COLLECTOR_VERIFIED" : "COLLECTOR_REJECTED",
      admin.name,
      "admin",
      `Collector #${collectorId} application was ${approved ? "approved" : "rejected"}`
    );

    addNotification(
      collectorId,
      "collector",
      approved ? "Account Verified!" : "Verification Update",
      approved
        ? "Congratulations! Your Ghana Card and tricycle registration are verified. You can now accept collection jobs."
        : "Your verification requires resubmission. Please check your documents.",
      approved ? "success" : "warning"
    );
  };

  // 11. Toggle Collector Online Availability
  const toggleCollectorOnline = (collectorId: string) => {
    setCollectors((prev) =>
      prev.map((c) => {
        if (c.id !== collectorId) return c;
        const nextState = !c.isOnline;
        logActivity(
          "AVAILABILITY_CHANGED",
          c.name,
          "collector",
          `Status changed to ${nextState ? "ONLINE" : "OFFLINE"}`
        );
        return { ...c, isOnline: nextState };
      })
    );
  };

  // 12. Toggle Offline Simulation
  const toggleOfflineSimulation = () => {
    setIsOfflineSimulated((prev) => !prev);
  };

  // 13. Sync Offline Queue
  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;
    setIsSyncing(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Process queued actions
    for (const action of offlineQueue) {
      if (action.actionType === "mark_arrived") {
        updateCollectionStatus(action.requestId, "collector_arrived");
      } else if (action.actionType === "start_collection") {
        updateCollectionStatus(action.requestId, "in_progress");
      } else if (action.actionType === "complete_collection") {
        updateCollectionStatus(
          action.requestId,
          "completed",
          action.payload?.completionPhotoUrl
        );
      }
    }

    setOfflineQueue([]);
    setIsSyncing(false);
    setIsOfflineSimulated(false);

    logActivity(
      "OFFLINE_QUEUE_SYNCED",
      currentUser.name,
      currentUser.role,
      `Synchronized ${offlineQueue.length} queued task(s) to cloud database`
    );

    addNotification(
      currentUser.id,
      currentUser.role,
      "Offline Sync Complete",
      "All queued collection actions have been synchronized successfully.",
      "success"
    );
  };

  // 14. Notifications
  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <WasteAppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        setCurrentUser,
        switchUserById,
        switchRole,
        households,
        collectors,
        admin,
        requests,
        complaints,
        notifications,
        activityLogs,
        isOfflineSimulated,
        toggleOfflineSimulation,
        offlineQueue,
        syncOfflineQueue,
        isSyncing,
        resetAllDemoData,
        createCollectionRequest,
        proposePrice,
        acceptPriceOffer,
        rejectPriceOffer,
        updateCollectionStatus,
        processPayment,
        submitReview,
        submitComplaint,
        resolveComplaint,
        verifyCollector,
        toggleCollectorOnline,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </WasteAppContext.Provider>
  );
}

export function useWasteApp() {
  const context = useContext(WasteAppContext);
  if (!context) {
    throw new Error("useWasteApp must be used within a WasteAppProvider");
  }
  return context;
}

