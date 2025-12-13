package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== CUSTOMERS ====================
func CreateCustomer(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var cust models.Customer
	json.NewDecoder(r.Body).Decode(&cust)

	query := `INSERT INTO Customer (Name, Retailer, EndUser, ContactInfo, Address, TaxNumber)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING CustomerID`
	err := config.DB.QueryRow(query, cust.Name, cust.Retailer, cust.EndUser, cust.ContactInfo,
		cust.Address, cust.TaxNumber).Scan(&cust.CustomerID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, cust)
}

func GetCustomers(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT CustomerID, Name, Retailer, EndUser, ContactInfo, Address, TaxNumber 
                           FROM Customer ORDER BY Name`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	custs := []models.Customer{}
	for rows.Next() {
		var c models.Customer
		rows.Scan(&c.CustomerID, &c.Name, &c.Retailer, &c.EndUser, &c.ContactInfo, &c.Address, &c.TaxNumber)
		custs = append(custs, c)
	}
	utils.RespondJSON(w, http.StatusOK, custs)
}

func UpdateCustomer(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var cust models.Customer
	json.NewDecoder(r.Body).Decode(&cust)

	query := `UPDATE Customer SET Name = $2, Retailer = $3, EndUser = $4, ContactInfo = $5,
              Address = $6, TaxNumber = $7 WHERE CustomerID = $1`
	_, err := config.DB.Exec(query, id, cust.Name, cust.Retailer, cust.EndUser, cust.ContactInfo,
		cust.Address, cust.TaxNumber)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Customer updated successfully")
}

func DeleteCustomer(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Customer WHERE CustomerID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Customer deleted successfully")
}

// ==================== SALES ORDERS ====================
func CreateSalesOrder(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var so models.SalesOrder
	json.NewDecoder(r.Body).Decode(&so)

	query := `INSERT INTO SalesOrder (EmployeeID, CustomerID, OrderDate, DeliveryDate, Status, TotalAmount)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING SOID`
	err := config.DB.QueryRow(query, so.EmployeeID, so.CustomerID, so.OrderDate,
		so.DeliveryDate, so.Status, so.TotalAmount).Scan(&so.SOID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, so)
}

func GetSalesOrders(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT SOID, EmployeeID, CustomerID, OrderDate, DeliveryDate, Status, TotalAmount 
                           FROM SalesOrder ORDER BY OrderDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	orders := []models.SalesOrder{}
	for rows.Next() {
		var s models.SalesOrder
		rows.Scan(&s.SOID, &s.EmployeeID, &s.CustomerID, &s.OrderDate,
			&s.DeliveryDate, &s.Status, &s.TotalAmount)
		orders = append(orders, s)
	}
	utils.RespondJSON(w, http.StatusOK, orders)
}

func UpdateSalesOrder(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var so models.SalesOrder
	json.NewDecoder(r.Body).Decode(&so)

	query := `UPDATE SalesOrder SET EmployeeID = $2, CustomerID = $3, OrderDate = $4,
              DeliveryDate = $5, Status = $6, TotalAmount = $7 WHERE SOID = $1`
	_, err := config.DB.Exec(query, id, so.EmployeeID, so.CustomerID, so.OrderDate,
		so.DeliveryDate, so.Status, so.TotalAmount)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "SalesOrder updated successfully")
}

func DeleteSalesOrder(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM SalesOrder WHERE SOID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "SalesOrder deleted successfully")
}

// ==================== SALES ORDER ITEMS ====================
func CreateSalesOrderItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var soi models.SalesOrderItem
	json.NewDecoder(r.Body).Decode(&soi)

	query := `INSERT INTO SalesOrderItem (SOID, ProductTypeID, Quantity, UnitPrice, Discount, Subtotal)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING SOItemID`
	err := config.DB.QueryRow(query, soi.SOID, soi.ProductTypeID, soi.Quantity,
		soi.UnitPrice, soi.Discount, soi.Subtotal).Scan(&soi.SOItemID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, soi)
}

func GetSalesOrderItems(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT SOItemID, SOID, ProductTypeID, Quantity, UnitPrice, Discount, Subtotal 
                           FROM SalesOrderItem ORDER BY SOItemID`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	items := []models.SalesOrderItem{}
	for rows.Next() {
		var s models.SalesOrderItem
		rows.Scan(&s.SOItemID, &s.SOID, &s.ProductTypeID, &s.Quantity, &s.UnitPrice, &s.Discount, &s.Subtotal)
		items = append(items, s)
	}
	utils.RespondJSON(w, http.StatusOK, items)
}

func UpdateSalesOrderItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var soi models.SalesOrderItem
	json.NewDecoder(r.Body).Decode(&soi)

	query := `UPDATE SalesOrderItem SET SOID = $2, ProductTypeID = $3, Quantity = $4,
              UnitPrice = $5, Discount = $6, Subtotal = $7 WHERE SOItemID = $1`
	_, err := config.DB.Exec(query, id, soi.SOID, soi.ProductTypeID, soi.Quantity,
		soi.UnitPrice, soi.Discount, soi.Subtotal)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "SalesOrderItem updated successfully")
}

func DeleteSalesOrderItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM SalesOrderItem WHERE SOItemID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "SalesOrderItem deleted successfully")
}