-- ============================================
-- ADVANCED QUERIES: WASTE TRACKING
-- ============================================

-- Get waste records by type
SELECT wr.WasteID, wr.WasteType, wr.Volume, wr.DisposalMethod, wr.Recycled,
       po.ProcessingID, po.StartDate, po.EndDate,
       pt.Name AS ProductName
FROM WasteRecord wr
JOIN ProcessingOrder po ON wr.ProcessingID = po.ProcessingID
LEFT JOIN ProductType pt ON po.ProductTypeID = pt.ProductTypeID
WHERE wr.WasteType = $1
ORDER BY wr.WasteID DESC;

-- Get waste summary by disposal method
SELECT wr.DisposalMethod,
       COUNT(wr.WasteID) AS TotalRecords,
       SUM(wr.Volume) AS TotalVolume,
       SUM(CASE WHEN wr.Recycled = TRUE THEN wr.Volume ELSE 0 END) AS RecycledVolume,
       SUM(CASE WHEN wr.Recycled = FALSE THEN wr.Volume ELSE 0 END) AS NonRecycledVolume
FROM WasteRecord wr
GROUP BY wr.DisposalMethod
ORDER BY TotalVolume DESC;

-- Get recycling rate by processing order
SELECT po.ProcessingID, po.StartDate, po.EndDate, po.OutputQuantity,
       pt.Name AS ProductName,
       COUNT(wr.WasteID) AS TotalWasteRecords,
       SUM(wr.Volume) AS TotalWasteVolume,
       SUM(CASE WHEN wr.Recycled = TRUE THEN wr.Volume ELSE 0 END) AS RecycledVolume,
       CASE 
           WHEN SUM(wr.Volume) > 0 THEN
               (SUM(CASE WHEN wr.Recycled = TRUE THEN wr.Volume ELSE 0 END) / SUM(wr.Volume) * 100)
           ELSE 0
       END AS RecyclingRate
FROM ProcessingOrder po
LEFT JOIN ProductType pt ON po.ProductTypeID = pt.ProductTypeID
LEFT JOIN WasteRecord wr ON po.ProcessingID = wr.ProcessingID
GROUP BY po.ProcessingID, po.StartDate, po.EndDate, po.OutputQuantity, pt.Name
ORDER BY RecyclingRate DESC;

-- Get waste trends over time
SELECT 
    DATE_TRUNC('month', po.StartDate) AS Month,
    COUNT(wr.WasteID) AS TotalWasteRecords,
    SUM(wr.Volume) AS TotalWasteVolume,
    SUM(CASE WHEN wr.Recycled = TRUE THEN wr.Volume ELSE 0 END) AS RecycledVolume,
    AVG(wr.Volume) AS AvgWastePerRecord
FROM WasteRecord wr
JOIN ProcessingOrder po ON wr.ProcessingID = po.ProcessingID
WHERE po.StartDate BETWEEN $1 AND $2
GROUP BY DATE_TRUNC('month', po.StartDate)
ORDER BY Month DESC;

-- Get waste by sawmill
SELECT s.SawmillID, s.Name AS SawmillName, s.Location,
       COUNT(wr.WasteID) AS TotalWasteRecords,
       SUM(wr.Volume) AS TotalWasteVolume,
       SUM(CASE WHEN wr.Recycled = TRUE THEN wr.Volume ELSE 0 END) AS RecycledVolume,
       AVG(wr.Volume) AS AvgWastePerRecord
FROM Sawmill s
JOIN ProcessingUnit pu ON s.SawmillID = pu.SawmillID
JOIN ProcessingOrder po ON pu.UnitID = po.UnitID
JOIN WasteRecord wr ON po.ProcessingID = wr.ProcessingID
GROUP BY s.SawmillID, s.Name, s.Location
ORDER BY TotalWasteVolume DESC;


-- ============================================
-- ADVANCED QUERIES: MAINTENANCE
-- ============================================

-- Get maintenance records by date range
SELECT mr.MaintenanceID, mr.MaintenanceDate, mr.Description, mr.Cost, 
       mr.PartsUsed, mr.DowntimeHours,
       pu.UnitID, pu.Cutting, pu.Drying, pu.Finishing,
       s.Name AS SawmillName
FROM MaintenanceRecord mr
JOIN ProcessingUnit pu ON mr.UnitID = pu.UnitID
JOIN Sawmill s ON pu.SawmillID = s.SawmillID
WHERE mr.MaintenanceDate BETWEEN $1 AND $2
ORDER BY mr.MaintenanceDate DESC;

-- Get maintenance cost summary by processing unit
SELECT pu.UnitID, pu.Cutting, pu.Drying, pu.Finishing,
       s.Name AS SawmillName,
       COUNT(mr.MaintenanceID) AS TotalMaintenanceRecords,
       SUM(mr.Cost) AS TotalMaintenanceCost,
       AVG(mr.Cost) AS AvgMaintenanceCost,
       SUM(mr.DowntimeHours) AS TotalDowntimeHours
FROM ProcessingUnit pu
JOIN Sawmill s ON pu.SawmillID = s.SawmillID
LEFT JOIN MaintenanceRecord mr ON pu.UnitID = mr.UnitID
GROUP BY pu.UnitID, pu.Cutting, pu.Drying, pu.Finishing, s.Name
ORDER BY TotalMaintenanceCost DESC;

-- Get maintenance cost summary by sawmill
SELECT s.SawmillID, s.Name AS SawmillName, s.Location,
       COUNT(mr.MaintenanceID) AS TotalMaintenanceRecords,
       SUM(mr.Cost) AS TotalMaintenanceCost,
       AVG(mr.Cost) AS AvgMaintenanceCost,
       SUM(mr.DowntimeHours) AS TotalDowntimeHours
FROM Sawmill s
LEFT JOIN ProcessingUnit pu ON s.SawmillID = pu.SawmillID
LEFT JOIN MaintenanceRecord mr ON pu.UnitID = mr.UnitID
WHERE mr.MaintenanceDate BETWEEN $1 AND $2
GROUP BY s.SawmillID, s.Name, s.Location
ORDER BY TotalMaintenanceCost DESC;

-- Get upcoming maintenance alerts (units with high downtime)
SELECT pu.UnitID, pu.Cutting, pu.Drying, pu.Finishing, pu.Status,
       s.Name AS SawmillName,
       COUNT(mr.MaintenanceID) AS MaintenanceCount,
       SUM(mr.DowntimeHours) AS TotalDowntimeHours,
       MAX(mr.MaintenanceDate) AS LastMaintenanceDate,
       CURRENT_DATE - MAX(mr.MaintenanceDate) AS DaysSinceLastMaintenance
FROM ProcessingUnit pu
JOIN Sawmill s ON pu.SawmillID = s.SawmillID
LEFT JOIN MaintenanceRecord mr ON pu.UnitID = mr.UnitID
GROUP BY pu.UnitID, pu.Cutting, pu.Drying, pu.Finishing, pu.Status, s.Name
HAVING SUM(mr.DowntimeHours) > $1 OR CURRENT_DATE - MAX(mr.MaintenanceDate) > $2
ORDER BY TotalDowntimeHours DESC;

-- Get maintenance trends over time
SELECT 
    DATE_TRUNC('month', mr.MaintenanceDate) AS Month,
    COUNT(mr.MaintenanceID) AS TotalMaintenanceRecords,
    SUM(mr.Cost) AS TotalCost,
    AVG(mr.Cost) AS AvgCost,
    SUM(mr.DowntimeHours) AS TotalDowntime
FROM MaintenanceRecord mr
WHERE mr.MaintenanceDate BETWEEN $1 AND $2
GROUP BY DATE_TRUNC('month', mr.MaintenanceDate)
ORDER BY Month DESC;


-- ============================================
-- ADVANCED QUERIES: INVENTORY & WAREHOUSE
-- ============================================

-- Get stock by warehouse
SELECT w.WarehouseID, w.Name AS WarehouseName, w.Location, w.Capacity,
       COUNT(si.StockID) AS TotalStockItems,
       SUM(si.Quantity) AS TotalQuantity
FROM Warehouse w
LEFT JOIN StockItem si ON w.WarehouseID = si.WarehouseID
GROUP BY w.WarehouseID, w.Name, w.Location, w.Capacity
ORDER BY TotalQuantity DESC;

-- Get stock by product type
SELECT pt.ProductTypeID, pt.Name AS ProductName, pt.Grade, pt.UnitOfMeasure,
       COUNT(si.StockID) AS TotalStockItems,
       SUM(si.Quantity) AS TotalQuantity,
       COUNT(DISTINCT si.WarehouseID) AS WarehouseCount
FROM ProductType pt
LEFT JOIN StockItem si ON pt.ProductTypeID = si.ProductTypeID
GROUP BY pt.ProductTypeID, pt.Name, pt.Grade, pt.UnitOfMeasure
ORDER BY TotalQuantity DESC;

-- Get low stock items (below threshold)
SELECT si.StockID, si.Quantity, si.ShelfLocation,
       pt.Name AS ProductName, pt.Grade,
       w.Name AS WarehouseName, w.Location
FROM StockItem si
JOIN ProductType pt ON si.ProductTypeID = pt.ProductTypeID
JOIN Warehouse w ON si.WarehouseID = w.WarehouseID
WHERE si.Quantity < $1
ORDER BY si.Quantity ASC;

-- Get stock alerts by status
SELECT sa.AlertID, sa.AlertType, sa.CreatedAt, sa.Status,
       w.Name AS WarehouseName,
       si.StockID, si.Quantity, si.ShelfLocation,
       pt.Name AS ProductName
FROM StockAlert sa
JOIN Warehouse w ON sa.WarehouseID = w.WarehouseID
LEFT JOIN StockItem si ON sa.StockID = si.StockID
LEFT JOIN ProductType pt ON si.ProductTypeID = pt.ProductTypeID
WHERE sa.Status = $1
ORDER BY sa.CreatedAt DESC;

-- Get inventory transactions by type
SELECT it.TransactionID, it.TransactionType, it.Quantity, it.TransactionDate, it.Remarks,
       e.FullName AS EmployeeName,
       w.Name AS WarehouseName,
       si.StockID, pt.Name AS ProductName
FROM InventoryTransaction it
LEFT JOIN Employee e ON it.EmployeeID = e.EmployeeID
LEFT JOIN Warehouse w ON it.WarehouseID = w.WarehouseID
LEFT JOIN StockItem si ON it.StockID = si.StockID
LEFT JOIN ProductType pt ON si.ProductTypeID = pt.ProductTypeID
WHERE it.TransactionType = $1
ORDER BY it.TransactionDate DESC;

-- Get inventory transaction summary by warehouse
SELECT w.WarehouseID, w.Name AS WarehouseName,
       COUNT(it.TransactionID) AS TotalTransactions,
       SUM(CASE WHEN it.TransactionType = 'incoming' THEN it.Quantity ELSE 0 END) AS TotalIncoming,
       SUM(CASE WHEN it.TransactionType = 'outgoing' THEN it.Quantity ELSE 0 END) AS TotalOutgoing,
       SUM(CASE WHEN it.TransactionType = 'damaged' THEN it.Quantity ELSE 0 END) AS TotalDamaged
FROM Warehouse w
LEFT JOIN InventoryTransaction it ON w.WarehouseID = it.WarehouseID
WHERE it.TransactionDate BETWEEN $1 AND $2
GROUP BY w.WarehouseID, w.Name
ORDER BY TotalTransactions DESC;

-- Get inventory turnover by product
SELECT pt.ProductTypeID, pt.Name AS ProductName, pt.Grade,
       SUM(CASE WHEN it.TransactionType = 'incoming' THEN it.Quantity ELSE 0 END) AS TotalIncoming,
       SUM(CASE WHEN it.TransactionType = 'outgoing' THEN it.Quantity ELSE 0 END) AS TotalOutgoing,
       SUM(si.Quantity) AS CurrentStock,
       CASE 
           WHEN SUM(si.Quantity) > 0 THEN
               (SUM(CASE WHEN it.TransactionType = 'outgoing' THEN it.Quantity ELSE 0 END) / SUM(si.Quantity))
           ELSE 0
       END AS TurnoverRatio
FROM ProductType pt
LEFT JOIN StockItem si ON pt.ProductTypeID = si.ProductTypeID
LEFT JOIN InventoryTransaction it ON si.StockID = it.StockID
WHERE it.TransactionDate BETWEEN $1 AND $2
GROUP BY pt.ProductTypeID, pt.Name, pt.Grade
ORDER BY TurnoverRatio DESC;

-- Get warehouse capacity utilization
SELECT w.WarehouseID, w.Name AS WarehouseName, w.Location, w.Capacity,
       SUM(si.Quantity) AS CurrentStock,
       w.Capacity - SUM(si.Quantity) AS AvailableCapacity,
       CASE 
           WHEN w.Capacity > 0 THEN
               (SUM(si.Quantity) / w.Capacity * 100)
           ELSE 0
       END AS UtilizationPercentage
FROM Warehouse w
LEFT JOIN StockItem si ON w.WarehouseID = si.WarehouseID
GROUP BY w.WarehouseID, w.Name, w.Location, w.Capacity
ORDER BY UtilizationPercentage DESC;

-- Get stock valuation report (requires unit price from recent transactions)
SELECT pt.ProductTypeID, pt.Name AS ProductName, pt.Grade,
       SUM(si.Quantity) AS TotalQuantity,
       AVG(poi.UnitPrice) AS AvgPurchasePrice,
       SUM(si.Quantity) * AVG(poi.UnitPrice) AS EstimatedValue
FROM ProductType pt
LEFT JOIN StockItem si ON pt.ProductTypeID = si.ProductTypeID
LEFT JOIN PurchaseOrderItem poi ON pt.ProductTypeID = poi.ProductTypeID
GROUP BY pt.ProductTypeID, pt.Name, pt.Grade
HAVING SUM(si.Quantity) > 0
ORDER BY EstimatedValue DESC;
