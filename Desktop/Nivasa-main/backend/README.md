# Technician Backend API

This is the backend API for the technician management system.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/apartment-management
```

### 3. Start MongoDB
Make sure MongoDB is running on your system. If using MongoDB locally:
```bash
mongod
```

### 4. Start the Server
```bash
npm start
# or for development with nodemon
npm run dev
```

## API Endpoints

### Technician Management

#### Get All Technicians
- **GET** `/api/all-technicians`
- **Description**: Retrieve all technicians
- **Response**: Array of technician objects

#### Get Technician by ID
- **GET** `/api/technicians/:id`
- **Description**: Get a specific technician by ID
- **Response**: Single technician object

#### Add New Technician
- **POST** `/api/add-technicians`
- **Description**: Create a new technician
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "specialty": "Plumbing",
  "status": "available"
}
```

#### Update Technician Status
- **PATCH** `/api/technicians/:id/status`
- **Description**: Update technician status
- **Body**:
```json
{
  "status": "busy"
}
```

#### Update Technician
- **PUT** `/api/technicians/:id`
- **Description**: Update technician information
- **Body**: Same as POST add-technicians

#### Delete Technician
- **DELETE** `/api/technicians/:id`
- **Description**: Delete a technician

#### Get Technicians by Specialty
- **GET** `/api/technicians/specialty/:specialty`
- **Description**: Get technicians by specialty (case-insensitive)

#### Get Available Technicians
- **GET** `/api/technicians/status/available`
- **Description**: Get only available technicians

## Data Models

### Technician Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required, 10 digits),
  specialty: String (required, enum: ['Plumbing', 'Electrical', 'HVAC', 'General Maintenance', 'Carpentry']),
  status: String (enum: ['available', 'busy', 'offline'], default: 'available'),
  createdAt: Date,
  updatedAt: Date
}
```

## Testing with Postman

### 1. Setup Postman Collection
Create a new collection called "Technician API"

### 2. Environment Variables
Set up environment variables in Postman:
- `base_url`: `https://nivasa-production-7aa9.up.railway.app`

### 3. Test Requests

#### Add Technician
1. Create a new POST request
2. URL: `{{base_url}}/api/add-technicians`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "specialty": "Plumbing",
  "status": "available"
}
```

#### Get All Technicians
1. Create a new GET request
2. URL: `{{base_url}}/api/all-technicians`

#### Update Technician Status
1. Create a new PATCH request
2. URL: `{{base_url}}/api/technicians/:id/status`
3. Body (raw JSON):
```json
{
  "status": "busy"
}
```

#### Delete Technician
1. Create a new DELETE request
2. URL: `{{base_url}}/api/technicians/:id`

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `409`: Conflict (duplicate email)
- `500`: Internal Server Error

Error responses include an `error` field with a descriptive message. 