-- ============================================
-- CRUD OPERATIONS: WAREHOUSE & INVENTORY
-- ============================================

-- ============================================
-- Table: Warehouse
-- Columns: WarehouseID, Name, Location, Capacity, Contact
-- ============================================

-- INSERT
INSERT INTO Warehouse (Name, Location, Capacity, Contact)
VALUES ($1, $2, $3, $4)
RETURNING WarehouseID;

-- UPDATE
UPDATE Warehouse
SET Name = $2, Location = $3, Capacity = $4, Contact = $5
WHERE WarehouseID = $1;

-- DELETE
DELETE FROM Warehouse
WHERE WarehouseID = $1;

-- VIEW by ID
SELECT WarehouseID, Name, Location, Capacity, Contact
FROM Warehouse
WHERE WarehouseID = $1;

-- VIEW all
SELECT WarehouseID, Name, Location, Capacity, Contact
FROM Warehouse
ORDER BY Name;


-- ============================================
-- Table: ProductType
-- Columns: ProductTypeID, Name, Description, Grade, UnitOfMeasure
-- ============================================

-- INSERT
INSERT INTO ProductType (Name, Description, Grade, UnitOfMeasure)
VALUES ($1, $2, $3, $4)
RETURNING ProductTypeID;

-- UPDATE
UPDATE ProductType
SET Name = $2, Description = $3, Grade = $4, UnitOfMeasure = $5
WHERE ProductTypeID = $1;

-- DELETE
DELETE FROM ProductType
WHERE ProductTypeID = $1;

-- VIEW by ID
SELECT ProductTypeID, Name, Description, Grade, UnitOfMeasure
FROM ProductType
WHERE ProductTypeID = $1;

-- VIEW all
SELECT ProductTypeID, Name, Description, Grade, UnitOfMeasure
FROM ProductType
ORDER BY Name;


-- ============================================
-- Table: StockItem
-- Columns: StockID, ProductTypeID, WarehouseID, BatchID, Quantity, ShelfLocation
-- ============================================

-- INSERT
INSERT INTO StockItem (ProductTypeID, WarehouseID, BatchID, Quantity, ShelfLocation)
VALUES ($1, $2, $3, $4, $5)
RETURNING StockID;

-- UPDATE
UPDATE StockItem
SET ProductTypeID = $2, WarehouseID = $3, BatchID = $4, 
    Quantity = $5, ShelfLocation = $6
WHERE StockID = $1;

-- DELETE
DELETE FROM StockItem
WHERE StockID = $1;

-- VIEW by ID
SELECT StockID, ProductTypeID, WarehouseID, BatchID, Quantity, ShelfLocation
FROM StockItem
WHERE StockID = $1;

-- VIEW all
SELECT si.StockID, si.ProductTypeID, pt.Name AS ProductName, 
       si.WarehouseID, w.Name AS WarehouseName, si.BatchID, 
       si.Quantity, si.ShelfLocation
FROM StockItem si
LEFT JOIN ProductType pt ON si.ProductTypeID = pt.ProductTypeID
LEFT JOIN Warehouse w ON si.WarehouseID = w.WarehouseID
ORDER BY w.Name, pt.Name;


-- ============================================
-- Table: StockAlert
-- Columns: AlertID, StockID, WarehouseID, AlertType, CreatedAt, Status
-- ============================================

-- INSERT
INSERT INTO StockAlert (StockID, WarehouseID, AlertType, Status)
VALUES ($1, $2, $3, $4)
RETURNING AlertID;

-- UPDATE
UPDATE StockAlert
SET StockID = $2, WarehouseID = $3, AlertType = $4, Status = $5
WHERE AlertID = $1;

-- DELETE
DELETE FROM StockAlert
WHERE AlertID = $1;

-- VIEW by ID
SELECT AlertID, StockID, WarehouseID, AlertType, CreatedAt, Status
FROM StockAlert
WHERE AlertID = $1;

-- VIEW all
SELECT sa.AlertID, sa.StockID, sa.WarehouseID, w.Name AS WarehouseName,
       sa.AlertType, sa.CreatedAt, sa.Status
FROM StockAlert sa
JOIN Warehouse w ON sa.WarehouseID = w.WarehouseID
ORDER BY sa.CreatedAt DESC;


-- ============================================
-- Table: InventoryTransaction
-- Columns: TransactionID, EmployeeID, StockID, WarehouseID, TransactionType, Quantity, TransactionDate, Remarks
-- ============================================

-- INSERT
INSERT INTO InventoryTransaction (EmployeeID, StockID, WarehouseID, TransactionType, Quantity, Remarks)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING TransactionID;

-- UPDATE
UPDATE InventoryTransaction
SET EmployeeID = $2, StockID = $3, WarehouseID = $4, TransactionType = $5,
    Quantity = $6, Remarks = $7
WHERE TransactionID = $1;

-- DELETE
DELETE FROM InventoryTransaction
WHERE TransactionID = $1;

-- VIEW by ID
SELECT TransactionID, EmployeeID, StockID, WarehouseID, TransactionType, 
       Quantity, TransactionDate, Remarks
FROM InventoryTransaction
WHERE TransactionID = $1;

-- VIEW all
SELECT it.TransactionID, it.EmployeeID, e.FullName AS EmployeeName,
       it.StockID, it.WarehouseID, w.Name AS WarehouseName,
       it.TransactionType, it.Quantity, it.TransactionDate, it.Remarks
FROM InventoryTransaction it
LEFT JOIN Employee e ON it.EmployeeID = e.EmployeeID
LEFT JOIN Warehouse w ON it.WarehouseID = w.WarehouseID
ORDER BY it.TransactionDate DESC;
