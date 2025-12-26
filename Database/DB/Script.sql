
-- Create database
CREATE DATABASE pern_todo;

-- Connect to database
\c pern_todo;

CREATE TABLE "User" (
    User_ID SERIAL PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    First_Name VARCHAR(100),
    Last_Name VARCHAR(100),
    Phone_Number VARCHAR(20),
    Status VARCHAR(50) DEFAULT 'active',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Permission (
    PermissionID SERIAL PRIMARY KEY,
    ModuleName VARCHAR(100) NOT NULL,
    ActionType VARCHAR(50) NOT NULL
);

CREATE TABLE Role (
    Role_ID SERIAL PRIMARY KEY,
    User_ID INTEGER REFERENCES "User"(User_ID) ON DELETE CASCADE,
    Role_Name VARCHAR(100) NOT NULL,
    Description TEXT
);

CREATE TABLE Role_Permission (
    Role_ID INTEGER REFERENCES Role(Role_ID) ON DELETE CASCADE,
    PermissionID INTEGER REFERENCES Permission(PermissionID) ON DELETE CASCADE,
    PRIMARY KEY (Role_ID, PermissionID)
);

CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    FullName VARCHAR(200) NOT NULL,
    Department VARCHAR(100),
    Position VARCHAR(100),
    HireDate DATE,
    PerformanceRating DECIMAL(3,2)
);

CREATE TABLE Supplier (
    SupplierID SERIAL PRIMARY KEY,
    CompanyName VARCHAR(200) NOT NULL,
    ContactPerson VARCHAR(200),
    Email VARCHAR(255),
    Phone VARCHAR(20),
    ComplianceStatus VARCHAR(50),
    Raw BOOLEAN DEFAULT FALSE,
    Semi_Processed BOOLEAN DEFAULT FALSE
);

CREATE TABLE ProductType (
    ProductTypeID SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Description TEXT,
    Grade VARCHAR(50),
    UnitOfMeasure VARCHAR(50)
);

CREATE TABLE Customer (
    CustomerID SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Retailer BOOLEAN DEFAULT FALSE,
    EndUser BOOLEAN DEFAULT FALSE,
    ContactInfo TEXT,
    Address TEXT,
    TaxNumber VARCHAR(50)
);

CREATE TABLE Forest (
    ForestID SERIAL PRIMARY KEY,
    ForestName VARCHAR(200) NOT NULL,
    GeoLocation TEXT,
    AreaSize DECIMAL(15,2),
    OwnershipType VARCHAR(50),
    Status VARCHAR(50)
);

CREATE TABLE TreeSpecies (
    SpeciesID SERIAL PRIMARY KEY,
    SpeciesName VARCHAR(200) NOT NULL,
    AverageHeight DECIMAL(10,2),
    Density DECIMAL(10,2),
    MoistureContent DECIMAL(5,2),
    Grade VARCHAR(50)
);

CREATE TABLE Warehouse (
    WarehouseID SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Location TEXT,
    Capacity DECIMAL(15,2),
    Contact VARCHAR(200)
);

CREATE TABLE Sawmill (
    SawmillID SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Location TEXT,
    Capacity DECIMAL(15,2),
    Status VARCHAR(50)
);

CREATE TABLE TransportCompany (
    CompanyID SERIAL PRIMARY KEY,
    CompanyName VARCHAR(200) NOT NULL,
    ContactInfo TEXT,
    LicenseNumber VARCHAR(100),
    Rating DECIMAL(3,2)
);

CREATE TABLE HarvestSchedule (
    ScheduleID SERIAL PRIMARY KEY,
    ForestID INTEGER REFERENCES Forest(ForestID) ON DELETE CASCADE,
    StartDate DATE,
    EndDate DATE,
    Status VARCHAR(50)
);

CREATE TABLE HarvestBatch (
    BatchID SERIAL PRIMARY KEY,
    ForestID INTEGER REFERENCES Forest(ForestID) ON DELETE SET NULL,
    SpeciesID INTEGER REFERENCES TreeSpecies(SpeciesID) ON DELETE SET NULL,
    ScheduleID INTEGER REFERENCES HarvestSchedule(ScheduleID) ON DELETE SET NULL,
    Quantity DECIMAL(10,2) NOT NULL,
    HarvestDate DATE,
    QualityIndicator VARCHAR(50),
    QRCode VARCHAR(200) UNIQUE
);

CREATE TABLE ProcessingUnit (
    UnitID SERIAL PRIMARY KEY,
    SawmillID INTEGER REFERENCES Sawmill(SawmillID) ON DELETE CASCADE,
    Cutting VARCHAR(50),
    Drying VARCHAR(50),
    Finishing VARCHAR(50),
    Capacity DECIMAL(10,2),
    Status VARCHAR(50)
);

CREATE TABLE ProcessingOrder (
    ProcessingID SERIAL PRIMARY KEY,
    ProductTypeID INTEGER REFERENCES ProductType(ProductTypeID) ON DELETE SET NULL,
    UnitID INTEGER REFERENCES ProcessingUnit(UnitID) ON DELETE SET NULL,
    StartDate DATE,
    EndDate DATE,
    OutputQuantity DECIMAL(10,2),
    EfficiencyRate DECIMAL(5,2)
);

CREATE TABLE StockItem (
    StockID SERIAL PRIMARY KEY,
    ProductTypeID INTEGER REFERENCES ProductType(ProductTypeID) ON DELETE SET NULL,
    WarehouseID INTEGER REFERENCES Warehouse(WarehouseID) ON DELETE SET NULL,
    BatchID INTEGER REFERENCES HarvestBatch(BatchID) ON DELETE SET NULL,
    Quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    ShelfLocation VARCHAR(100)
);

CREATE TABLE PurchaseOrder (
    POID SERIAL PRIMARY KEY,
    EmployeeID INTEGER REFERENCES Employee(EmployeeID) ON DELETE SET NULL,
    SupplierID INTEGER REFERENCES Supplier(SupplierID) ON DELETE SET NULL,
    OrderDate DATE NOT NULL,
    ExpectedDeliveryDate DATE,
    Status VARCHAR(50) DEFAULT 'pending',
    TotalAmount DECIMAL(15,2)
);

CREATE TABLE PurchaseOrderItem (
    POItemID SERIAL PRIMARY KEY,
    POID INTEGER REFERENCES PurchaseOrder(POID) ON DELETE CASCADE,
    ProductTypeID INTEGER REFERENCES ProductType(ProductTypeID) ON DELETE SET NULL,
    Quantity DECIMAL(10,2) NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(15,2) NOT NULL
);

CREATE TABLE SalesOrder (
    SOID SERIAL PRIMARY KEY,
    EmployeeID INTEGER REFERENCES Employee(EmployeeID) ON DELETE SET NULL,
    CustomerID INTEGER REFERENCES Customer(CustomerID) ON DELETE SET NULL,
    OrderDate DATE NOT NULL,
    DeliveryDate DATE,
    Status VARCHAR(50) DEFAULT 'pending',
    TotalAmount DECIMAL(15,2)
);

CREATE TABLE SalesOrderItem (
    SOItemID SERIAL PRIMARY KEY,
    SOID INTEGER REFERENCES SalesOrder(SOID) ON DELETE CASCADE,
    ProductTypeID INTEGER REFERENCES ProductType(ProductTypeID) ON DELETE SET NULL,
    Quantity DECIMAL(10,2) NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Discount DECIMAL(10,2) DEFAULT 0,
    Subtotal DECIMAL(15,2) NOT NULL
);

CREATE TABLE Truck (
    TruckID SERIAL PRIMARY KEY,
    CompanyID INTEGER REFERENCES TransportCompany(CompanyID) ON DELETE SET NULL,
    PlateNumber VARCHAR(50) UNIQUE NOT NULL,
    Capacity DECIMAL(10,2),
    FuelType VARCHAR(50),
    Status VARCHAR(50)
);

CREATE TABLE Driver (
    DriverID SERIAL PRIMARY KEY,
    EmployeeID INTEGER REFERENCES Employee(EmployeeID) ON DELETE CASCADE,
    LicenseNumber VARCHAR(100) UNIQUE NOT NULL,
    ExperienceYears INTEGER,
    Status VARCHAR(50)
);

CREATE TABLE Route (
    RouteID SERIAL PRIMARY KEY,
    StartLocation TEXT NOT NULL,
    EndLocation TEXT NOT NULL,
    DistanceKM DECIMAL(10,2),
    EstimatedTime INTERVAL
);

CREATE TABLE Shipment (
    ShipmentID SERIAL PRIMARY KEY,
    SOID INTEGER REFERENCES SalesOrder(SOID) ON DELETE SET NULL,
    TruckID INTEGER REFERENCES Truck(TruckID) ON DELETE SET NULL,
    DriverID INTEGER REFERENCES Driver(DriverID) ON DELETE SET NULL,
    CompanyID INTEGER REFERENCES TransportCompany(CompanyID) ON DELETE SET NULL,
    RouteID INTEGER REFERENCES Route(RouteID) ON DELETE SET NULL,
    ShipmentDate DATE,
    Status VARCHAR(50),
    ProofOfDelivery TEXT
);

CREATE TABLE QualityInspection (
    InspectionID SERIAL PRIMARY KEY,
    EmployeeID INTEGER REFERENCES Employee(EmployeeID) ON DELETE SET NULL,
    ProcessingID INTEGER REFERENCES ProcessingOrder(ProcessingID) ON DELETE SET NULL,
    POItemID INTEGER REFERENCES PurchaseOrderItem(POItemID) ON DELETE SET NULL,
    BatchID INTEGER REFERENCES HarvestBatch(BatchID) ON DELETE SET NULL,
    Result VARCHAR(50),
    MoistureLevel DECIMAL(5,2),
    CertificationID VARCHAR(100),
    Date DATE
);

CREATE TABLE StockAlert (
    AlertID SERIAL PRIMARY KEY,
    StockID INTEGER REFERENCES StockItem(StockID) ON DELETE CASCADE,
    WarehouseID INTEGER REFERENCES Warehouse(WarehouseID) ON DELETE CASCADE,
    AlertType VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE InventoryTransaction (
    TransactionID SERIAL PRIMARY KEY,
    EmployeeID INTEGER REFERENCES Employee(EmployeeID) ON DELETE SET NULL,
    StockID INTEGER REFERENCES StockItem(StockID) ON DELETE SET NULL,
    WarehouseID INTEGER REFERENCES Warehouse(WarehouseID) ON DELETE SET NULL,
    TransactionType VARCHAR(50) NOT NULL,
    Quantity DECIMAL(10,2) NOT NULL,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Remarks TEXT
);

CREATE TABLE Invoice (
    InvoiceID SERIAL PRIMARY KEY,
    SOID INTEGER REFERENCES SalesOrder(SOID) ON DELETE CASCADE,
    InvoiceDate DATE NOT NULL,
    DueDate DATE,
    TotalAmount DECIMAL(15,2) NOT NULL,
    Tax DECIMAL(10,2),
    Currency VARCHAR(10) DEFAULT 'USD',
    Status VARCHAR(50) DEFAULT 'unpaid'
);

CREATE TABLE Payment (
    PaymentID SERIAL PRIMARY KEY,
    InvoiceID INTEGER REFERENCES Invoice(InvoiceID) ON DELETE CASCADE,
    PaymentDate DATE NOT NULL,
    Amount DECIMAL(15,2) NOT NULL,
    Method VARCHAR(50),
    ReferenceNo VARCHAR(100),
    Status VARCHAR(50) DEFAULT 'completed'
);

CREATE TABLE HarvestBatch_Processing (
    ProcessingID INTEGER REFERENCES ProcessingOrder(ProcessingID) ON DELETE CASCADE,
    BatchID INTEGER REFERENCES HarvestBatch(BatchID) ON DELETE CASCADE,
    PRIMARY KEY (ProcessingID, BatchID)
);

CREATE TABLE WasteRecord (
    WasteID SERIAL PRIMARY KEY,
    ProcessingID INTEGER REFERENCES ProcessingOrder(ProcessingID) ON DELETE CASCADE,
    WasteType VARCHAR(100),
    Volume DECIMAL(10,2),
    DisposalMethod VARCHAR(100),
    Recycled BOOLEAN DEFAULT FALSE
);

CREATE TABLE MaintenanceRecord (
    MaintenanceID SERIAL PRIMARY KEY,
    UnitID INTEGER REFERENCES ProcessingUnit(UnitID) ON DELETE CASCADE,
    MaintenanceDate DATE,
    Description TEXT,
    Cost DECIMAL(10,2),
    PartsUsed TEXT,
    DowntimeHours DECIMAL(5,2)
);

CREATE TABLE WorkerAssignment (
    AssignmentID SERIAL PRIMARY KEY,
    EmployeeID INTEGER REFERENCES Employee(EmployeeID) ON DELETE CASCADE,
    ProcessingID INTEGER REFERENCES ProcessingOrder(ProcessingID) ON DELETE CASCADE,
    RoleInTask VARCHAR(100),
    Notes TEXT
);

CREATE TABLE FuelLog (
    FuelLogID SERIAL PRIMARY KEY,
    DriverID INTEGER REFERENCES Driver(DriverID) ON DELETE SET NULL,
    TruckID INTEGER REFERENCES Truck(TruckID) ON DELETE SET NULL,
    TripDate DATE,
    DistanceTraveled DECIMAL(10,2)
);

CREATE TABLE AuditLog (
    LogID SERIAL PRIMARY KEY,
    User_ID INTEGER REFERENCES "User"(User_ID) ON DELETE SET NULL,
    ActionType VARCHAR(100) NOT NULL,
    EntityAffected VARCHAR(100),
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Description TEXT,
    IPAddress VARCHAR(45)
);

CREATE TABLE User_Employee_Assignment (
    User_ID INTEGER REFERENCES "User"(User_ID) ON DELETE CASCADE,
    EmployeeID INTEGER REFERENCES Employee(EmployeeID) ON DELETE CASCADE,
    PRIMARY KEY (User_ID, EmployeeID)
);

CREATE TABLE Management_Insights (
    Report_ID SERIAL PRIMARY KEY,
    EmployeeID INTEGER REFERENCES Employee(EmployeeID) ON DELETE CASCADE,
    KPI_Type VARCHAR(100),
    Time_Period VARCHAR(100)
);

CREATE TABLE SupplierPerformance (
    PerformanceID SERIAL PRIMARY KEY,
    SupplierID INTEGER REFERENCES Supplier(SupplierID) ON DELETE CASCADE,
    Rating DECIMAL(3,2),
    DeliveryTimeliness DECIMAL(5,2),
    QualityScore DECIMAL(5,2),
    ReviewDate DATE
);

CREATE TABLE SupplierContract (
    ContractID SERIAL PRIMARY KEY,
    SupplierID INTEGER REFERENCES Supplier(SupplierID) ON DELETE CASCADE,
    StartDate DATE,
    EndDate DATE,
    Terms TEXT,
    ContractValue DECIMAL(15,2),
    Status VARCHAR(50)
);
