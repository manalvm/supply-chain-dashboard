-- ============================================
-- ADVANCED QUERIES: INVOICING & PAYMENTS
-- ============================================

-- Get invoices by status
SELECT i.InvoiceID, i.InvoiceDate, i.DueDate, i.TotalAmount, i.Tax, i.Currency, i.Status,
       so.SOID, c.Name AS CustomerName, c.ContactInfo
FROM Invoice i
LEFT JOIN SalesOrder so ON i.SOID = so.SOID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
WHERE i.Status = $1
ORDER BY i.InvoiceDate DESC;

-- Get overdue invoices
SELECT i.InvoiceID, i.InvoiceDate, i.DueDate, i.TotalAmount, i.Tax, i.Currency, i.Status,
       so.SOID, c.Name AS CustomerName, c.ContactInfo, c.Email,
       CURRENT_DATE - i.DueDate AS DaysOverdue,
       i.TotalAmount - COALESCE(SUM(p.Amount), 0) AS AmountDue
FROM Invoice i
LEFT JOIN SalesOrder so ON i.SOID = so.SOID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
LEFT JOIN Payment p ON i.InvoiceID = p.InvoiceID
WHERE i.DueDate < CURRENT_DATE AND i.Status != 'paid'
GROUP BY i.InvoiceID, i.InvoiceDate, i.DueDate, i.TotalAmount, i.Tax, i.Currency, i.Status,
         so.SOID, c.Name, c.ContactInfo, c.Email
ORDER BY DaysOverdue DESC;

-- Get invoice details with payments
SELECT i.InvoiceID, i.InvoiceDate, i.DueDate, i.TotalAmount, i.Tax, i.Currency, i.Status,
       so.SOID, so.OrderDate, c.Name AS CustomerName,
       p.PaymentID, p.PaymentDate, p.Amount AS PaymentAmount, p.Method, p.ReferenceNo,
       i.TotalAmount - COALESCE(SUM(p.Amount) OVER (PARTITION BY i.InvoiceID), 0) AS RemainingBalance
FROM Invoice i
LEFT JOIN SalesOrder so ON i.SOID = so.SOID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
LEFT JOIN Payment p ON i.InvoiceID = p.InvoiceID
WHERE i.InvoiceID = $1
ORDER BY p.PaymentDate;

-- Get payment aging report
SELECT 
    COUNT(CASE WHEN i.DueDate >= CURRENT_DATE THEN 1 END) AS Current,
    COUNT(CASE WHEN CURRENT_DATE - i.DueDate BETWEEN 1 AND 30 THEN 1 END) AS Days_1_30,
    COUNT(CASE WHEN CURRENT_DATE - i.DueDate BETWEEN 31 AND 60 THEN 1 END) AS Days_31_60,
    COUNT(CASE WHEN CURRENT_DATE - i.DueDate BETWEEN 61 AND 90 THEN 1 END) AS Days_61_90,
    COUNT(CASE WHEN CURRENT_DATE - i.DueDate > 90 THEN 1 END) AS Days_Over_90,
    SUM(CASE WHEN i.DueDate >= CURRENT_DATE THEN i.TotalAmount ELSE 0 END) AS Current_Amount,
    SUM(CASE WHEN CURRENT_DATE - i.DueDate BETWEEN 1 AND 30 THEN i.TotalAmount ELSE 0 END) AS Days_1_30_Amount,
    SUM(CASE WHEN CURRENT_DATE - i.DueDate BETWEEN 31 AND 60 THEN i.TotalAmount ELSE 0 END) AS Days_31_60_Amount,
    SUM(CASE WHEN CURRENT_DATE - i.DueDate BETWEEN 61 AND 90 THEN i.TotalAmount ELSE 0 END) AS Days_61_90_Amount,
    SUM(CASE WHEN CURRENT_DATE - i.DueDate > 90 THEN i.TotalAmount ELSE 0 END) AS Days_Over_90_Amount
FROM Invoice i
WHERE i.Status != 'paid';

-- Get revenue summary by payment method
SELECT p.Method AS PaymentMethod,
       COUNT(p.PaymentID) AS TotalPayments,
       SUM(p.Amount) AS TotalAmount,
       AVG(p.Amount) AS AvgPaymentAmount
FROM Payment p
WHERE p.PaymentDate BETWEEN $1 AND $2
GROUP BY p.Method
ORDER BY TotalAmount DESC;

-- Get invoice and payment summary by customer
SELECT c.CustomerID, c.Name AS CustomerName,
       COUNT(DISTINCT i.InvoiceID) AS TotalInvoices,
       SUM(i.TotalAmount) AS TotalInvoiced,
       SUM(COALESCE(p.Amount, 0)) AS TotalPaid,
       SUM(i.TotalAmount) - SUM(COALESCE(p.Amount, 0)) AS OutstandingBalance
FROM Customer c
LEFT JOIN SalesOrder so ON c.CustomerID = so.CustomerID
LEFT JOIN Invoice i ON so.SOID = i.SOID
LEFT JOIN Payment p ON i.InvoiceID = p.InvoiceID
GROUP BY c.CustomerID, c.Name
HAVING SUM(i.TotalAmount) > 0
ORDER BY OutstandingBalance DESC;

-- Get monthly revenue and collection report
SELECT 
    DATE_TRUNC('month', i.InvoiceDate) AS Month,
    COUNT(i.InvoiceID) AS TotalInvoices,
    SUM(i.TotalAmount) AS TotalInvoiced,
    SUM(i.Tax) AS TotalTax,
    COUNT(p.PaymentID) AS TotalPayments,
    SUM(p.Amount) AS TotalCollected,
    SUM(i.TotalAmount) - COALESCE(SUM(p.Amount), 0) AS Outstanding
FROM Invoice i
LEFT JOIN Payment p ON i.InvoiceID = p.InvoiceID AND p.PaymentDate BETWEEN $1 AND $2
WHERE i.InvoiceDate BETWEEN $1 AND $2
GROUP BY DATE_TRUNC('month', i.InvoiceDate)
ORDER BY Month DESC;

-- Get unpaid invoices summary
SELECT i.InvoiceID, i.InvoiceDate, i.DueDate, i.TotalAmount, i.Status,
       c.Name AS CustomerName, c.Email, c.ContactInfo,
       COALESCE(SUM(p.Amount), 0) AS AmountPaid,
       i.TotalAmount - COALESCE(SUM(p.Amount), 0) AS AmountDue,
       CASE 
           WHEN i.DueDate < CURRENT_DATE THEN 'Overdue'
           WHEN i.DueDate = CURRENT_DATE THEN 'Due Today'
           ELSE 'Upcoming'
       END AS PaymentStatus
FROM Invoice i
LEFT JOIN SalesOrder so ON i.SOID = so.SOID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
LEFT JOIN Payment p ON i.InvoiceID = p.InvoiceID
WHERE i.Status != 'paid'
GROUP BY i.InvoiceID, i.InvoiceDate, i.DueDate, i.TotalAmount, i.Status,
         c.Name, c.Email, c.ContactInfo
HAVING i.TotalAmount - COALESCE(SUM(p.Amount), 0) > 0
ORDER BY i.DueDate;


-- ============================================
-- ADVANCED QUERIES: EMPLOYEES & ROLES
-- ============================================

-- Get employees by department
SELECT EmployeeID, FullName, Department, Position, HireDate, PerformanceRating
FROM Employee
WHERE Department = $1
ORDER BY FullName;

-- Get employees by performance rating
SELECT EmployeeID, FullName, Department, Position, HireDate, PerformanceRating
FROM Employee
WHERE PerformanceRating >= $1
ORDER BY PerformanceRating DESC, FullName;

-- Get employee with user account details
SELECT e.EmployeeID, e.FullName, e.Department, e.Position,
       u.User_ID, u.Email, u.Status AS UserStatus,
       r.Role_ID, r.Role_Name, r.Description
FROM Employee e
LEFT JOIN User_Employee_Assignment uea ON e.EmployeeID = uea.EmployeeID
LEFT JOIN "User" u ON uea.User_ID = u.User_ID
LEFT JOIN Role r ON u.User_ID = r.User_ID
WHERE e.EmployeeID = $1
ORDER BY r.Role_Name;

-- Get employee workload (processing assignments)
SELECT e.EmployeeID, e.FullName, e.Department, e.Position,
       COUNT(wa.AssignmentID) AS TotalAssignments,
       COUNT(CASE WHEN po.EndDate >= CURRENT_DATE THEN 1 END) AS ActiveAssignments,
       COUNT(CASE WHEN po.EndDate < CURRENT_DATE THEN 1 END) AS CompletedAssignments
FROM Employee e
LEFT JOIN WorkerAssignment wa ON e.EmployeeID = wa.EmployeeID
LEFT JOIN ProcessingOrder po ON wa.ProcessingID = po.ProcessingID
GROUP BY e.EmployeeID, e.FullName, e.Department, e.Position
ORDER BY TotalAssignments DESC;

-- Get employee sales performance
SELECT e.EmployeeID, e.FullName, e.Department, e.Position,
       COUNT(so.SOID) AS TotalSalesOrders,
       SUM(so.TotalAmount) AS TotalRevenue,
       AVG(so.TotalAmount) AS AvgOrderValue
FROM Employee e
LEFT JOIN SalesOrder so ON e.EmployeeID = so.EmployeeID
WHERE so.OrderDate BETWEEN $1 AND $2
GROUP BY e.EmployeeID, e.FullName, e.Department, e.Position
ORDER BY TotalRevenue DESC;

-- Get employee purchase order activity
SELECT e.EmployeeID, e.FullName, e.Department, e.Position,
       COUNT(po.POID) AS TotalPurchaseOrders,
       SUM(po.TotalAmount) AS TotalPurchaseAmount,
       AVG(po.TotalAmount) AS AvgOrderValue
FROM Employee e
LEFT JOIN PurchaseOrder po ON e.EmployeeID = po.EmployeeID
WHERE po.OrderDate BETWEEN $1 AND $2
GROUP BY e.EmployeeID, e.FullName, e.Department, e.Position
ORDER BY TotalPurchaseAmount DESC;

-- Get quality inspector performance
SELECT e.EmployeeID, e.FullName, e.Department,
       COUNT(qi.InspectionID) AS TotalInspections,
       COUNT(CASE WHEN qi.Result = 'passed' THEN 1 END) AS PassedInspections,
       COUNT(CASE WHEN qi.Result = 'failed' THEN 1 END) AS FailedInspections,
       CASE 
           WHEN COUNT(qi.InspectionID) > 0 THEN
               (COUNT(CASE WHEN qi.Result = 'passed' THEN 1 END)::DECIMAL / COUNT(qi.InspectionID) * 100)
           ELSE 0
       END AS PassRate
FROM Employee e
JOIN QualityInspection qi ON e.EmployeeID = qi.EmployeeID
WHERE qi.Date BETWEEN $1 AND $2
GROUP BY e.EmployeeID, e.FullName, e.Department
ORDER BY TotalInspections DESC;


-- ============================================
-- ADVANCED QUERIES: AUTHENTICATION & ACCESS CONTROL
-- ============================================

-- Get user with roles and permissions
SELECT u.User_ID, u.Email, u.First_Name, u.Last_Name, u.Status,
       r.Role_ID, r.Role_Name, r.Description,
       p.PermissionID, p.ModuleName, p.ActionType
FROM "User" u
LEFT JOIN Role r ON u.User_ID = r.User_ID
LEFT JOIN Role_Permission rp ON r.Role_ID = rp.Role_ID
LEFT JOIN Permission p ON rp.PermissionID = p.PermissionID
WHERE u.User_ID = $1
ORDER BY r.Role_Name, p.ModuleName, p.ActionType;

-- Get users by role
SELECT u.User_ID, u.Email, u.First_Name, u.Last_Name, u.Phone_Number, u.Status,
       r.Role_Name, r.Description
FROM "User" u
JOIN Role r ON u.User_ID = r.User_ID
WHERE r.Role_Name = $1
ORDER BY u.Email;

-- Get users with specific permission
SELECT DISTINCT u.User_ID, u.Email, u.First_Name, u.Last_Name, u.Status,
       r.Role_Name
FROM "User" u
JOIN Role r ON u.User_ID = r.User_ID
JOIN Role_Permission rp ON r.Role_ID = rp.Role_ID
JOIN Permission p ON rp.PermissionID = p.PermissionID
WHERE p.ModuleName = $1 AND p.ActionType = $2
ORDER BY u.Email;

-- Get active users with employee assignments
SELECT u.User_ID, u.Email, u.First_Name, u.Last_Name, u.Status,
       e.EmployeeID, e.FullName, e.Department, e.Position
FROM "User" u
LEFT JOIN User_Employee_Assignment uea ON u.User_ID = uea.User_ID
LEFT JOIN Employee e ON uea.EmployeeID = e.EmployeeID
WHERE u.Status = 'active'
ORDER BY u.Email;

-- Get role permissions summary
SELECT r.Role_ID, r.Role_Name, r.Description,
       COUNT(DISTINCT rp.PermissionID) AS TotalPermissions,
       COUNT(DISTINCT u.User_ID) AS TotalUsers,
       STRING_AGG(DISTINCT p.ModuleName, ', ') AS Modules
FROM Role r
LEFT JOIN Role_Permission rp ON r.Role_ID = rp.Role_ID
LEFT JOIN Permission p ON rp.PermissionID = p.PermissionID
LEFT JOIN "User" u ON r.User_ID = u.User_ID
GROUP BY r.Role_ID, r.Role_Name, r.Description
ORDER BY r.Role_Name;

-- Get permissions by module
SELECT p.ModuleName, p.ActionType,
       COUNT(DISTINCT rp.Role_ID) AS RolesWithPermission,
       STRING_AGG(DISTINCT r.Role_Name, ', ') AS Roles
FROM Permission p
LEFT JOIN Role_Permission rp ON p.PermissionID = rp.PermissionID
LEFT JOIN Role r ON rp.Role_ID = r.Role_ID
GROUP BY p.ModuleName, p.ActionType
ORDER BY p.ModuleName, p.ActionType;
