-- ============================================
-- CRUD OPERATIONS: PROCUREMENT & PURCHASE ORDERS
-- ============================================

-- ============================================
-- Table: PurchaseOrder
-- Columns: POID, EmployeeID, SupplierID, OrderDate, ExpectedDeliveryDate, Status, TotalAmount
-- ============================================

-- INSERT
INSERT INTO PurchaseOrder (EmployeeID, SupplierID, OrderDate, ExpectedDeliveryDate, Status, TotalAmount)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING POID;

-- UPDATE
UPDATE PurchaseOrder
SET EmployeeID = $2, SupplierID = $3, OrderDate = $4, 
    ExpectedDeliveryDate = $5, Status = $6, TotalAmount = $7
WHERE POID = $1;

-- DELETE
DELETE FROM PurchaseOrder
WHERE POID = $1;

-- VIEW by ID
SELECT POID, EmployeeID, SupplierID, OrderDate, ExpectedDeliveryDate, Status, TotalAmount
FROM PurchaseOrder
WHERE POID = $1;

-- VIEW all
SELECT po.POID, po.EmployeeID, e.FullName AS EmployeeName,
       po.SupplierID, s.CompanyName AS SupplierName,
       po.OrderDate, po.ExpectedDeliveryDate, po.Status, po.TotalAmount
FROM PurchaseOrder po
LEFT JOIN Employee e ON po.EmployeeID = e.EmployeeID
LEFT JOIN Supplier s ON po.SupplierID = s.SupplierID
ORDER BY po.OrderDate DESC;


-- ============================================
-- Table: PurchaseOrderItem
-- Columns: POItemID, POID, ProductTypeID, Quantity, UnitPrice, Subtotal
-- ============================================

-- INSERT
INSERT INTO PurchaseOrderItem (POID, ProductTypeID, Quantity, UnitPrice, Subtotal)
VALUES ($1, $2, $3, $4, $5)
RETURNING POItemID;

-- UPDATE
UPDATE PurchaseOrderItem
SET POID = $2, ProductTypeID = $3, Quantity = $4, 
    UnitPrice = $5, Subtotal = $6
WHERE POItemID = $1;

-- DELETE
DELETE FROM PurchaseOrderItem
WHERE POItemID = $1;

-- VIEW by ID
SELECT POItemID, POID, ProductTypeID, Quantity, UnitPrice, Subtotal
FROM PurchaseOrderItem
WHERE POItemID = $1;

-- VIEW all
SELECT poi.POItemID, poi.POID, poi.ProductTypeID, pt.Name AS ProductName,
       poi.Quantity, poi.UnitPrice, poi.Subtotal
FROM PurchaseOrderItem poi
LEFT JOIN ProductType pt ON poi.ProductTypeID = pt.ProductTypeID
ORDER BY poi.POID, poi.POItemID;
