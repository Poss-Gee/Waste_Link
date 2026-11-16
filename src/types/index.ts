export type UserRole = "household" | "collector" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  location: string;
  createdAt: string;
}

export interface HouseholdUser extends User {
  role: "household";
  address: string;
  landmark: string;
  area: string; // e.g., "Madina", "Adenta", "East Legon"
  totalRequests: number;
  completedRequests: number;
}

export interface CollectorUser extends User {
  role: "collector";
  isVerified: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  ghanaCardNumber: string;
  tricycleRegNumber: string;
  tricycleModel: string; // e.g., "Motor King 200cc", "Royal Aboboyaa 150cc"
  isOnline: boolean;
  currentLat: number;
  currentLng: number;
  rating: number;
  totalRatings: number;
  completedJobs: number;
  operatingAreas: string[];
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
}

export interface AdminUser extends User {
  role: "admin";
  permissions: string[];
}

export type WasteCategory = 
  | "General Household Rubbish"
  | "Kitchen & Organic Waste"
  | "Plastic & Recyclable Materials"
  | "Bulky / Garden / E-Waste"
  | "Commercial Small-Shop Waste";

export type WasteQuantity = 
  | "1 - 2 Standard Bags"
  | "3 - 5 Standard Bags"
  | "Half Tricycle Cart (3-5 Bins)"
  | "Full Tricycle Cart Load (Heavy)";

export type CollectionStatus = 
  | "requested"          // 1. Request submitted, searching/waiting
  | "negotiating"        // 2. Collector made offer or counter-offering
  | "price_agreed"       // 3. Price agreed by both parties
  | "collector_en_route" // 4. Collector traveling to location
  | "collector_arrived"  // 5. Collector at household
  | "in_progress"        // 6. Loading waste onto tricycle
  | "completed"          // 7. Waste loaded & verified
  | "paid"               // 8. Payment confirmed & receipt generated
  | "cancelled";

export interface PriceOffer {
  id: string;
  proposedBy: "household" | "collector";
  senderId: string;
  senderName: string;
  amount: number; // in GH₵
  note?: string;
  timestamp: string;
  status: "pending" | "accepted" | "rejected" | "countered";
}

export interface CollectionRequest {
  id: string;
  householdId: string;
  householdName: string;
  householdPhone: string;
  householdAvatar?: string;
  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;
  collectorAvatar?: string;
  collectorTricycle?: string;
  
  // Waste details
  wasteCategory: WasteCategory;
  quantity: WasteQuantity;
  description: string;
  photoUrl?: string;
  specialInstructions?: string;
  
  // Location
  area: string;
  address: string;
  landmark: string;
  lat: number;
  lng: number;
  
  // Lifecycle & Negotiation
  status: CollectionStatus;
  createdAt: string;
  scheduledTime?: string;
  initialEstimatedPrice: number;
  agreedPrice?: number;
  negotiationHistory: PriceOffer[];
  
  // Verification & completion
  completionPhotoUrl?: string;
  completedAt?: string;
  
  // Payment
  paymentMethod?: "cash" | "momo";
  momoProvider?: "MTN MoMo" | "Telecel Cash" | "AT Money";
  momoPhoneNumber?: string;
  paymentReference?: string;
  paidAt?: string;
  receiptNumber?: string;
  
  // Feedback
  rating?: number;
  reviewComment?: string;
  ratedAt?: string;
}

export interface Complaint {
  id: string;
  requestId: string;
  complainantId: string;
  complainantName: string;
  complainantRole: UserRole;
  targetId: string;
  targetName: string;
  category: "Spilled Waste" | "No-Show" | "Overcharging Dispute" | "Rude Behavior" | "Damaged Property" | "Other";
  description: string;
  status: "open" | "under_review" | "resolved";
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // or "all"
  role: UserRole | "all";
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "negotiation" | "payment";
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  actor: string;
  actorRole: UserRole | "system";
  details: string;
  timestamp: string;
}

export interface OfflineAction {
  id: string;
  actionType: "mark_arrived" | "start_collection" | "complete_collection" | "record_cash_payment";
  requestId: string;
  payload?: any;
  queuedAt: string;
}

