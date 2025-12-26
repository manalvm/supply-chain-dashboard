-- ============================================
-- ADVANCED QUERIES: AUDIT LOGS
-- ============================================

-- Get audit logs by user
SELECT al.LogID, al.ActionType, al.EntityAffected, al.Timestamp, al.Description, al.IPAddress,
       u.Email, u.First_Name, u.Last_Name
FROM AuditLog al
LEFT JOIN "User" u ON al.User_ID = u.User_ID
WHERE al.User_ID = $1
ORDER BY al.Timestamp DESC;

-- Get audit logs by action type
SELECT al.LogID, al.ActionType, al.EntityAffected, al.Timestamp, al.Description, al.IPAddress,
       u.Email, u.First_Name, u.Last_Name
FROM AuditLog al
LEFT JOIN "User" u ON al.User_ID = u.User_ID
WHERE al.ActionType = $1
ORDER BY al.Timestamp DESC;

-- Get audit logs by date range
SELECT al.LogID, al.ActionType, al.EntityAffected, al.Timestamp, al.Description, al.IPAddress,
       u.Email, u.First_Name, u.Last_Name
FROM AuditLog al
LEFT JOIN "User" u ON al.User_ID = u.User_ID
WHERE al.Timestamp BETWEEN $1 AND $2
ORDER BY al.Timestamp DESC;

-- Get audit logs by entity
SELECT al.LogID, al.ActionType, al.EntityAffected, al.Timestamp, al.Description, al.IPAddress,
       u.Email, u.First_Name, u.Last_Name
FROM AuditLog al
LEFT JOIN "User" u ON al.User_ID = u.User_ID
WHERE al.EntityAffected = $1
ORDER BY al.Timestamp DESC;

-- Get audit log summary by user
SELECT u.User_ID, u.Email, u.First_Name, u.Last_Name,
       COUNT(al.LogID) AS TotalActions,
       COUNT(CASE WHEN al.ActionType = 'CREATE' THEN 1 END) AS CreateActions,
       COUNT(CASE WHEN al.ActionType = 'UPDATE' THEN 1 END) AS UpdateActions,
       COUNT(CASE WHEN al.ActionType = 'DELETE' THEN 1 END) AS DeleteActions,
       COUNT(CASE WHEN al.ActionType = 'LOGIN' THEN 1 END) AS LoginActions,
       MAX(al.Timestamp) AS LastActivity
FROM "User" u
LEFT JOIN AuditLog al ON u.User_ID = al.User_ID
WHERE al.Timestamp BETWEEN $1 AND $2
GROUP BY u.User_ID, u.Email, u.First_Name, u.Last_Name
ORDER BY TotalActions DESC;

-- Get audit log summary by action type
SELECT al.ActionType,
       COUNT(al.LogID) AS TotalActions,
       COUNT(DISTINCT al.User_ID) AS UniqueUsers,
       COUNT(DISTINCT al.EntityAffected) AS UniqueEntities,
       MIN(al.Timestamp) AS FirstOccurrence,
       MAX(al.Timestamp) AS LastOccurrence
FROM AuditLog al
WHERE al.Timestamp BETWEEN $1 AND $2
GROUP BY al.ActionType
ORDER BY TotalActions DESC;

-- Get recent failed login attempts
SELECT al.LogID, al.Timestamp, al.Description, al.IPAddress,
       u.Email, u.First_Name, u.Last_Name, u.Status
FROM AuditLog al
LEFT JOIN "User" u ON al.User_ID = u.User_ID
WHERE al.ActionType = 'LOGIN_FAILED'
ORDER BY al.Timestamp DESC
LIMIT $1;

-- Get suspicious activity (multiple IPs for same user)
SELECT u.User_ID, u.Email, u.First_Name, u.Last_Name,
       COUNT(DISTINCT al.IPAddress) AS UniqueIPs,
       STRING_AGG(DISTINCT al.IPAddress, ', ') AS IPAddresses,
       COUNT(al.LogID) AS TotalActions,
       MAX(al.Timestamp) AS LastActivity
FROM "User" u
JOIN AuditLog al ON u.User_ID = al.User_ID
WHERE al.Timestamp BETWEEN $1 AND $2
GROUP BY u.User_ID, u.Email, u.First_Name, u.Last_Name
HAVING COUNT(DISTINCT al.IPAddress) > $3
ORDER BY UniqueIPs DESC;

-- Get audit trail for specific entity
SELECT al.LogID, al.ActionType, al.Timestamp, al.Description, al.IPAddress,
       u.Email AS PerformedBy, u.First_Name, u.Last_Name
FROM AuditLog al
LEFT JOIN "User" u ON al.User_ID = u.User_ID
WHERE al.EntityAffected = $1
ORDER BY al.Timestamp DESC;


-- ============================================
-- ADVANCED QUERIES: REPORTING & KPIs
-- ============================================

-- Executive Dashboard - Overall KPIs
SELECT 
    -- Forest & Harvesting
    (SELECT COUNT(*) FROM Forest WHERE Status = 'active') AS ActiveForests,
    (SELECT SUM(Quantity) FROM HarvestBatch WHERE HarvestDate >= CURRENT_DATE - INTERVAL '30 days') AS RecentHarvestVolume,
    
    -- Inventory
    (SELECT COUNT(*) FROM StockItem WHERE Quantity > 0) AS ActiveStockItems,
    (SELECT SUM(Quantity) FROM StockItem) AS TotalInventoryQuantity,
    (SELECT COUNT(*) FROM StockAlert WHERE Status = 'active') AS ActiveStockAlerts,
    
    -- Sales & Revenue
    (SELECT COUNT(*) FROM SalesOrder WHERE OrderDate >= CURRENT_DATE - INTERVAL '30 days') AS RecentSalesOrders,
    (SELECT SUM(TotalAmount) FROM SalesOrder WHERE OrderDate >= CURRENT_DATE - INTERVAL '30 days') AS RecentRevenue,
    (SELECT COUNT(*) FROM Customer WHERE Retailer = TRUE OR EndUser = TRUE) AS TotalCustomers,
    
    -- Operations
    (SELECT COUNT(*) FROM ProcessingOrder WHERE StartDate >= CURRENT_DATE - INTERVAL '30 days') AS RecentProcessingOrders,
    (SELECT AVG(EfficiencyRate) FROM ProcessingOrder WHERE StartDate >= CURRENT_DATE - INTERVAL '30 days') AS AvgProcessingEfficiency,
    
    -- Shipments
    (SELECT COUNT(*) FROM Shipment WHERE Status = 'in_transit') AS ShipmentsInTransit,
    (SELECT COUNT(*) FROM Shipment WHERE Status = 'delivered' AND ShipmentDate >= CURRENT_DATE - INTERVAL '30 days') AS RecentDeliveries,
    
    -- Financial
    (SELECT COUNT(*) FROM Invoice WHERE Status = 'unpaid') AS UnpaidInvoices,
    (SELECT SUM(TotalAmount) FROM Invoice WHERE Status = 'unpaid') AS OutstandingInvoiceAmount,
    
    -- Employees
    (SELECT COUNT(*) FROM Employee) AS TotalEmployees,
    (SELECT COUNT(*) FROM "User" WHERE Status = 'active') AS ActiveUsers;

-- Sales revenue trends (monthly)
SELECT 
    DATE_TRUNC('month', so.OrderDate) AS Month,
    COUNT(so.SOID) AS TotalOrders,
    SUM(so.TotalAmount) AS TotalRevenue,
    AVG(so.TotalAmount) AS AvgOrderValue,
    COUNT(DISTINCT so.CustomerID) AS UniqueCustomers,
    SUM(soi.Quantity) AS TotalQuantitySold
FROM SalesOrder so
LEFT JOIN SalesOrderItem soi ON so.SOID = soi.SOID
WHERE so.OrderDate BETWEEN $1 AND $2
GROUP BY DATE_TRUNC('month', so.OrderDate)
ORDER BY Month DESC;

-- Inventory turnover ratio
SELECT 
    pt.ProductTypeID,
    pt.Name AS ProductName,
    pt.Grade,
    SUM(si.Quantity) AS CurrentStock,
    COALESCE(SUM(CASE WHEN it.TransactionType = 'outgoing' THEN it.Quantity ELSE 0 END), 0) AS TotalSold,
    CASE 
        WHEN SUM(si.Quantity) > 0 THEN
            COALESCE(SUM(CASE WHEN it.TransactionType = 'outgoing' THEN it.Quantity ELSE 0 END), 0) / SUM(si.Quantity)
        ELSE 0
    END AS TurnoverRatio,
    CASE 
        WHEN COALESCE(SUM(CASE WHEN it.TransactionType = 'outgoing' THEN it.Quantity ELSE 0 END), 0) > 0 THEN
            (SUM(si.Quantity) / COALESCE(SUM(CASE WHEN it.TransactionType = 'outgoing' THEN it.Quantity ELSE 0 END), 0)) * 30
        ELSE NULL
    END AS DaysOfInventory
FROM ProductType pt
LEFT JOIN StockItem si ON pt.ProductTypeID = si.ProductTypeID
LEFT JOIN InventoryTransaction it ON si.StockID = it.StockID AND it.TransactionDate BETWEEN $1 AND $2
GROUP BY pt.ProductTypeID, pt.Name, pt.Grade
ORDER BY TurnoverRatio DESC;

-- Supplier performance scorecard
SELECT 
    s.SupplierID,
    s.CompanyName,
    s.ComplianceStatus,
    COUNT(po.POID) AS TotalOrders,
    SUM(po.TotalAmount) AS TotalSpent,
    AVG(sp.Rating) AS AvgRating,
    AVG(sp.DeliveryTimeliness) AS AvgDeliveryTimeliness,
    AVG(sp.QualityScore) AS AvgQualityScore,
    COUNT(CASE WHEN po.Status = 'delivered' THEN 1 END) AS DeliveredOrders,
    COUNT(CASE WHEN po.ExpectedDeliveryDate < CURRENT_DATE AND po.Status NOT IN ('delivered', 'completed') THEN 1 END) AS OverdueOrders
FROM Supplier s
LEFT JOIN PurchaseOrder po ON s.SupplierID = po.SupplierID
LEFT JOIN SupplierPerformance sp ON s.SupplierID = sp.SupplierID
WHERE po.OrderDate BETWEEN $1 AND $2
GROUP BY s.SupplierID, s.CompanyName, s.ComplianceStatus
ORDER BY AvgRating DESC, TotalSpent DESC;

-- Production efficiency report
SELECT 
    s.SawmillID,
    s.Name AS SawmillName,
    s.Location,
    COUNT(po.ProcessingID) AS TotalProcessingOrders,
    SUM(po.OutputQuantity) AS TotalOutput,
    AVG(po.EfficiencyRate) AS AvgEfficiencyRate,
    SUM(wr.Volume) AS TotalWaste,
    CASE 
        WHEN SUM(po.OutputQuantity) > 0 THEN
            (SUM(wr.Volume) / SUM(po.OutputQuantity) * 100)
        ELSE 0
    END AS WastePercentage,
    SUM(mr.Cost) AS MaintenanceCost,
    SUM(mr.DowntimeHours) AS TotalDowntime
FROM Sawmill s
LEFT JOIN ProcessingUnit pu ON s.SawmillID = pu.SawmillID
LEFT JOIN ProcessingOrder po ON pu.UnitID = po.UnitID
LEFT JOIN WasteRecord wr ON po.ProcessingID = wr.ProcessingID
LEFT JOIN MaintenanceRecord mr ON pu.UnitID = mr.UnitID
WHERE po.StartDate BETWEEN $1 AND $2
GROUP BY s.SawmillID, s.Name, s.Location
ORDER BY AvgEfficiencyRate DESC;

-- Customer lifetime value
SELECT 
    c.CustomerID,
    c.Name AS CustomerName,
    c.Retailer,
    c.EndUser,
    COUNT(so.SOID) AS TotalOrders,
    SUM(so.TotalAmount) AS TotalRevenue,
    AVG(so.TotalAmount) AS AvgOrderValue,
    MIN(so.OrderDate) AS FirstOrderDate,
    MAX(so.OrderDate) AS LastOrderDate,
    EXTRACT(DAY FROM (MAX(so.OrderDate) - MIN(so.OrderDate))) AS CustomerLifespanDays,
    CASE 
        WHEN COUNT(so.SOID) > 1 THEN
            EXTRACT(DAY FROM (MAX(so.OrderDate) - MIN(so.OrderDate))) / (COUNT(so.SOID) - 1)
        ELSE NULL
    END AS AvgDaysBetweenOrders
FROM Customer c
LEFT JOIN SalesOrder so ON c.CustomerID = so.CustomerID
GROUP BY c.CustomerID, c.Name, c.Retailer, c.EndUser
HAVING COUNT(so.SOID) > 0
ORDER BY TotalRevenue DESC;

-- Most delivered wood species
SELECT 
    ts.SpeciesID,
    ts.SpeciesName,
    ts.Grade,
    COUNT(DISTINCT hb.BatchID) AS TotalBatches,
    SUM(hb.Quantity) AS TotalHarvested,
    COUNT(DISTINCT s.ShipmentID) AS TotalShipments,
    SUM(soi.Quantity) AS TotalSold,
    AVG(soi.UnitPrice) AS AvgSellingPrice
FROM TreeSpecies ts
LEFT JOIN HarvestBatch hb ON ts.SpeciesID = hb.SpeciesID
LEFT JOIN HarvestBatch_Processing hbp ON hb.BatchID = hbp.BatchID
LEFT JOIN ProcessingOrder po ON hbp.ProcessingID = po.ProcessingID
LEFT JOIN SalesOrderItem soi ON po.ProductTypeID = soi.ProductTypeID
LEFT JOIN SalesOrder so ON soi.SOID = so.SOID
LEFT JOIN Shipment s ON so.SOID = s.SOID
WHERE hb.HarvestDate BETWEEN $1 AND $2
GROUP BY ts.SpeciesID, ts.SpeciesName, ts.Grade
ORDER BY TotalSold DESC;

-- Driver performance metrics
SELECT 
    d.DriverID,
    e.FullName AS DriverName,
    d.LicenseNumber,
    d.ExperienceYears,
    COUNT(s.ShipmentID) AS TotalShipments,
    COUNT(CASE WHEN s.Status = 'delivered' THEN 1 END) AS CompletedShipments,
    COUNT(CASE WHEN s.Status = 'delivered' AND s.ProofOfDelivery IS NOT NULL THEN 1 END) AS ShipmentsWithProof,
    SUM(fl.DistanceTraveled) AS TotalDistance,
    AVG(fl.DistanceTraveled) AS AvgDistancePerTrip,
    CASE 
        WHEN COUNT(s.ShipmentID) > 0 THEN
            (COUNT(CASE WHEN s.Status = 'delivered' THEN 1 END)::DECIMAL / COUNT(s.ShipmentID) * 100)
        ELSE 0
    END AS CompletionRate
FROM Driver d
JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN Shipment s ON d.DriverID = s.DriverID
LEFT JOIN FuelLog fl ON d.DriverID = fl.DriverID
WHERE s.ShipmentDate BETWEEN $1 AND $2
GROUP BY d.DriverID, e.FullName, d.LicenseNumber, d.ExperienceYears
ORDER BY CompletionRate DESC, TotalShipments DESC;

-- Forest harvest planning summary
SELECT 
    f.ForestID,
    f.ForestName,
    f.GeoLocation,
    f.AreaSize,
    f.Status,
    COUNT(DISTINCT hs.ScheduleID) AS TotalSchedules,
    COUNT(DISTINCT hb.BatchID) AS TotalBatches,
    SUM(hb.Quantity) AS TotalHarvested,
    CASE 
        WHEN f.AreaSize > 0 THEN
            (SUM(hb.Quantity) / f.AreaSize * 100)
        ELSE 0
    END AS HarvestPercentage,
    MAX(hb.HarvestDate) AS LastHarvestDate
FROM Forest f
LEFT JOIN HarvestSchedule hs ON f.ForestID = hs.ForestID
LEFT JOIN HarvestBatch hb ON f.ForestID = hb.ForestID
GROUP BY f.ForestID, f.ForestName, f.GeoLocation, f.AreaSize, f.Status
ORDER BY TotalHarvested DESC;

-- Compliance and certification checks
SELECT 
    COUNT(DISTINCT qi.InspectionID) AS TotalInspections,
    COUNT(DISTINCT CASE WHEN qi.CertificationID IS NOT NULL THEN qi.InspectionID END) AS CertifiedInspections,
    COUNT(DISTINCT CASE WHEN qi.Result = 'passed' THEN qi.InspectionID END) AS PassedInspections,
    COUNT(DISTINCT CASE WHEN qi.Result = 'failed' THEN qi.InspectionID END) AS FailedInspections,
    COUNT(DISTINCT s.SupplierID) AS TotalSuppliers,
    COUNT(DISTINCT CASE WHEN s.ComplianceStatus = 'compliant' THEN s.SupplierID END) AS CompliantSuppliers,
    COUNT(DISTINCT CASE WHEN s.ComplianceStatus = 'non-compliant' THEN s.SupplierID END) AS NonCompliantSuppliers,
    CASE 
        WHEN COUNT(qi.InspectionID) > 0 THEN
            (COUNT(CASE WHEN qi.Result = 'passed' THEN 1 END)::DECIMAL / COUNT(qi.InspectionID) * 100)
        ELSE 0
    END AS InspectionPassRate,
    CASE 
        WHEN COUNT(s.SupplierID) > 0 THEN
            (COUNT(CASE WHEN s.ComplianceStatus = 'compliant' THEN 1 END)::DECIMAL / COUNT(s.SupplierID) * 100)
        ELSE 0
    END AS SupplierComplianceRate
FROM QualityInspection qi
CROSS JOIN Supplier s
WHERE qi.Date BETWEEN $1 AND $2;
