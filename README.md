
# 🌲 Wood Supply Chain Management System (WSCS)

A comprehensive, cloud-enabled supply chain management platform designed to manage the complete lifecycle of wood products from forest harvesting to customer delivery.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Stakeholders](#stakeholders)
- [Installation](#installation)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Team](#team)
- [Future Enhancements](#future-enhancements)


## 🎯 Overview

The Wood Supply Chain System is a multi-tier supply chain management platform that supports inventory control, order processing, transportation management, compliance monitoring, and comprehensive reporting. The system is accessible via web browsers and mobile devices, enabling real-time collaboration among all stakeholders.

### Key Capabilities

- **Real-time Stock Visibility** based on:
    - Wood species
    - Size and moisture level
    - Batch/lot number
    - Certification status
- Dedicated customer and supplier portals
- Integration with existing enterprise systems
- Role-based access and secure authentication
- Multi-language support (Arabic RTL and English)


## ✨ Features

### Core Modules

#### 1. **Forest Management**

- Add, edit, and manage forest areas with geo-location data
- Schedule and monitor harvesting activities
- Assign forest managers and workers to specific zones


#### 2. **Harvesting Operations**

- Create and track harvest batches by tree type and quantity
- Generate unique batch IDs with QR codes for traceability
- Record harvest volumes and quality indicators


#### 3. **Supplier Management**

- Register, approve, and categorize suppliers
- Maintain supplier profiles, contracts, and pricing
- Rate suppliers based on delivery performance
- View compliance and performance reports


#### 4. **Procurement \& Purchase Orders**

- Create, approve, and track purchase orders
- Support multiple items with pricing and delivery deadlines
- Track order lifecycle (Pending → In Progress → Delivered)
- Generate purchase summaries and cost breakdowns


#### 5. **Transportation Control**

- Register transport companies, trucks, and drivers
- Assign drivers using GIS-based route planning
- Monitor shipment status with proof of delivery
- Track fuel usage and driver performance


#### 6. **Sawmill \& Processing Operations**

- Manage sawmill facilities and processing units
- Create processing orders to convert logs into finished goods
- Track input/output quantities and efficiency
- Log machine usage and manpower allocation


#### 7. **Quality \& Waste Management**

- Conduct quality inspections for processed wood
- Record inspection results and certifications
- Track waste volume, type, and recycling methods
- Analyze waste percentage and efficiency


#### 8. **Warehouse Management**

- Manage warehouses, capacity, and product placement
- Track shelf locations and stock levels
- Configure low-stock alerts
- Support barcode and QR code scanning


#### 9. **Inventory Management**

- Track incoming, outgoing, and damaged stock
- Maintain batch-based inventory control
- Generate stock valuation reports


#### 10. **Sales \& Customer Portal**

- Customer registration and secure login
- Browse product catalog and pricing
- Place orders and track deliveries
- Access invoices and payment history


#### 11. **Invoicing \& Billing**

- Automatically generate invoices
- Support multi-currency and multi-tax formats
- Email invoices or provide downloadable PDFs
- Track unpaid and overdue invoices


#### 12. **Analytics \& Reporting**

- Unified KPI dashboard with supplier performance metrics
- Inventory turnover analysis
- Processing efficiency tracking
- Sales and revenue trend analysis


## 🏗️ System Architecture

The system follows a **three-tier architecture**:

### Frontend Layer

- **Technology**: React.js
- **Features**: Dynamic and responsive UI with reusable components
- **Access**: Web browser-based GUI


### Backend Layer

- **Technology**: Go (Golang)
- **Responsibilities**:
    - Business logic processing
    - Client request handling
    - System rule enforcement
    - Database communication management
    - RESTful API exposure


### Database Layer

- **DBMS**: PostgreSQL
- **Features**:
    - Stores all persistent data
    - Ensures data integrity through constraints and relationships
    - Optimized for complex supply chain operations


## 🛠️ Technology Stack

| Layer | Technology |
| :-- | :-- |
| Frontend | React.js |
| Backend | Go (Golang) |
| Database | PostgreSQL |
| Authentication | JWT-based with 2FA support |
| API Architecture | RESTful |


## 👥 Stakeholders

| Role | Responsibilities |
| :-- | :-- |
| **Admin (Staff)** | Manage users, permissions, system configurations, roles, audit logs, and overall system monitoring |
| **Forest Manager** | Oversee forest zones, manage harvesting schedules, assign field workers |
| **Transport Manager** | Manage transport operations, drivers, trucks, fuel tracking, and delivery route optimization |
| **Suppliers/Vendors** | Provide raw or semi-processed wood materials; manage contracts and compliance |
| **Sawmill Operator** | Process harvested wood into lumber; manage production orders and quality checks |
| **Warehouse Manager** | Manage storage, inventory, and warehouse operations |
| **Logistics Partners** | Collaborate on transport planning, shipments, and last-mile delivery |
| **Sales Officer** | Manage customer sales orders, invoices, and customer relationships |
| **Customer/Retailer** | Browse catalog, place orders, track deliveries, and view payment history |


## 🚀 Installation

### Prerequisites

- Node.js (v16+)
- Go (v1.19+)
- PostgreSQL (v13+)


### Backend Setup

```bash
# Clone the repository
git clone https://github.com/MoMassEg/supply-chain-dashboard.git
cd supply-chain-dashboard

# Navigate to backend directory
cd backend

# Install dependencies
go mod download

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
go run migrations/migrate.go

# Start the server
go run main.go
```


### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend API URL

# Start development server
npm start
```


### Database Setup

```sql
-- Create database
CREATE DATABASE wood_supply_chain;

-- Run the provided SQL scripts from the project documentation
-- Execute DDL scripts for table creation
-- Execute DML scripts for initial data
```


## 🗄️ Database Schema

The system implements a comprehensive relational database schema with the following key entities:

- **User \& Employee Management**: User, Employee, Role, Permission
- **Forest Operations**: Forest, HarvestSchedule, HarvestBatch, TreeSpecies
- **Supplier \& Procurement**: Supplier, PurchaseOrder, PurchaseOrderItem
- **Processing**: ProcessingOrder, ProcessingUnit, ProductType
- **Quality Control**: QualityInspection, WasteRecord, Maintenance
- **Inventory**: Warehouse, StockItem, InventoryTransaction
- **Sales \& Distribution**: Customer, SalesOrder, Shipment, Invoice
- **Transportation**: TransportCompany, Truck, Driver, Route


For detailed schema information, refer to the [Database Documentation](docs/database.md).

## 📡 API Documentation

### Authentication

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token
```


### Forest Management

```http
GET    /api/forests
POST   /api/forests
GET    /api/forests/:id
PUT    /api/forests/:id
DELETE /api/forests/:id
```


### Harvest Operations

```http
GET    /api/harvest-batches
POST   /api/harvest-batches
GET    /api/harvest-batches/:id
PUT    /api/harvest-batches/:id
```


### Purchase Orders

```http
GET    /api/purchase-orders
POST   /api/purchase-orders
GET    /api/purchase-orders/:id
PUT    /api/purchase-orders/:id
DELETE /api/purchase-orders/:id
```

For complete API documentation, visit the [API Reference](docs/api.md).


## 👨‍💻 Team

This project was developed as a Database Systems university project by:


| Name | ID |
| :-- | :-- |
| Mohamed Shaban | 320230188 |
| Sandy Feras | 320230158 |
| Manal Mahmoud | 320230164 |
| Omar Ahmed | 320230172 |


## 🔮 Future Enhancements

- **Predictive Analytics**: Forecast demand and optimize inventory levels
- **Mobile Applications**: Support for field workers and transport staff
- **IoT Integration**: Real-time tracking of shipments, machinery, and inventory
- **Advanced BI Dashboards**: Enhanced KPIs and drill-down analytics
- **AI-Based Optimization**: Transportation routing and resource allocation
- **External System Integration**: Government compliance platforms and enterprise systems


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
