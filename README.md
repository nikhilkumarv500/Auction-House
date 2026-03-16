# Auction House 🏷️

A real-time bidding platform where users can host auctions and participate in live bidding rooms.

This project was built as a side project to explore **microservices architecture, real-time communication, and distributed systems**.

🚀 **Live Demo**
https://nikhilkumarv-auction-house.netlify.app/

> ⚠️ Best viewed on desktop browsers. Mobile screens are currently not supported.

---

## Features

- Create and host a bid for an item
- Join existing bids and place your own bid amount
- Real-time bid updates for all users in the same bid room
- Live updates on the main bidding dashboard
- Track all bids you have participated in via the **My Bids** page
- Auto-login using JWT authentication

💡 **Test the live updates**
Open the site in two different browsers (for example Chrome and Edge), log in with different accounts, and place bids on the same item to see real-time updates.

---

## Tech Stack

### Frontend

- React
- Vite
- WebSockets for real-time updates

### Backend

- Spring Boot
- Microservices architecture
- JWT Authentication
- Redis Streams (Messaging Queue)

### Database

- PostgreSQL

### Deployment

- Netlify (Frontend)

---

## Architecture Overview

The backend follows a **microservices architecture** consisting of 4 independent services.

- Service Registry (Eureka)
- API Gateway
- Inventory Service
- Main Service

### Service Communication

- **Eureka Service Discovery** for registering and locating services
- **Feign Clients** for inter-service communication
- Built-in **client-side load balancing**

### API Gateway

All requests go through the **API Gateway**, which handles:

- Request routing
- JWT authentication
- Token validation

### Messaging Queue

When a bid ends:

1. The event is published to a **Redis Streams queue**
2. The **Inventory Service** consumes the message
3. Bid history is stored in the database

---

## Real-Time Updates

WebSockets are used to broadcast bid updates instantly to all users inside the same bidding room, similar to a chat system.

---

## Author

**Nikhil Kumar V**

If you try the project and notice any issues or have suggestions, feel free to open an issue or reach out.
