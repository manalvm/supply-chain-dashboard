-- ============================================
-- CRUD OPERATIONS: EMPLOYEE & HR
-- ============================================

-- ============================================
-- Table: Employee
-- Columns: EmployeeID, FullName, Department, Position, HireDate, PerformanceRating
-- ============================================

-- INSERT
INSERT INTO Employee (FullName, Department, Position, HireDate, PerformanceRating)
VALUES ($1, $2, $3, $4, $5)
RETURNING EmployeeID;

-- UPDATE
UPDATE Employee
SET FullName = $2, Department = $3, Position = $4, 
    HireDate = $5, PerformanceRating = $6
WHERE EmployeeID = $1;

-- DELETE
DELETE FROM Employee
WHERE EmployeeID = $1;

-- VIEW by ID
SELECT EmployeeID, FullName, Department, Position, HireDate, PerformanceRating
FROM Employee
WHERE EmployeeID = $1;

-- VIEW all
SELECT EmployeeID, FullName, Department, Position, HireDate, PerformanceRating
FROM Employee
ORDER BY FullName;


-- ============================================
-- Table: WorkerAssignment
-- Columns: AssignmentID, EmployeeID, ProcessingID, RoleInTask, Notes
-- ============================================

-- INSERT
INSERT INTO WorkerAssignment (EmployeeID, ProcessingID, RoleInTask, Notes)
VALUES ($1, $2, $3, $4)
RETURNING AssignmentID;

-- UPDATE
UPDATE WorkerAssignment
SET EmployeeID = $2, ProcessingID = $3, RoleInTask = $4, Notes = $5
WHERE AssignmentID = $1;

-- DELETE
DELETE FROM WorkerAssignment
WHERE AssignmentID = $1;

-- VIEW by ID
SELECT AssignmentID, EmployeeID, ProcessingID, RoleInTask, Notes
FROM WorkerAssignment
WHERE AssignmentID = $1;

-- VIEW all
SELECT wa.AssignmentID, wa.EmployeeID, e.FullName, wa.ProcessingID, 
       wa.RoleInTask, wa.Notes
FROM WorkerAssignment wa
JOIN Employee e ON wa.EmployeeID = e.EmployeeID
ORDER BY wa.AssignmentID DESC;


-- ============================================
-- Table: Management_Insights
-- Columns: Report_ID, EmployeeID, KPI_Type, Time_Period
-- ============================================

-- INSERT
INSERT INTO Management_Insights (EmployeeID, KPI_Type, Time_Period)
VALUES ($1, $2, $3)
RETURNING Report_ID;

-- UPDATE
UPDATE Management_Insights
SET EmployeeID = $2, KPI_Type = $3, Time_Period = $4
WHERE Report_ID = $1;

-- DELETE
DELETE FROM Management_Insights
WHERE Report_ID = $1;

-- VIEW by ID
SELECT Report_ID, EmployeeID, KPI_Type, Time_Period
FROM Management_Insights
WHERE Report_ID = $1;

-- VIEW all
SELECT mi.Report_ID, mi.EmployeeID, e.FullName, mi.KPI_Type, mi.Time_Period
FROM Management_Insights mi
JOIN Employee e ON mi.EmployeeID = e.EmployeeID
ORDER BY mi.Report_ID DESC;
