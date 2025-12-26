-- ============================================
-- CRUD OPERATIONS: FOREST & HARVESTING
-- ============================================

-- ============================================
-- Table: Forest
-- Columns: ForestID, ForestName, GeoLocation, AreaSize, OwnershipType, Status
-- ============================================

-- INSERT
INSERT INTO Forest (ForestName, GeoLocation, AreaSize, OwnershipType, Status)
VALUES ($1, $2, $3, $4, $5)
RETURNING ForestID;

-- UPDATE
UPDATE Forest
SET ForestName = $2, GeoLocation = $3, AreaSize = $4, 
    OwnershipType = $5, Status = $6
WHERE ForestID = $1;

-- DELETE
DELETE FROM Forest
WHERE ForestID = $1;

-- VIEW by ID
SELECT ForestID, ForestName, GeoLocation, AreaSize, OwnershipType, Status
FROM Forest
WHERE ForestID = $1;

-- VIEW all
SELECT ForestID, ForestName, GeoLocation, AreaSize, OwnershipType, Status
FROM Forest
ORDER BY ForestName;


-- ============================================
-- Table: TreeSpecies
-- Columns: SpeciesID, SpeciesName, AverageHeight, Density, MoistureContent, Grade
-- ============================================

-- INSERT
INSERT INTO TreeSpecies (SpeciesName, AverageHeight, Density, MoistureContent, Grade)
VALUES ($1, $2, $3, $4, $5)
RETURNING SpeciesID;

-- UPDATE
UPDATE TreeSpecies
SET SpeciesName = $2, AverageHeight = $3, Density = $4, 
    MoistureContent = $5, Grade = $6
WHERE SpeciesID = $1;

-- DELETE
DELETE FROM TreeSpecies
WHERE SpeciesID = $1;

-- VIEW by ID
SELECT SpeciesID, SpeciesName, AverageHeight, Density, MoistureContent, Grade
FROM TreeSpecies
WHERE SpeciesID = $1;

-- VIEW all
SELECT SpeciesID, SpeciesName, AverageHeight, Density, MoistureContent, Grade
FROM TreeSpecies
ORDER BY SpeciesName;


-- ============================================
-- Table: HarvestSchedule
-- Columns: ScheduleID, ForestID, StartDate, EndDate, Status
-- ============================================

-- INSERT
INSERT INTO HarvestSchedule (ForestID, StartDate, EndDate, Status)
VALUES ($1, $2, $3, $4)
RETURNING ScheduleID;

-- UPDATE
UPDATE HarvestSchedule
SET ForestID = $2, StartDate = $3, EndDate = $4, Status = $5
WHERE ScheduleID = $1;

-- DELETE
DELETE FROM HarvestSchedule
WHERE ScheduleID = $1;

-- VIEW by ID
SELECT ScheduleID, ForestID, StartDate, EndDate, Status
FROM HarvestSchedule
WHERE ScheduleID = $1;

-- VIEW all
SELECT hs.ScheduleID, hs.ForestID, f.ForestName, hs.StartDate, hs.EndDate, hs.Status
FROM HarvestSchedule hs
JOIN Forest f ON hs.ForestID = f.ForestID
ORDER BY hs.StartDate DESC;


-- ============================================
-- Table: HarvestBatch
-- Columns: BatchID, ForestID, SpeciesID, ScheduleID, Quantity, HarvestDate, QualityIndicator, QRCode
-- ============================================

-- INSERT
INSERT INTO HarvestBatch (ForestID, SpeciesID, ScheduleID, Quantity, HarvestDate, QualityIndicator, QRCode)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING BatchID;

-- UPDATE
UPDATE HarvestBatch
SET ForestID = $2, SpeciesID = $3, ScheduleID = $4, Quantity = $5,
    HarvestDate = $6, QualityIndicator = $7, QRCode = $8
WHERE BatchID = $1;

-- DELETE
DELETE FROM HarvestBatch
WHERE BatchID = $1;

-- VIEW by ID
SELECT BatchID, ForestID, SpeciesID, ScheduleID, Quantity, 
       HarvestDate, QualityIndicator, QRCode
FROM HarvestBatch
WHERE BatchID = $1;

-- VIEW all
SELECT hb.BatchID, hb.ForestID, f.ForestName, hb.SpeciesID, ts.SpeciesName,
       hb.ScheduleID, hb.Quantity, hb.HarvestDate, hb.QualityIndicator, hb.QRCode
FROM HarvestBatch hb
LEFT JOIN Forest f ON hb.ForestID = f.ForestID
LEFT JOIN TreeSpecies ts ON hb.SpeciesID = ts.SpeciesID
ORDER BY hb.HarvestDate DESC;


-- ============================================
-- Table: HarvestBatch_Processing
-- Columns: ProcessingID, BatchID
-- ============================================

-- INSERT
INSERT INTO HarvestBatch_Processing (ProcessingID, BatchID)
VALUES ($1, $2);

-- UPDATE (Not applicable for junction table)
-- N/A

-- DELETE
DELETE FROM HarvestBatch_Processing
WHERE ProcessingID = $1 AND BatchID = $2;

-- VIEW by ProcessingID
SELECT hbp.ProcessingID, hbp.BatchID, hb.Quantity, hb.HarvestDate, hb.QRCode
FROM HarvestBatch_Processing hbp
JOIN HarvestBatch hb ON hbp.BatchID = hb.BatchID
WHERE hbp.ProcessingID = $1;

-- VIEW all
SELECT hbp.ProcessingID, hbp.BatchID, hb.Quantity, hb.HarvestDate, hb.QRCode
FROM HarvestBatch_Processing hbp
JOIN HarvestBatch hb ON hbp.BatchID = hb.BatchID
ORDER BY hbp.ProcessingID, hbp.BatchID;
