-- ============================================
-- CRUD OPERATIONS: INVOICING & PAYMENTS
-- ============================================

-- ============================================
-- Table: Invoice
-- Columns: InvoiceID, SOID, InvoiceDate, DueDate, TotalAmount, Tax, Currency, Status
-- ============================================

-- INSERT
INSERT INTO Invoice (SOID, InvoiceDate, DueDate, TotalAmount, Tax, Currency, Status)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING InvoiceID;

-- UPDATE
UPDATE Invoice
SET SOID = $2, InvoiceDate = $3, DueDate = $4, TotalAmount = $5,
    Tax = $6, Currency = $7, Status = $8
WHERE InvoiceID = $1;

-- DELETE
DELETE FROM Invoice
WHERE InvoiceID = $1;

-- VIEW by ID
SELECT InvoiceID, SOID, InvoiceDate, DueDate, TotalAmount, Tax, Currency, Status
FROM Invoice
WHERE InvoiceID = $1;

-- VIEW all
SELECT i.InvoiceID, i.SOID, so.CustomerID, c.Name AS CustomerName,
       i.InvoiceDate, i.DueDate, i.TotalAmount, i.Tax, i.Currency, i.Status
FROM Invoice i
LEFT JOIN SalesOrder so ON i.SOID = so.SOID
LEFT JOIN Customer c ON so.CustomerID = c.CustomerID
ORDER BY i.InvoiceDate DESC;


-- ============================================
-- Table: Payment
-- Columns: PaymentID, InvoiceID, PaymentDate, Amount, Method, ReferenceNo, Status
-- ============================================

-- INSERT
INSERT INTO Payment (InvoiceID, PaymentDate, Amount, Method, ReferenceNo, Status)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING PaymentID;

-- UPDATE
UPDATE Payment
SET InvoiceID = $2, PaymentDate = $3, Amount = $4, 
    Method = $5, ReferenceNo = $6, Status = $7
WHERE PaymentID = $1;

-- DELETE
DELETE FROM Payment
WHERE PaymentID = $1;

-- VIEW by ID
SELECT PaymentID, InvoiceID, PaymentDate, Amount, Method, ReferenceNo, Status
FROM Payment
WHERE PaymentID = $1;

-- VIEW all
SELECT p.PaymentID, p.InvoiceID, i.SOID, p.PaymentDate, 
       p.Amount, p.Method, p.ReferenceNo, p.Status
FROM Payment p
LEFT JOIN Invoice i ON p.InvoiceID = i.InvoiceID
ORDER BY p.PaymentDate DESC;
