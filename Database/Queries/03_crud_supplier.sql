-- ============================================
-- CRUD OPERATIONS: SUPPLIER MANAGEMENT
-- ============================================

-- ============================================
-- Table: Supplier
-- Columns: SupplierID, CompanyName, ContactPerson, Email, Phone, ComplianceStatus, Raw, Semi_Processed
-- ============================================

-- INSERT
INSERT INTO Supplier (CompanyName, ContactPerson, Email, Phone, ComplianceStatus, Raw, Semi_Processed)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING SupplierID;

-- UPDATE
UPDATE Supplier
SET CompanyName = $2, ContactPerson = $3, Email = $4, Phone = $5,
    ComplianceStatus = $6, Raw = $7, Semi_Processed = $8
WHERE SupplierID = $1;

-- DELETE
DELETE FROM Supplier
WHERE SupplierID = $1;

-- VIEW by ID
SELECT SupplierID, CompanyName, ContactPerson, Email, Phone, 
       ComplianceStatus, Raw, Semi_Processed
FROM Supplier
WHERE SupplierID = $1;

-- VIEW all
SELECT SupplierID, CompanyName, ContactPerson, Email, Phone, 
       ComplianceStatus, Raw, Semi_Processed
FROM Supplier
ORDER BY CompanyName;


-- ============================================
-- Table: SupplierPerformance
-- Columns: PerformanceID, SupplierID, Rating, DeliveryTimeliness, QualityScore, ReviewDate
-- ============================================

-- INSERT
INSERT INTO SupplierPerformance (SupplierID, Rating, DeliveryTimeliness, QualityScore, ReviewDate)
VALUES ($1, $2, $3, $4, $5)
RETURNING PerformanceID;

-- UPDATE
UPDATE SupplierPerformance
SET SupplierID = $2, Rating = $3, DeliveryTimeliness = $4, 
    QualityScore = $5, ReviewDate = $6
WHERE PerformanceID = $1;

-- DELETE
DELETE FROM SupplierPerformance
WHERE PerformanceID = $1;

-- VIEW by ID
SELECT PerformanceID, SupplierID, Rating, DeliveryTimeliness, QualityScore, ReviewDate
FROM SupplierPerformance
WHERE PerformanceID = $1;

-- VIEW all
SELECT sp.PerformanceID, sp.SupplierID, s.CompanyName, sp.Rating, 
       sp.DeliveryTimeliness, sp.QualityScore, sp.ReviewDate
FROM SupplierPerformance sp
JOIN Supplier s ON sp.SupplierID = s.SupplierID
ORDER BY sp.ReviewDate DESC;


-- ============================================
-- Table: SupplierContract
-- Columns: ContractID, SupplierID, StartDate, EndDate, Terms, ContractValue, Status
-- ============================================

-- INSERT
INSERT INTO SupplierContract (SupplierID, StartDate, EndDate, Terms, ContractValue, Status)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING ContractID;

-- UPDATE
UPDATE SupplierContract
SET SupplierID = $2, StartDate = $3, EndDate = $4, 
    Terms = $5, ContractValue = $6, Status = $7
WHERE ContractID = $1;

-- DELETE
DELETE FROM SupplierContract
WHERE ContractID = $1;

-- VIEW by ID
SELECT ContractID, SupplierID, StartDate, EndDate, Terms, ContractValue, Status
FROM SupplierContract
WHERE ContractID = $1;

-- VIEW all
SELECT sc.ContractID, sc.SupplierID, s.CompanyName, sc.StartDate, 
       sc.EndDate, sc.Terms, sc.ContractValue, sc.Status
FROM SupplierContract sc
JOIN Supplier s ON sc.SupplierID = s.SupplierID
ORDER BY sc.StartDate DESC;
