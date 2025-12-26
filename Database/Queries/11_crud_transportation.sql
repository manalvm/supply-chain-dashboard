-- ============================================
-- CRUD OPERATIONS: TRANSPORTATION & LOGISTICS
-- ============================================

-- ============================================
-- Table: TransportCompany
-- Columns: CompanyID, CompanyName, ContactInfo, LicenseNumber, Rating
-- ============================================

-- INSERT
INSERT INTO TransportCompany (CompanyName, ContactInfo, LicenseNumber, Rating)
VALUES ($1, $2, $3, $4)
RETURNING CompanyID;

-- UPDATE
UPDATE TransportCompany
SET CompanyName = $2, ContactInfo = $3, LicenseNumber = $4, Rating = $5
WHERE CompanyID = $1;

-- DELETE
DELETE FROM TransportCompany
WHERE CompanyID = $1;

-- VIEW by ID
SELECT CompanyID, CompanyName, ContactInfo, LicenseNumber, Rating
FROM TransportCompany
WHERE CompanyID = $1;

-- VIEW all
SELECT CompanyID, CompanyName, ContactInfo, LicenseNumber, Rating
FROM TransportCompany
ORDER BY CompanyName;


-- ============================================
-- Table: Truck
-- Columns: TruckID, CompanyID, PlateNumber, Capacity, FuelType, Status
-- ============================================

-- INSERT
INSERT INTO Truck (CompanyID, PlateNumber, Capacity, FuelType, Status)
VALUES ($1, $2, $3, $4, $5)
RETURNING TruckID;

-- UPDATE
UPDATE Truck
SET CompanyID = $2, PlateNumber = $3, Capacity = $4, 
    FuelType = $5, Status = $6
WHERE TruckID = $1;

-- DELETE
DELETE FROM Truck
WHERE TruckID = $1;

-- VIEW by ID
SELECT TruckID, CompanyID, PlateNumber, Capacity, FuelType, Status
FROM Truck
WHERE TruckID = $1;

-- VIEW all
SELECT t.TruckID, t.CompanyID, tc.CompanyName, t.PlateNumber, 
       t.Capacity, t.FuelType, t.Status
FROM Truck t
LEFT JOIN TransportCompany tc ON t.CompanyID = tc.CompanyID
ORDER BY tc.CompanyName, t.PlateNumber;


-- ============================================
-- Table: Driver
-- Columns: DriverID, EmployeeID, LicenseNumber, ExperienceYears, Status
-- ============================================

-- INSERT
INSERT INTO Driver (EmployeeID, LicenseNumber, ExperienceYears, Status)
VALUES ($1, $2, $3, $4)
RETURNING DriverID;

-- UPDATE
UPDATE Driver
SET EmployeeID = $2, LicenseNumber = $3, ExperienceYears = $4, Status = $5
WHERE DriverID = $1;

-- DELETE
DELETE FROM Driver
WHERE DriverID = $1;

-- VIEW by ID
SELECT DriverID, EmployeeID, LicenseNumber, ExperienceYears, Status
FROM Driver
WHERE DriverID = $1;

-- VIEW all
SELECT d.DriverID, d.EmployeeID, e.FullName AS DriverName, 
       d.LicenseNumber, d.ExperienceYears, d.Status
FROM Driver d
JOIN Employee e ON d.EmployeeID = e.EmployeeID
ORDER BY e.FullName;


-- ============================================
-- Table: Route
-- Columns: RouteID, StartLocation, EndLocation, DistanceKM, EstimatedTime
-- ============================================

-- INSERT
INSERT INTO Route (StartLocation, EndLocation, DistanceKM, EstimatedTime)
VALUES ($1, $2, $3, $4)
RETURNING RouteID;

-- UPDATE
UPDATE Route
SET StartLocation = $2, EndLocation = $3, DistanceKM = $4, EstimatedTime = $5
WHERE RouteID = $1;

-- DELETE
DELETE FROM Route
WHERE RouteID = $1;

-- VIEW by ID
SELECT RouteID, StartLocation, EndLocation, DistanceKM, EstimatedTime
FROM Route
WHERE RouteID = $1;

-- VIEW all
SELECT RouteID, StartLocation, EndLocation, DistanceKM, EstimatedTime
FROM Route
ORDER BY StartLocation, EndLocation;


-- ============================================
-- Table: Shipment
-- Columns: ShipmentID, SOID, TruckID, DriverID, CompanyID, RouteID, ShipmentDate, Status, ProofOfDelivery
-- ============================================

-- INSERT
INSERT INTO Shipment (SOID, TruckID, DriverID, CompanyID, RouteID, ShipmentDate, Status, ProofOfDelivery)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING ShipmentID;

-- UPDATE
UPDATE Shipment
SET SOID = $2, TruckID = $3, DriverID = $4, CompanyID = $5,
    RouteID = $6, ShipmentDate = $7, Status = $8, ProofOfDelivery = $9
WHERE ShipmentID = $1;

-- DELETE
DELETE FROM Shipment
WHERE ShipmentID = $1;

-- VIEW by ID
SELECT ShipmentID, SOID, TruckID, DriverID, CompanyID, RouteID, 
       ShipmentDate, Status, ProofOfDelivery
FROM Shipment
WHERE ShipmentID = $1;

-- VIEW all
SELECT s.ShipmentID, s.SOID, s.TruckID, t.PlateNumber,
       s.DriverID, e.FullName AS DriverName, s.CompanyID, tc.CompanyName,
       s.RouteID, r.StartLocation, r.EndLocation,
       s.ShipmentDate, s.Status, s.ProofOfDelivery
FROM Shipment s
LEFT JOIN SalesOrder so ON s.SOID = so.SOID
LEFT JOIN Truck t ON s.TruckID = t.TruckID
LEFT JOIN Driver d ON s.DriverID = d.DriverID
LEFT JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN TransportCompany tc ON s.CompanyID = tc.CompanyID
LEFT JOIN Route r ON s.RouteID = r.RouteID
ORDER BY s.ShipmentDate DESC;


-- ============================================
-- Table: FuelLog
-- Columns: FuelLogID, DriverID, TruckID, TripDate, DistanceTraveled
-- ============================================

-- INSERT
INSERT INTO FuelLog (DriverID, TruckID, TripDate, DistanceTraveled)
VALUES ($1, $2, $3, $4)
RETURNING FuelLogID;

-- UPDATE
UPDATE FuelLog
SET DriverID = $2, TruckID = $3, TripDate = $4, DistanceTraveled = $5
WHERE FuelLogID = $1;

-- DELETE
DELETE FROM FuelLog
WHERE FuelLogID = $1;

-- VIEW by ID
SELECT FuelLogID, DriverID, TruckID, TripDate, DistanceTraveled
FROM FuelLog
WHERE FuelLogID = $1;

-- VIEW all
SELECT fl.FuelLogID, fl.DriverID, e.FullName AS DriverName,
       fl.TruckID, t.PlateNumber, fl.TripDate, fl.DistanceTraveled
FROM FuelLog fl
LEFT JOIN Driver d ON fl.DriverID = d.DriverID
LEFT JOIN Employee e ON d.EmployeeID = e.EmployeeID
LEFT JOIN Truck t ON fl.TruckID = t.TruckID
ORDER BY fl.TripDate DESC;
