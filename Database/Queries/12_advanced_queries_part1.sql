-- ============================================
-- ADVANCED QUERIES: FOREST MANAGEMENT
-- ============================================

-- Get all forests by status
SELECT ForestID, ForestName, GeoLocation, AreaSize, OwnershipType, Status
FROM Forest
WHERE Status = $1
ORDER BY ForestName;

-- Get forests with area size greater than threshold
SELECT ForestID, ForestName, GeoLocation, AreaSize, OwnershipType, Status
FROM Forest
WHERE AreaSize > $1
ORDER BY AreaSize DESC;

-- Get forest details with active harvest schedules
SELECT f.ForestID, f.ForestName, f.GeoLocation, f.AreaSize,
       hs.ScheduleID, hs.StartDate, hs.EndDate, hs.Status
FROM Forest f
JOIN HarvestSchedule hs ON f.ForestID = hs.ForestID
WHERE hs.Status = $1
ORDER BY hs.StartDate;

-- Get forest harvest summary (total quantity harvested per forest)
SELECT f.ForestID, f.ForestName, 
       COUNT(hb.BatchID) AS TotalBatches,
       SUM(hb.Quantity) AS TotalQuantityHarvested,
       MIN(hb.HarvestDate) AS FirstHarvestDate,
       MAX(hb.HarvestDate) AS LastHarvestDate
FROM Forest f
LEFT JOIN HarvestBatch hb ON f.ForestID = hb.ForestID
GROUP BY f.ForestID, f.ForestName
ORDER BY TotalQuantityHarvested DESC;

-- Get forest capacity vs harvested analysis
SELECT f.ForestID, f.ForestName, f.AreaSize,
       COALESCE(SUM(hb.Quantity), 0) AS TotalHarvested,
       f.AreaSize - COALESCE(SUM(hb.Quantity), 0) AS RemainingCapacity
FROM Forest f
LEFT JOIN HarvestBatch hb ON f.ForestID = hb.ForestID
GROUP BY f.ForestID, f.ForestName, f.AreaSize
ORDER BY RemainingCapacity DESC;


-- ============================================
-- ADVANCED QUERIES: HARVESTING OPERATIONS
-- ============================================

-- Get harvest batches by date range
SELECT hb.BatchID, hb.ForestID, f.ForestName, 
       hb.SpeciesID, ts.SpeciesName, hb.Quantity,
       hb.HarvestDate, hb.QualityIndicator, hb.QRCode
FROM HarvestBatch hb
LEFT JOIN Forest f ON hb.ForestID = f.ForestID
LEFT JOIN TreeSpecies ts ON hb.SpeciesID = ts.SpeciesID
WHERE hb.HarvestDate BETWEEN $1 AND $2
ORDER BY hb.HarvestDate DESC;

-- Get harvest batches by quality indicator
SELECT hb.BatchID, hb.ForestID, f.ForestName, 
       hb.SpeciesID, ts.SpeciesName, hb.Quantity,
       hb.HarvestDate, hb.QualityIndicator, hb.QRCode
FROM HarvestBatch hb
LEFT JOIN Forest f ON hb.ForestID = f.ForestID
LEFT JOIN TreeSpecies ts ON hb.SpeciesID = ts.SpeciesID
WHERE hb.QualityIndicator = $1
ORDER BY hb.HarvestDate DESC;

-- Get harvest batch details by QR code (traceability)
SELECT hb.BatchID, hb.ForestID, f.ForestName, f.GeoLocation,
       hb.SpeciesID, ts.SpeciesName, ts.Grade, hb.Quantity,
       hb.HarvestDate, hb.QualityIndicator, hb.QRCode,
       hs.ScheduleID, hs.StartDate, hs.EndDate
FROM HarvestBatch hb
LEFT JOIN Forest f ON hb.ForestID = f.ForestID
LEFT JOIN TreeSpecies ts ON hb.SpeciesID = ts.SpeciesID
LEFT JOIN HarvestSchedule hs ON hb.ScheduleID = hs.ScheduleID
WHERE hb.QRCode = $1;

-- Get most harvested tree species
SELECT ts.SpeciesID, ts.SpeciesName, ts.Grade,
       COUNT(hb.BatchID) AS TotalBatches,
       SUM(hb.Quantity) AS TotalQuantity
FROM TreeSpecies ts
JOIN HarvestBatch hb ON ts.SpeciesID = hb.SpeciesID
GROUP BY ts.SpeciesID, ts.SpeciesName, ts.Grade
ORDER BY TotalQuantity DESC
LIMIT $1;

-- Get harvest schedule compliance (on-time vs delayed)
SELECT hs.ScheduleID, hs.ForestID, f.ForestName,
       hs.StartDate, hs.EndDate, hs.Status,
       COUNT(hb.BatchID) AS TotalBatches,
       SUM(hb.Quantity) AS TotalQuantity,
       CASE 
           WHEN hs.EndDate >= CURRENT_DATE THEN 'On Schedule'
           WHEN hs.EndDate < CURRENT_DATE AND hs.Status != 'completed' THEN 'Delayed'
           ELSE 'Completed'
       END AS ComplianceStatus
FROM HarvestSchedule hs
JOIN Forest f ON hs.ForestID = f.ForestID
LEFT JOIN HarvestBatch hb ON hs.ScheduleID = hb.ScheduleID
GROUP BY hs.ScheduleID, hs.ForestID, f.ForestName, hs.StartDate, hs.EndDate, hs.Status
ORDER BY hs.StartDate DESC;

-- Get harvest batches pending processing
SELECT hb.BatchID, hb.ForestID, f.ForestName, 
       hb.SpeciesID, ts.SpeciesName, hb.Quantity,
       hb.HarvestDate, hb.QualityIndicator
FROM HarvestBatch hb
LEFT JOIN Forest f ON hb.ForestID = f.ForestID
LEFT JOIN TreeSpecies ts ON hb.SpeciesID = ts.SpeciesID
WHERE NOT EXISTS (
    SELECT 1 FROM HarvestBatch_Processing hbp 
    WHERE hbp.BatchID = hb.BatchID
)
ORDER BY hb.HarvestDate;


-- ============================================
-- ADVANCED QUERIES: SUPPLIER MANAGEMENT
-- ============================================

-- Get suppliers with rating above threshold
SELECT s.SupplierID, s.CompanyName, s.ContactPerson, s.Email, s.Phone,
       s.ComplianceStatus, s.Raw, s.Semi_Processed,
       sp.Rating, sp.DeliveryTimeliness, sp.QualityScore, sp.ReviewDate
FROM Supplier s
LEFT JOIN SupplierPerformance sp ON s.SupplierID = sp.SupplierID
WHERE sp.Rating >= $1
ORDER BY sp.Rating DESC, s.CompanyName;

-- Get suppliers by compliance status
SELECT SupplierID, CompanyName, ContactPerson, Email, Phone,
       ComplianceStatus, Raw, Semi_Processed
FROM Supplier
WHERE ComplianceStatus = $1
ORDER BY CompanyName;

-- Get suppliers by type (raw or semi-processed)
SELECT SupplierID, CompanyName, ContactPerson, Email, Phone,
       ComplianceStatus, Raw, Semi_Processed
FROM Supplier
WHERE ($1 = 'raw' AND Raw = TRUE) OR ($1 = 'semi_processed' AND Semi_Processed = TRUE)
ORDER BY CompanyName;

-- Get supplier performance history
SELECT sp.PerformanceID, sp.SupplierID, s.CompanyName,
       sp.Rating, sp.DeliveryTimeliness, sp.QualityScore, sp.ReviewDate
FROM SupplierPerformance sp
JOIN Supplier s ON sp.SupplierID = s.SupplierID
WHERE sp.SupplierID = $1
ORDER BY sp.ReviewDate DESC;

-- Get supplier performance summary with average metrics
SELECT s.SupplierID, s.CompanyName, s.ComplianceStatus,
       COUNT(sp.PerformanceID) AS TotalReviews,
       AVG(sp.Rating) AS AvgRating,
       AVG(sp.DeliveryTimeliness) AS AvgDeliveryTimeliness,
       AVG(sp.QualityScore) AS AvgQualityScore,
       MAX(sp.ReviewDate) AS LastReviewDate
FROM Supplier s
LEFT JOIN SupplierPerformance sp ON s.SupplierID = sp.SupplierID
GROUP BY s.SupplierID, s.CompanyName, s.ComplianceStatus
ORDER BY AvgRating DESC;

-- Get active supplier contracts
SELECT sc.ContractID, sc.SupplierID, s.CompanyName,
       sc.StartDate, sc.EndDate, sc.ContractValue, sc.Status
FROM SupplierContract sc
JOIN Supplier s ON sc.SupplierID = s.SupplierID
WHERE sc.Status = 'active' AND sc.EndDate >= CURRENT_DATE
ORDER BY sc.EndDate;

-- Get expiring supplier contracts (within next N days)
SELECT sc.ContractID, sc.SupplierID, s.CompanyName, s.ContactPerson, s.Email,
       sc.StartDate, sc.EndDate, sc.ContractValue, sc.Status,
       sc.EndDate - CURRENT_DATE AS DaysUntilExpiry
FROM SupplierContract sc
JOIN Supplier s ON sc.SupplierID = s.SupplierID
WHERE sc.Status = 'active' 
  AND sc.EndDate BETWEEN CURRENT_DATE AND CURRENT_DATE + $1
ORDER BY sc.EndDate;

-- Get supplier purchase order history
SELECT s.SupplierID, s.CompanyName,
       COUNT(po.POID) AS TotalOrders,
       SUM(po.TotalAmount) AS TotalSpent,
       AVG(po.TotalAmount) AS AvgOrderValue,
       MIN(po.OrderDate) AS FirstOrderDate,
       MAX(po.OrderDate) AS LastOrderDate
FROM Supplier s
LEFT JOIN PurchaseOrder po ON s.SupplierID = po.SupplierID
GROUP BY s.SupplierID, s.CompanyName
ORDER BY TotalSpent DESC;


-- ============================================
-- ADVANCED QUERIES: PURCHASE ORDERS
-- ============================================

-- Get purchase orders by status
SELECT po.POID, po.EmployeeID, e.FullName AS EmployeeName,
       po.SupplierID, s.CompanyName AS SupplierName,
       po.OrderDate, po.ExpectedDeliveryDate, po.Status, po.TotalAmount
FROM PurchaseOrder po
LEFT JOIN Employee e ON po.EmployeeID = e.EmployeeID
LEFT JOIN Supplier s ON po.SupplierID = s.SupplierID
WHERE po.Status = $1
ORDER BY po.OrderDate DESC;

-- Get purchase orders by date range
SELECT po.POID, po.EmployeeID, e.FullName AS EmployeeName,
       po.SupplierID, s.CompanyName AS SupplierName,
       po.OrderDate, po.ExpectedDeliveryDate, po.Status, po.TotalAmount
FROM PurchaseOrder po
LEFT JOIN Employee e ON po.EmployeeID = e.EmployeeID
LEFT JOIN Supplier s ON po.SupplierID = s.SupplierID
WHERE po.OrderDate BETWEEN $1 AND $2
ORDER BY po.OrderDate DESC;

-- Get purchase order details with items
SELECT po.POID, po.OrderDate, po.ExpectedDeliveryDate, po.Status,
       s.CompanyName AS SupplierName, e.FullName AS EmployeeName,
       poi.POItemID, pt.Name AS ProductName, poi.Quantity, 
       poi.UnitPrice, poi.Subtotal
FROM PurchaseOrder po
LEFT JOIN Supplier s ON po.SupplierID = s.SupplierID
LEFT JOIN Employee e ON po.EmployeeID = e.EmployeeID
LEFT JOIN PurchaseOrderItem poi ON po.POID = poi.POID
LEFT JOIN ProductType pt ON poi.ProductTypeID = pt.ProductTypeID
WHERE po.POID = $1
ORDER BY poi.POItemID;

-- Get overdue purchase orders
SELECT po.POID, po.EmployeeID, e.FullName AS EmployeeName,
       po.SupplierID, s.CompanyName AS SupplierName,
       po.OrderDate, po.ExpectedDeliveryDate, po.Status, po.TotalAmount,
       CURRENT_DATE - po.ExpectedDeliveryDate AS DaysOverdue
FROM PurchaseOrder po
LEFT JOIN Employee e ON po.EmployeeID = e.EmployeeID
LEFT JOIN Supplier s ON po.SupplierID = s.SupplierID
WHERE po.ExpectedDeliveryDate < CURRENT_DATE 
  AND po.Status NOT IN ('delivered', 'completed', 'cancelled')
ORDER BY DaysOverdue DESC;

-- Get purchase order cost breakdown by supplier
SELECT s.SupplierID, s.CompanyName,
       COUNT(po.POID) AS TotalOrders,
       SUM(po.TotalAmount) AS TotalAmount,
       AVG(po.TotalAmount) AS AvgOrderAmount,
       MIN(po.OrderDate) AS FirstOrder,
       MAX(po.OrderDate) AS LastOrder
FROM Supplier s
JOIN PurchaseOrder po ON s.SupplierID = po.SupplierID
WHERE po.OrderDate BETWEEN $1 AND $2
GROUP BY s.SupplierID, s.CompanyName
ORDER BY TotalAmount DESC;

-- Get purchase order items by product type
SELECT pt.ProductTypeID, pt.Name AS ProductName, pt.Grade,
       COUNT(poi.POItemID) AS TotalOrderItems,
       SUM(poi.Quantity) AS TotalQuantityOrdered,
       SUM(poi.Subtotal) AS TotalCost,
       AVG(poi.UnitPrice) AS AvgUnitPrice
FROM ProductType pt
JOIN PurchaseOrderItem poi ON pt.ProductTypeID = poi.ProductTypeID
JOIN PurchaseOrder po ON poi.POID = po.POID
WHERE po.OrderDate BETWEEN $1 AND $2
GROUP BY pt.ProductTypeID, pt.Name, pt.Grade
ORDER BY TotalCost DESC;
