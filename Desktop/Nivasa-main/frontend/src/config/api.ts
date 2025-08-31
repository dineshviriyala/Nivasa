// Hardcoded Railway API URL
const API_BASE_URL = "https://nivasa-production.up.railway.app";

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  VALIDATE: `${API_BASE_URL}/api/auth/validate`,
  SIGNUP_ADMIN: `${API_BASE_URL}/api/auth/signup-admin`,
  SIGNUP_RESIDENT: `${API_BASE_URL}/api/auth/signup-resident`,
  REGISTER_APARTMENT: `${API_BASE_URL}/api/auth/register-apartment`,
  
  // Complaint endpoints
  NEW_COMPLAINT: `${API_BASE_URL}/api/auth/new-complaint`,
  ALL_COMPLAINTS: `${API_BASE_URL}/api/auth/all-complaint`,
  UPDATE_COMPLAINT: `${API_BASE_URL}/api/auth/update-complaint`,
  STATS: `${API_BASE_URL}/api/auth/stats`,
  
  // Neighbors endpoints
  NEIGHBORS: `${API_BASE_URL}/api/auth/neighbors`,
  
  // Maintenance endpoints
  MAINTENANCE_AMOUNT: `${API_BASE_URL}/api/auth/maintenance/amount`,
  MAINTENANCE_PAYMENT: `${API_BASE_URL}/api/auth/maintenance/payment`,
  MAINTENANCE_PAYMENTS: `${API_BASE_URL}/api/auth/maintenance/payments`,
  MY_PAYMENTS: `${API_BASE_URL}/api/auth/maintenance/my-payments`,
  BANK_DETAILS: `${API_BASE_URL}/api/auth/maintenance/bank-details`,
  PAYMENT_STATUS: `${API_BASE_URL}/api/auth/maintenance/payment`,
  
  // Technician endpoints
  ALL_TECHNICIANS: `${API_BASE_URL}/api/all-technicians`,
  ADD_TECHNICIAN: `${API_BASE_URL}/api/add-technicians`,
  TECHNICIAN_BY_ID: `${API_BASE_URL}/api/technicians`,
  TECHNICIAN_STATUS: `${API_BASE_URL}/api/technicians`,
  TECHNICIAN_SPECIALTY: `${API_BASE_URL}/api/technicians/specialty`,
  AVAILABLE_TECHNICIANS: `${API_BASE_URL}/api/technicians/status/available`,
};

export default API_BASE_URL; 