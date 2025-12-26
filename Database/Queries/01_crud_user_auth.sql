-- ============================================
-- CRUD OPERATIONS: USER & AUTHENTICATION
-- ============================================

-- ============================================
-- Table: User
-- Columns: User_ID, Email, Password, First_Name, Last_Name, Phone_Number, Status, CreatedAt
-- ============================================

-- INSERT
INSERT INTO "User" (Email, Password, First_Name, Last_Name, Phone_Number, Status)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING User_ID;

-- UPDATE
UPDATE "User"
SET Email = $2, Password = $3, First_Name = $4, Last_Name = $5, 
    Phone_Number = $6, Status = $7
WHERE User_ID = $1;

-- DELETE
DELETE FROM "User"
WHERE User_ID = $1;

-- VIEW by ID
SELECT User_ID, Email, Password, First_Name, Last_Name, Phone_Number, Status, CreatedAt
FROM "User"
WHERE User_ID = $1;

-- VIEW all
SELECT User_ID, Email, Password, First_Name, Last_Name, Phone_Number, Status, CreatedAt
FROM "User"
ORDER BY CreatedAt DESC;


-- ============================================
-- Table: Permission
-- Columns: PermissionID, ModuleName, ActionType
-- ============================================

-- INSERT
INSERT INTO Permission (ModuleName, ActionType)
VALUES ($1, $2)
RETURNING PermissionID;

-- UPDATE
UPDATE Permission
SET ModuleName = $2, ActionType = $3
WHERE PermissionID = $1;

-- DELETE
DELETE FROM Permission
WHERE PermissionID = $1;

-- VIEW by ID
SELECT PermissionID, ModuleName, ActionType
FROM Permission
WHERE PermissionID = $1;

-- VIEW all
SELECT PermissionID, ModuleName, ActionType
FROM Permission
ORDER BY ModuleName, ActionType;


-- ============================================
-- Table: Role
-- Columns: Role_ID, User_ID, Role_Name, Description
-- ============================================

-- INSERT
INSERT INTO Role (User_ID, Role_Name, Description)
VALUES ($1, $2, $3)
RETURNING Role_ID;

-- UPDATE
UPDATE Role
SET User_ID = $2, Role_Name = $3, Description = $4
WHERE Role_ID = $1;

-- DELETE
DELETE FROM Role
WHERE Role_ID = $1;

-- VIEW by ID
SELECT Role_ID, User_ID, Role_Name, Description
FROM Role
WHERE Role_ID = $1;

-- VIEW all
SELECT Role_ID, User_ID, Role_Name, Description
FROM Role
ORDER BY Role_Name;


-- ============================================
-- Table: Role_Permission
-- Columns: Role_ID, PermissionID
-- ============================================

-- INSERT
INSERT INTO Role_Permission (Role_ID, PermissionID)
VALUES ($1, $2);

-- UPDATE (Not applicable for junction table - delete and insert instead)
-- N/A

-- DELETE
DELETE FROM Role_Permission
WHERE Role_ID = $1 AND PermissionID = $2;

-- VIEW by Role_ID
SELECT rp.Role_ID, rp.PermissionID, p.ModuleName, p.ActionType
FROM Role_Permission rp
JOIN Permission p ON rp.PermissionID = p.PermissionID
WHERE rp.Role_ID = $1;

-- VIEW all
SELECT rp.Role_ID, rp.PermissionID, r.Role_Name, p.ModuleName, p.ActionType
FROM Role_Permission rp
JOIN Role r ON rp.Role_ID = r.Role_ID
JOIN Permission p ON rp.PermissionID = p.PermissionID
ORDER BY r.Role_Name, p.ModuleName;


-- ============================================
-- Table: User_Employee_Assignment
-- Columns: User_ID, EmployeeID
-- ============================================

-- INSERT
INSERT INTO User_Employee_Assignment (User_ID, EmployeeID)
VALUES ($1, $2);

-- UPDATE (Not applicable for junction table)
-- N/A

-- DELETE
DELETE FROM User_Employee_Assignment
WHERE User_ID = $1 AND EmployeeID = $2;

-- VIEW by User_ID
SELECT uea.User_ID, uea.EmployeeID, e.FullName, e.Department, e.Position
FROM User_Employee_Assignment uea
JOIN Employee e ON uea.EmployeeID = e.EmployeeID
WHERE uea.User_ID = $1;

-- VIEW all
SELECT uea.User_ID, uea.EmployeeID, u.Email, e.FullName, e.Department
FROM User_Employee_Assignment uea
JOIN "User" u ON uea.User_ID = u.User_ID
JOIN Employee e ON uea.EmployeeID = e.EmployeeID
ORDER BY u.Email;


-- ============================================
-- Table: AuditLog
-- Columns: LogID, User_ID, ActionType, EntityAffected, Timestamp, Description, IPAddress
-- ============================================

-- INSERT
INSERT INTO AuditLog (User_ID, ActionType, EntityAffected, Description, IPAddress)
VALUES ($1, $2, $3, $4, $5)
RETURNING LogID;

-- UPDATE
UPDATE AuditLog
SET User_ID = $2, ActionType = $3, EntityAffected = $4, 
    Description = $5, IPAddress = $6
WHERE LogID = $1;

-- DELETE
DELETE FROM AuditLog
WHERE LogID = $1;

-- VIEW by ID
SELECT LogID, User_ID, ActionType, EntityAffected, Timestamp, Description, IPAddress
FROM AuditLog
WHERE LogID = $1;

-- VIEW all
SELECT LogID, User_ID, ActionType, EntityAffected, Timestamp, Description, IPAddress
FROM AuditLog
ORDER BY Timestamp DESC;
