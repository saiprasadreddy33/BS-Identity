# Identity Reconciliation 

This project provides a backend solution for identity reconciliation. It's built with Express.js and MongoDB and provides an API endpoint to reconcile identities based on email and phone number.

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository:
   git clone https://github.com/your-username/identity-reconciliation-backend.git
cd ./
npm install

Usage
Endpoint
The following endpoint is provided:

POST /identify: Identify and reconcile contacts based on email and phone number.
Request
Send a POST request to /identify with a JSON body containing email and/or phoneNumber.

Example request body:
{
  "email": "example@example.com",
  "phoneNumber": "1234567890"
}
Response
The endpoint returns a JSON response containing contact information.

Example response:

{
  "contact": {
    "primaryContatctId": "61171e80a4e47e4b7c3100a3",
    "emails": ["example@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": ["61171e80a4e47e4b7c3100a4"]
  }
}
Test Scenarios
You can test the functionality of the API using the provided HTML page. Open index.html in a web browser and use the "Test Scenarios" buttons to perform different testing scenarios.

Database Schema
The application uses the following database schema for contacts:

javascript
const contactSchema = new Schema<IContact>({
  phoneNumber: { type: String, required: false },
  email: { type: String, required: false },
  linkedId: { type: Schema.Types.ObjectId, required: false },
  linkPrecedence: { type: String, required: true, enum: ['primary', 'secondary'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, required: false }
});
