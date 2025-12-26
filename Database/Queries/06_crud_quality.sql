-- ============================================
-- CRUD OPERATIONS: QUALITY CONTROL
-- ============================================

-- ============================================
-- Table: QualityInspection
-- Columns: InspectionID, EmployeeID, ProcessingID, POItemID, BatchID, Result, MoistureLevel, CertificationID, Date
-- ============================================

-- INSERT
INSERT INTO QualityInspection (EmployeeID, ProcessingID, POItemID, BatchID, Result, MoistureLevel, CertificationID, Date)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING InspectionID;

-- UPDATE
UPDATE QualityInspection
SET EmployeeID = $2, ProcessingID = $3, POItemID = $4, BatchID = $5,
    Result = $6, MoistureLevel = $7, CertificationID = $8, Date = $9
WHERE InspectionID = $1;

-- DELETE
DELETE FROM QualityInspection
WHERE InspectionID = $1;

-- VIEW by ID
SELECT InspectionID, EmployeeID, ProcessingID, POItemID, BatchID, 
       Result, MoistureLevel, CertificationID, Date
FROM QualityInspection
WHERE InspectionID = $1;

-- VIEW all
SELECT qi.InspectionID, qi.EmployeeID, e.FullName AS InspectorName,
       qi.ProcessingID, qi.POItemID, qi.BatchID, qi.Result, 
       qi.MoistureLevel, qi.CertificationID, qi.Date
FROM QualityInspection qi
LEFT JOIN Employee e ON qi.EmployeeID = e.EmployeeID
ORDER BY qi.Date DESC;
