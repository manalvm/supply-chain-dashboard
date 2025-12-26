-- ============================================
-- CRUD OPERATIONS: SAWMILL & PROCESSING
-- ============================================

-- ============================================
-- Table: Sawmill
-- Columns: SawmillID, Name, Location, Capacity, Status
-- ============================================

-- INSERT
INSERT INTO Sawmill (Name, Location, Capacity, Status)
VALUES ($1, $2, $3, $4)
RETURNING SawmillID;

-- UPDATE
UPDATE Sawmill
SET Name = $2, Location = $3, Capacity = $4, Status = $5
WHERE SawmillID = $1;

-- DELETE
DELETE FROM Sawmill
WHERE SawmillID = $1;

-- VIEW by ID
SELECT SawmillID, Name, Location, Capacity, Status
FROM Sawmill
WHERE SawmillID = $1;

-- VIEW all
SELECT SawmillID, Name, Location, Capacity, Status
FROM Sawmill
ORDER BY Name;


-- ============================================
-- Table: ProcessingUnit
-- Columns: UnitID, SawmillID, Cutting, Drying, Finishing, Capacity, Status
-- ============================================

-- INSERT
INSERT INTO ProcessingUnit (SawmillID, Cutting, Drying, Finishing, Capacity, Status)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING UnitID;

-- UPDATE
UPDATE ProcessingUnit
SET SawmillID = $2, Cutting = $3, Drying = $4, Finishing = $5,
    Capacity = $6, Status = $7
WHERE UnitID = $1;

-- DELETE
DELETE FROM ProcessingUnit
WHERE UnitID = $1;

-- VIEW by ID
SELECT UnitID, SawmillID, Cutting, Drying, Finishing, Capacity, Status
FROM ProcessingUnit
WHERE UnitID = $1;

-- VIEW all
SELECT pu.UnitID, pu.SawmillID, s.Name AS SawmillName, pu.Cutting, 
       pu.Drying, pu.Finishing, pu.Capacity, pu.Status
FROM ProcessingUnit pu
JOIN Sawmill s ON pu.SawmillID = s.SawmillID
ORDER BY s.Name, pu.UnitID;


-- ============================================
-- Table: ProcessingOrder
-- Columns: ProcessingID, ProductTypeID, UnitID, StartDate, EndDate, OutputQuantity, EfficiencyRate
-- ============================================

-- INSERT
INSERT INTO ProcessingOrder (ProductTypeID, UnitID, StartDate, EndDate, OutputQuantity, EfficiencyRate)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING ProcessingID;

-- UPDATE
UPDATE ProcessingOrder
SET ProductTypeID = $2, UnitID = $3, StartDate = $4, EndDate = $5,
    OutputQuantity = $6, EfficiencyRate = $7
WHERE ProcessingID = $1;

-- DELETE
DELETE FROM ProcessingOrder
WHERE ProcessingID = $1;

-- VIEW by ID
SELECT ProcessingID, ProductTypeID, UnitID, StartDate, EndDate, 
       OutputQuantity, EfficiencyRate
FROM ProcessingOrder
WHERE ProcessingID = $1;

-- VIEW all
SELECT po.ProcessingID, po.ProductTypeID, pt.Name AS ProductName, 
       po.UnitID, po.StartDate, po.EndDate, po.OutputQuantity, po.EfficiencyRate
FROM ProcessingOrder po
LEFT JOIN ProductType pt ON po.ProductTypeID = pt.ProductTypeID
ORDER BY po.StartDate DESC;


-- ============================================
-- Table: MaintenanceRecord
-- Columns: MaintenanceID, UnitID, MaintenanceDate, Description, Cost, PartsUsed, DowntimeHours
-- ============================================

-- INSERT
INSERT INTO MaintenanceRecord (UnitID, MaintenanceDate, Description, Cost, PartsUsed, DowntimeHours)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING MaintenanceID;

-- UPDATE
UPDATE MaintenanceRecord
SET UnitID = $2, MaintenanceDate = $3, Description = $4, 
    Cost = $5, PartsUsed = $6, DowntimeHours = $7
WHERE MaintenanceID = $1;

-- DELETE
DELETE FROM MaintenanceRecord
WHERE MaintenanceID = $1;

-- VIEW by ID
SELECT MaintenanceID, UnitID, MaintenanceDate, Description, Cost, PartsUsed, DowntimeHours
FROM MaintenanceRecord
WHERE MaintenanceID = $1;

-- VIEW all
SELECT mr.MaintenanceID, mr.UnitID, pu.Cutting, pu.Drying, pu.Finishing,
       mr.MaintenanceDate, mr.Description, mr.Cost, mr.PartsUsed, mr.DowntimeHours
FROM MaintenanceRecord mr
JOIN ProcessingUnit pu ON mr.UnitID = pu.UnitID
ORDER BY mr.MaintenanceDate DESC;


-- ============================================
-- Table: WasteRecord
-- Columns: WasteID, ProcessingID, WasteType, Volume, DisposalMethod, Recycled
-- ============================================

-- INSERT
INSERT INTO WasteRecord (ProcessingID, WasteType, Volume, DisposalMethod, Recycled)
VALUES ($1, $2, $3, $4, $5)
RETURNING WasteID;

-- UPDATE
UPDATE WasteRecord
SET ProcessingID = $2, WasteType = $3, Volume = $4, 
    DisposalMethod = $5, Recycled = $6
WHERE WasteID = $1;

-- DELETE
DELETE FROM WasteRecord
WHERE WasteID = $1;

-- VIEW by ID
SELECT WasteID, ProcessingID, WasteType, Volume, DisposalMethod, Recycled
FROM WasteRecord
WHERE WasteID = $1;

-- VIEW all
SELECT wr.WasteID, wr.ProcessingID, wr.WasteType, wr.Volume, 
       wr.DisposalMethod, wr.Recycled
FROM WasteRecord wr
ORDER BY wr.WasteID DESC;
