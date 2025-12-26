-- ============================================
-- ADVANCED QUERIES: DISTRIBUTION & SHIPMENTS
-- ============================================

-- Get shipment tracking details
SELECT s.ShipmentID, s.ShipmentDate, s.Status, s.ProofOfDelivery,
       so.SOID, so.OrderDate, so.DeliveryDate,
       c.Name AS CustomerName, c.Address, c.ContactInfo,
       t.PlateNumber, t.Capacity, e.FullName AS DriverName,
       tc.CompanyName AS TransportCompany,
       r.StartLocation, r.EndLocation, r.DistanceKM, r.EstimatedTime
FROM Shipment s
LEFT JOIN SalesOrder so ON s.SOID = so.SOID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
LEFT JOIN Truck t ON s.TruckID = t.TruckID
LEFT JOIN Driver d ON s.DriverID = d.DriverID
LEFT JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN TransportCompany tc ON s.CompanyID = tc.CompanyID
LEFT JOIN Route r ON s.RouteID = r.RouteID
WHERE s.ShipmentID = $1;

-- Get pending shipments
SELECT s.ShipmentID, s.ShipmentDate, s.Status,
       so.SOID, c.Name AS CustomerName, c.Address,
       t.PlateNumber, e.FullName AS DriverName,
       r.StartLocation, r.EndLocation
FROM Shipment s
LEFT JOIN SalesOrder so ON s.SOID = so.SOID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
LEFT JOIN Truck t ON s.TruckID = t.TruckID
LEFT JOIN Driver d ON s.DriverID = d.DriverID
LEFT JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN Route r ON s.RouteID = r.RouteID
WHERE s.Status IN ('pending', 'dispatched', 'in_transit')
ORDER BY s.ShipmentDate;

-- Get delivery performance by customer
SELECT c.CustomerID, c.Name AS CustomerName,
       COUNT(s.ShipmentID) AS TotalShipments,
       COUNT(CASE WHEN s.Status = 'delivered' THEN 1 END) AS DeliveredShipments,
       COUNT(CASE WHEN s.Status = 'in_transit' THEN 1 END) AS InTransitShipments,
       AVG(CASE 
           WHEN s.Status = 'delivered' AND so.DeliveryDate IS NOT NULL THEN
               EXTRACT(DAY FROM (s.ShipmentDate - so.DeliveryDate))
           ELSE NULL
       END) AS AvgDeliveryTimeDays
FROM Customer c
LEFT JOIN SalesOrder so ON c.CustomerID = so.CustomerID
LEFT JOIN Shipment s ON so.SOID = s.SOID
GROUP BY c.CustomerID, c.Name
ORDER BY TotalShipments DESC;

-- Get shipment summary by route
SELECT r.RouteID, r.StartLocation, r.EndLocation, r.DistanceKM,
       COUNT(s.ShipmentID) AS TotalShipments,
       COUNT(CASE WHEN s.Status = 'delivered' THEN 1 END) AS DeliveredShipments,
       COUNT(CASE WHEN s.Status = 'in_transit' THEN 1 END) AS InTransitShipments
FROM Route r
LEFT JOIN Shipment s ON r.RouteID = s.RouteID
GROUP BY r.RouteID, r.StartLocation, r.EndLocation, r.DistanceKM
ORDER BY TotalShipments DESC;

-- Get shipments with proof of delivery
SELECT s.ShipmentID, s.ShipmentDate, s.Status, s.ProofOfDelivery,
       so.SOID, c.Name AS CustomerName,
       e.FullName AS DriverName, t.PlateNumber
FROM Shipment s
LEFT JOIN SalesOrder so ON s.SOID = so.SOID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
LEFT JOIN Truck t ON s.TruckID = t.TruckID
LEFT JOIN Driver d ON s.DriverID = d.DriverID
LEFT JOIN Employee e ON d.EmployeeID = e.EmployeeID
WHERE s.ProofOfDelivery IS NOT NULL AND s.Status = 'delivered'
ORDER BY s.ShipmentDate DESC;


-- ============================================
-- ADVANCED QUERIES: CUSTOMER PORTAL
-- ============================================

-- Get customer order history
SELECT so.SOID, so.OrderDate, so.DeliveryDate, so.Status, so.TotalAmount,
       COUNT(soi.SOItemID) AS TotalItems,
       s.ShipmentID, s.ShipmentDate, s.Status AS ShipmentStatus
FROM SalesOrder so
LEFT JOIN SalesOrderItem soi ON so.SOID = soi.SOID
LEFT JOIN Shipment s ON so.SOID = s.SOID
WHERE so.CustomerID = $1
GROUP BY so.SOID, so.OrderDate, so.DeliveryDate, so.Status, so.TotalAmount,
         s.ShipmentID, s.ShipmentDate, s.Status
ORDER BY so.OrderDate DESC;

-- Get customer order details with items
SELECT so.SOID, so.OrderDate, so.DeliveryDate, so.Status, so.TotalAmount,
       soi.SOItemID, pt.Name AS ProductName, pt.Grade,
       soi.Quantity, soi.UnitPrice, soi.Discount, soi.Subtotal
FROM SalesOrder so
LEFT JOIN SalesOrderItem soi ON so.SOID = soi.SOID
LEFT JOIN ProductType pt ON soi.ProductTypeID = pt.ProductTypeID
WHERE so.CustomerID = $1 AND so.SOID = $2
ORDER BY soi.SOItemID;

-- Get available products catalog for customers
SELECT pt.ProductTypeID, pt.Name AS ProductName, pt.Description, 
       pt.Grade, pt.UnitOfMeasure,
       SUM(si.Quantity) AS AvailableQuantity,
       AVG(soi.UnitPrice) AS AvgPrice
FROM ProductType pt
LEFT JOIN StockItem si ON pt.ProductTypeID = si.ProductTypeID
LEFT JOIN SalesOrderItem soi ON pt.ProductTypeID = soi.ProductTypeID
GROUP BY pt.ProductTypeID, pt.Name, pt.Description, pt.Grade, pt.UnitOfMeasure
HAVING SUM(si.Quantity) > 0
ORDER BY pt.Name;

-- Get customer invoice history
SELECT i.InvoiceID, i.InvoiceDate, i.DueDate, i.TotalAmount, i.Tax, i.Currency, i.Status,
       so.SOID, so.OrderDate,
       SUM(p.Amount) AS TotalPaid,
       i.TotalAmount - COALESCE(SUM(p.Amount), 0) AS AmountDue
FROM Invoice i
JOIN SalesOrder so ON i.SOID = so.SOID
LEFT JOIN Payment p ON i.InvoiceID = p.InvoiceID
WHERE so.CustomerID = $1
GROUP BY i.InvoiceID, i.InvoiceDate, i.DueDate, i.TotalAmount, i.Tax, i.Currency, i.Status,
         so.SOID, so.OrderDate
ORDER BY i.InvoiceDate DESC;

-- Get customer payment history
SELECT p.PaymentID, p.PaymentDate, p.Amount, p.Method, p.ReferenceNo, p.Status,
       i.InvoiceID, i.InvoiceDate, i.TotalAmount AS InvoiceAmount
FROM Payment p
JOIN Invoice i ON p.InvoiceID = i.InvoiceID
JOIN SalesOrder so ON i.SOID = so.SOID
WHERE so.CustomerID = $1
ORDER BY p.PaymentDate DESC;

-- Get customer shipment tracking
SELECT s.ShipmentID, s.ShipmentDate, s.Status,
       so.SOID, so.OrderDate,
       t.PlateNumber, e.FullName AS DriverName,
       r.StartLocation, r.EndLocation, r.DistanceKM
FROM Shipment s
JOIN SalesOrder so ON s.SOID = so.SOID
LEFT JOIN Truck t ON s.TruckID = t.TruckID
LEFT JOIN Driver d ON s.DriverID = d.DriverID
LEFT JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN Route r ON s.RouteID = r.RouteID
WHERE so.CustomerID = $1
ORDER BY s.ShipmentDate DESC;


-- ============================================
-- ADVANCED QUERIES: SALES ORDERS
-- ============================================

-- Get sales orders by status
SELECT so.SOID, so.OrderDate, so.DeliveryDate, so.Status, so.TotalAmount,
       e.FullName AS SalesOfficer, c.Name AS CustomerName, c.ContactInfo
FROM SalesOrder so
LEFT JOIN Employee e ON so.EmployeeID = e.EmployeeID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
WHERE so.Status = $1
ORDER BY so.OrderDate DESC;

-- Get sales orders by date range
SELECT so.SOID, so.OrderDate, so.DeliveryDate, so.Status, so.TotalAmount,
       e.FullName AS SalesOfficer, c.Name AS CustomerName
FROM SalesOrder so
LEFT JOIN Employee e ON so.EmployeeID = e.EmployeeID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
WHERE so.OrderDate BETWEEN $1 AND $2
ORDER BY so.OrderDate DESC;

-- Get sales order summary by customer
SELECT c.CustomerID, c.Name AS CustomerName, c.Retailer, c.EndUser,
       COUNT(so.SOID) AS TotalOrders,
       SUM(so.TotalAmount) AS TotalRevenue,
       AVG(so.TotalAmount) AS AvgOrderValue,
       MIN(so.OrderDate) AS FirstOrderDate,
       MAX(so.OrderDate) AS LastOrderDate
FROM Customer c
LEFT JOIN SalesOrder so ON c.CustomerID = so.CustomerID
WHERE so.OrderDate BETWEEN $1 AND $2
GROUP BY c.CustomerID, c.Name, c.Retailer, c.EndUser
ORDER BY TotalRevenue DESC;

-- Get sales order summary by employee
SELECT e.EmployeeID, e.FullName, e.Department, e.Position,
       COUNT(so.SOID) AS TotalOrders,
       SUM(so.TotalAmount) AS TotalRevenue,
       AVG(so.TotalAmount) AS AvgOrderValue
FROM Employee e
LEFT JOIN SalesOrder so ON e.EmployeeID = so.EmployeeID
WHERE so.OrderDate BETWEEN $1 AND $2
GROUP BY e.EmployeeID, e.FullName, e.Department, e.Position
ORDER BY TotalRevenue DESC;

-- Get sales order details with items and shipment
SELECT so.SOID, so.OrderDate, so.DeliveryDate, so.Status, so.TotalAmount,
       c.Name AS CustomerName, c.Address, e.FullName AS SalesOfficer,
       soi.SOItemID, pt.Name AS ProductName, soi.Quantity, soi.UnitPrice, soi.Discount, soi.Subtotal,
       s.ShipmentID, s.ShipmentDate, s.Status AS ShipmentStatus
FROM SalesOrder so
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
LEFT JOIN Employee e ON so.EmployeeID = e.EmployeeID
LEFT JOIN SalesOrderItem soi ON so.SOID = soi.SOID
LEFT JOIN ProductType pt ON soi.ProductTypeID = pt.ProductTypeID
LEFT JOIN Shipment s ON so.SOID = s.SOID
WHERE so.SOID = $1
ORDER BY soi.SOItemID;

-- Get top selling products
SELECT pt.ProductTypeID, pt.Name AS ProductName, pt.Grade,
       COUNT(soi.SOItemID) AS TotalOrderItems,
       SUM(soi.Quantity) AS TotalQuantitySold,
       SUM(soi.Subtotal) AS TotalRevenue,
       AVG(soi.UnitPrice) AS AvgSellingPrice
FROM ProductType pt
JOIN SalesOrderItem soi ON pt.ProductTypeID = soi.ProductTypeID
JOIN SalesOrder so ON soi.SOID = so.SOID
WHERE so.OrderDate BETWEEN $1 AND $2
GROUP BY pt.ProductTypeID, pt.Name, pt.Grade
ORDER BY TotalRevenue DESC
LIMIT $3;

-- Get sales revenue by month
SELECT 
    DATE_TRUNC('month', so.OrderDate) AS Month,
    COUNT(so.SOID) AS TotalOrders,
    SUM(so.TotalAmount) AS TotalRevenue,
    AVG(so.TotalAmount) AS AvgOrderValue,
    COUNT(DISTINCT so.CustomerID) AS UniqueCustomers
FROM SalesOrder so
WHERE so.OrderDate BETWEEN $1 AND $2
GROUP BY DATE_TRUNC('month', so.OrderDate)
ORDER BY Month DESC;

-- Get sales by customer type (retailer vs end user)
SELECT 
    CASE 
        WHEN c.Retailer = TRUE THEN 'Retailer'
        WHEN c.EndUser = TRUE THEN 'End User'
        ELSE 'Other'
    END AS CustomerType,
    COUNT(so.SOID) AS TotalOrders,
    SUM(so.TotalAmount) AS TotalRevenue,
    AVG(so.TotalAmount) AS AvgOrderValue
FROM SalesOrder so
JOIN Customer c ON so.CustomerID = c.CustomerID
WHERE so.OrderDate BETWEEN $1 AND $2
GROUP BY CustomerType
ORDER BY TotalRevenue DESC;
