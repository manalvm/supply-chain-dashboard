-- ============================================
-- CRUD OPERATIONS: CUSTOMER & SALES
-- ============================================

-- ============================================
-- Table: Customer
-- Columns: CustomerID, Name, Retailer, EndUser, ContactInfo, Address, TaxNumber
-- ============================================

-- INSERT
INSERT INTO Customer (Name, Retailer, EndUser, ContactInfo, Address, TaxNumber)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING CustomerID;

-- UPDATE
UPDATE Customer
SET Name = $2, Retailer = $3, EndUser = $4, ContactInfo = $5,
    Address = $6, TaxNumber = $7
WHERE CustomerID = $1;

-- DELETE
DELETE FROM Customer
WHERE CustomerID = $1;

-- VIEW by ID
SELECT CustomerID, Name, Retailer, EndUser, ContactInfo, Address, TaxNumber
FROM Customer
WHERE CustomerID = $1;

-- VIEW all
SELECT CustomerID, Name, Retailer, EndUser, ContactInfo, Address, TaxNumber
FROM Customer
ORDER BY Name;


-- ============================================
-- Table: SalesOrder
-- Columns: SOID, EmployeeID, CustomerID, OrderDate, DeliveryDate, Status, TotalAmount
-- ============================================

-- INSERT
INSERT INTO SalesOrder (EmployeeID, CustomerID, OrderDate, DeliveryDate, Status, TotalAmount)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING SOID;

-- UPDATE
UPDATE SalesOrder
SET EmployeeID = $2, CustomerID = $3, OrderDate = $4, 
    DeliveryDate = $5, Status = $6, TotalAmount = $7
WHERE SOID = $1;

-- DELETE
DELETE FROM SalesOrder
WHERE SOID = $1;

-- VIEW by ID
SELECT SOID, EmployeeID, CustomerID, OrderDate, DeliveryDate, Status, TotalAmount
FROM SalesOrder
WHERE SOID = $1;

-- VIEW all
SELECT so.SOID, so.EmployeeID, e.FullName AS EmployeeName,
       so.CustomerID, c.Name AS CustomerName,
       so.OrderDate, so.DeliveryDate, so.Status, so.TotalAmount
FROM SalesOrder so
LEFT JOIN Employee e ON so.EmployeeID = e.EmployeeID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
ORDER BY so.OrderDate DESC;


-- ============================================
-- Table: SalesOrderItem
-- Columns: SOItemID, SOID, ProductTypeID, Quantity, UnitPrice, Discount, Subtotal
-- ============================================

-- INSERT
INSERT INTO SalesOrderItem (SOID, ProductTypeID, Quantity, UnitPrice, Discount, Subtotal)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING SOItemID;

-- UPDATE
UPDATE SalesOrderItem
SET SOID = $2, ProductTypeID = $3, Quantity = $4, 
    UnitPrice = $5, Discount = $6, Subtotal = $7
WHERE SOItemID = $1;

-- DELETE
DELETE FROM SalesOrderItem
WHERE SOItemID = $1;

-- VIEW by ID
SELECT SOItemID, SOID, ProductTypeID, Quantity, UnitPrice, Discount, Subtotal
FROM SalesOrderItem
WHERE SOItemID = $1;

-- VIEW all
SELECT soi.SOItemID, soi.SOID, soi.ProductTypeID, pt.Name AS ProductName,
       soi.Quantity, soi.UnitPrice, soi.Discount, soi.Subtotal
FROM SalesOrderItem soi
LEFT JOIN ProductType pt ON soi.ProductTypeID = pt.ProductTypeID
ORDER BY soi.SOID, soi.SOItemID;
