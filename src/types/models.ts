
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: "business" | "ngo";
  documentNumber: string; // CPF or CNPJ
  businessType?: string; // For business users
  ngoType?: string; // For NGO users
  createdAt: Date;
}

export interface Donation {
  id: string;
  businessId: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  expirationDate: Date;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryType: "pickup" | "delivery";
  status: "available" | "reserved" | "collected" | "delivered" | "expired";
  createdAt: Date;
}

export interface Reservation {
  id: string;
  donationId: string;
  ngoId: string;
  scheduledDate: Date;
  status: "scheduled" | "completed" | "canceled";
  createdAt: Date;
}

export interface EnvironmentalImpact {
  id: string;
  donationId: string;
  co2Saved: number; // kg
  waterSaved: number; // liters
  createdAt: Date;
}
