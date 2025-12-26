-- ============================================
-- ADVANCED QUERIES: TRANSPORTATION
-- ============================================

-- Get shipments by status
SELECT s.ShipmentID, s.SOID, s.ShipmentDate, s.Status,
       t.PlateNumber AS TruckPlate, e.FullName AS DriverName,
       tc.CompanyName AS TransportCompany,
       r.StartLocation, r.EndLocation, r.DistanceKM
FROM Shipment s
LEFT JOIN Truck t ON s.TruckID = t.TruckID
LEFT JOIN Driver d ON s.DriverID = d.DriverID
LEFT JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN TransportCompany tc ON s.CompanyID = tc.CompanyID
LEFT JOIN Route r ON s.RouteID = r.RouteID
WHERE s.Status = $1
ORDER BY s.ShipmentDate DESC;

-- Get shipments by date range
SELECT s.ShipmentID, s.SOID, s.ShipmentDate, s.Status,
       t.PlateNumber AS TruckPlate, e.FullName AS DriverName,
       tc.CompanyName AS TransportCompany,
       r.StartLocation, r.EndLocation
FROM Shipment s
LEFT JOIN Truck t ON s.TruckID = t.TruckID
LEFT JOIN Driver d ON s.DriverID = d.DriverID
LEFT JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN TransportCompany tc ON s.CompanyID = tc.CompanyID
LEFT JOIN Route r ON s.RouteID = r.RouteID
WHERE s.ShipmentDate BETWEEN $1 AND $2
ORDER BY s.ShipmentDate DESC;

-- Get shipment details with sales order info
SELECT s.ShipmentID, s.ShipmentDate, s.Status, s.ProofOfDelivery,
       so.SOID, so.OrderDate, c.Name AS CustomerName, c.Address,
       t.PlateNumber, e.FullName AS DriverName, tc.CompanyName,
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

-- Get driver performance metrics
SELECT d.DriverID, e.FullName AS DriverName, d.LicenseNumber, d.ExperienceYears,
       COUNT(s.ShipmentID) AS TotalShipments,
       COUNT(CASE WHEN s.Status = 'delivered' THEN 1 END) AS CompletedShipments,
       COUNT(CASE WHEN s.Status = 'in_transit' THEN 1 END) AS InTransitShipments,
       SUM(fl.DistanceTraveled) AS TotalDistanceTraveled,
       AVG(fl.DistanceTraveled) AS AvgDistancePerTrip
FROM Driver d
JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN Shipment s ON d.DriverID = s.DriverID
LEFT JOIN FuelLog fl ON d.DriverID = fl.DriverID
WHERE d.Status = 'active'
GROUP BY d.DriverID, e.FullName, d.LicenseNumber, d.ExperienceYears
ORDER BY TotalShipments DESC;

-- Get truck utilization report
SELECT t.TruckID, t.PlateNumber, t.Capacity, t.FuelType, t.Status,
       tc.CompanyName,
       COUNT(s.ShipmentID) AS TotalShipments,
       SUM(fl.DistanceTraveled) AS TotalDistance,
       AVG(fl.DistanceTraveled) AS AvgDistancePerTrip
FROM Truck t
LEFT JOIN TransportCompany tc ON t.CompanyID = tc.CompanyID
LEFT JOIN Shipment s ON t.TruckID = s.TruckID
LEFT JOIN FuelLog fl ON t.TruckID = fl.TruckID
GROUP BY t.TruckID, t.PlateNumber, t.Capacity, t.FuelType, t.Status, tc.CompanyName
ORDER BY TotalShipments DESC;

-- Get transport company performance
SELECT tc.CompanyID, tc.CompanyName, tc.Rating,
       COUNT(s.ShipmentID) AS TotalShipments,
       COUNT(CASE WHEN s.Status = 'delivered' THEN 1 END) AS DeliveredShipments,
       COUNT(CASE WHEN s.Status = 'in_transit' THEN 1 END) AS InTransitShipments,
       COUNT(t.TruckID) AS TotalTrucks
FROM TransportCompany tc
LEFT JOIN Shipment s ON tc.CompanyID = s.CompanyID
LEFT JOIN Truck t ON tc.CompanyID = t.CompanyID
GROUP BY tc.CompanyID, tc.CompanyName, tc.Rating
ORDER BY TotalShipments DESC;

-- Get fuel consumption by driver
SELECT d.DriverID, e.FullName AS DriverName,
       COUNT(fl.FuelLogID) AS TotalTrips,
       SUM(fl.DistanceTraveled) AS TotalDistance,
       AVG(fl.DistanceTraveled) AS AvgDistancePerTrip
FROM Driver d
JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN FuelLog fl ON d.DriverID = fl.DriverID
WHERE fl.TripDate BETWEEN $1 AND $2
GROUP BY d.DriverID, e.FullName
ORDER BY TotalDistance DESC;

-- Get fuel consumption by truck
SELECT t.TruckID, t.PlateNumber, t.FuelType,
       COUNT(fl.FuelLogID) AS TotalTrips,
       SUM(fl.DistanceTraveled) AS TotalDistance,
       AVG(fl.DistanceTraveled) AS AvgDistancePerTrip
FROM Truck t
LEFT JOIN FuelLog fl ON t.TruckID = fl.TruckID
WHERE fl.TripDate BETWEEN $1 AND $2
GROUP BY t.TruckID, t.PlateNumber, t.FuelType
ORDER BY TotalDistance DESC;

-- Get most used routes
SELECT r.RouteID, r.StartLocation, r.EndLocation, r.DistanceKM, r.EstimatedTime,
       COUNT(s.ShipmentID) AS TotalShipments
FROM Route r
LEFT JOIN Shipment s ON r.RouteID = s.RouteID
GROUP BY r.RouteID, r.StartLocation, r.EndLocation, r.DistanceKM, r.EstimatedTime
ORDER BY TotalShipments DESC
LIMIT $1;


-- ============================================
-- ADVANCED QUERIES: SAWMILL PROCESSING
-- ============================================

-- Get processing orders by date range
SELECT po.ProcessingID, po.StartDate, po.EndDate, po.OutputQuantity, po.EfficiencyRate,
       pt.Name AS ProductName, pt.Grade,
       pu.UnitID, pu.Cutting, pu.Drying, pu.Finishing,
       s.Name AS SawmillName
FROM ProcessingOrder po
LEFT JOIN ProductType pt ON po.ProductTypeID = pt.ProductTypeID
LEFT JOIN ProcessingUnit pu ON po.UnitID = pu.UnitID
LEFT JOIN Sawmill s ON pu.SawmillID = s.SawmillID
WHERE po.StartDate BETWEEN $1 AND $2
ORDER BY po.StartDate DESC;

-- Get processing efficiency by sawmill
SELECT s.SawmillID, s.Name AS SawmillName, s.Location,
       COUNT(po.ProcessingID) AS TotalProcessingOrders,
       SUM(po.OutputQuantity) AS TotalOutput,
       AVG(po.EfficiencyRate) AS AvgEfficiencyRate,
       MIN(po.EfficiencyRate) AS MinEfficiencyRate,
       MAX(po.EfficiencyRate) AS MaxEfficiencyRate
FROM Sawmill s
LEFT JOIN ProcessingUnit pu ON s.SawmillID = pu.SawmillID
LEFT JOIN ProcessingOrder po ON pu.UnitID = po.UnitID
WHERE po.StartDate BETWEEN $1 AND $2
GROUP BY s.SawmillID, s.Name, s.Location
ORDER BY AvgEfficiencyRate DESC;

-- Get processing unit utilization
SELECT pu.UnitID, pu.Cutting, pu.Drying, pu.Finishing, pu.Capacity, pu.Status,
       s.Name AS SawmillName,
       COUNT(po.ProcessingID) AS TotalOrders,
       SUM(po.OutputQuantity) AS TotalOutput,
       AVG(po.EfficiencyRate) AS AvgEfficiency
FROM ProcessingUnit pu
JOIN Sawmill s ON pu.SawmillID = s.SawmillID
LEFT JOIN ProcessingOrder po ON pu.UnitID = po.UnitID
GROUP BY pu.UnitID, pu.Cutting, pu.Drying, pu.Finishing, pu.Capacity, pu.Status, s.Name
ORDER BY TotalOutput DESC;

-- Get processing order with input batches
SELECT po.ProcessingID, po.StartDate, po.EndDate, po.OutputQuantity, po.EfficiencyRate,
       pt.Name AS ProductName,
       hb.BatchID, hb.Quantity AS InputQuantity, hb.HarvestDate,
       ts.SpeciesName, f.ForestName
FROM ProcessingOrder po
LEFT JOIN ProductType pt ON po.ProductTypeID = pt.ProductTypeID
LEFT JOIN HarvestBatch_Processing hbp ON po.ProcessingID = hbp.ProcessingID
LEFT JOIN HarvestBatch hb ON hbp.BatchID = hb.BatchID
LEFT JOIN TreeSpecies ts ON hb.SpeciesID = ts.SpeciesID
LEFT JOIN Forest f ON hb.ForestID = f.ForestID
WHERE po.ProcessingID = $1
ORDER BY hb.BatchID;

-- Calculate waste percentage by processing order
SELECT po.ProcessingID, po.StartDate, po.EndDate, po.OutputQuantity,
       pt.Name AS ProductName,
       COALESCE(SUM(hb.Quantity), 0) AS TotalInputQuantity,
       COALESCE(SUM(wr.Volume), 0) AS TotalWasteVolume,
       CASE 
           WHEN SUM(hb.Quantity) > 0 THEN 
               (SUM(wr.Volume) / SUM(hb.Quantity) * 100)
           ELSE 0 
       END AS WastePercentage
FROM ProcessingOrder po
LEFT JOIN ProductType pt ON po.ProductTypeID = pt.ProductTypeID
LEFT JOIN HarvestBatch_Processing hbp ON po.ProcessingID = hbp.ProcessingID
LEFT JOIN HarvestBatch hb ON hbp.BatchID = hb.BatchID
LEFT JOIN WasteRecord wr ON po.ProcessingID = wr.ProcessingID
GROUP BY po.ProcessingID, po.StartDate, po.EndDate, po.OutputQuantity, pt.Name
ORDER BY WastePercentage DESC;

-- Get production efficiency report
SELECT 
    DATE_TRUNC('month', po.StartDate) AS Month,
    COUNT(po.ProcessingID) AS TotalOrders,
    SUM(po.OutputQuantity) AS TotalOutput,
    AVG(po.EfficiencyRate) AS AvgEfficiencyRate,
    SUM(COALESCE(wr.Volume, 0)) AS TotalWaste
FROM ProcessingOrder po
LEFT JOIN WasteRecord wr ON po.ProcessingID = wr.ProcessingID
WHERE po.StartDate BETWEEN $1 AND $2
GROUP BY DATE_TRUNC('month', po.StartDate)
ORDER BY Month DESC;


-- ============================================
-- ADVANCED QUERIES: QUALITY CHECKS
-- ============================================

-- Get quality inspections by result
SELECT qi.InspectionID, qi.Date, qi.Result, qi.MoistureLevel, qi.CertificationID,
       e.FullName AS InspectorName,
       po.ProcessingID, hb.BatchID, hb.QRCode
FROM QualityInspection qi
LEFT JOIN Employee e ON qi.EmployeeID = e.EmployeeID
LEFT JOIN ProcessingOrder po ON qi.ProcessingID = po.ProcessingID
LEFT JOIN HarvestBatch hb ON qi.BatchID = hb.BatchID
WHERE qi.Result = $1
ORDER BY qi.Date DESC;

-- Get quality inspection summary by inspector
SELECT e.EmployeeID, e.FullName AS InspectorName, e.Department,
       COUNT(qi.InspectionID) AS TotalInspections,
       COUNT(CASE WHEN qi.Result = 'passed' THEN 1 END) AS PassedInspections,
       COUNT(CASE WHEN qi.Result = 'failed' THEN 1 END) AS FailedInspections,
       AVG(qi.MoistureLevel) AS AvgMoistureLevel
FROM Employee e
JOIN QualityInspection qi ON e.EmployeeID = qi.EmployeeID
WHERE qi.Date BETWEEN $1 AND $2
GROUP BY e.EmployeeID, e.FullName, e.Department
ORDER BY TotalInspections DESC;

-- Get quality inspection pass rate by product type
SELECT pt.ProductTypeID, pt.Name AS ProductName, pt.Grade,
       COUNT(qi.InspectionID) AS TotalInspections,
       COUNT(CASE WHEN qi.Result = 'passed' THEN 1 END) AS PassedInspections,
       COUNT(CASE WHEN qi.Result = 'failed' THEN 1 END) AS FailedInspections,
       CASE 
           WHEN COUNT(qi.InspectionID) > 0 THEN
               (COUNT(CASE WHEN qi.Result = 'passed' THEN 1 END)::DECIMAL / COUNT(qi.InspectionID) * 100)
           ELSE 0
       END AS PassRate
FROM ProductType pt
LEFT JOIN ProcessingOrder po ON pt.ProductTypeID = po.ProductTypeID
LEFT JOIN QualityInspection qi ON po.ProcessingID = qi.ProcessingID
WHERE qi.Date BETWEEN $1 AND $2
GROUP BY pt.ProductTypeID, pt.Name, pt.Grade
ORDER BY PassRate DESC;

-- Get batches with failed quality inspections
SELECT hb.BatchID, hb.QRCode, hb.Quantity, hb.HarvestDate,
       f.ForestName, ts.SpeciesName,
       qi.InspectionID, qi.Date AS InspectionDate, qi.Result, 
       qi.MoistureLevel, e.FullName AS InspectorName
FROM HarvestBatch hb
LEFT JOIN Forest f ON hb.ForestID = f.ForestID
LEFT JOIN TreeSpecies ts ON hb.SpeciesID = ts.SpeciesID
JOIN QualityInspection qi ON hb.BatchID = qi.BatchID
LEFT JOIN Employee e ON qi.EmployeeID = e.EmployeeID
WHERE qi.Result = 'failed'
ORDER BY qi.Date DESC;

-- Get certification compliance report
SELECT 
    COUNT(DISTINCT qi.InspectionID) AS TotalInspections,
    COUNT(DISTINCT CASE WHEN qi.CertificationID IS NOT NULL THEN qi.InspectionID END) AS CertifiedInspections,
    COUNT(DISTINCT CASE WHEN qi.CertificationID IS NULL THEN qi.InspectionID END) AS UncertifiedInspections,
    CASE 
        WHEN COUNT(qi.InspectionID) > 0 THEN
            (COUNT(CASE WHEN qi.CertificationID IS NOT NULL THEN 1 END)::DECIMAL / COUNT(qi.InspectionID) * 100)
        ELSE 0
    END AS CertificationRate
FROM QualityInspection qi
WHERE qi.Date BETWEEN $1 AND $2;
