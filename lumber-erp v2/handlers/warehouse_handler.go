package handlers

import (
	"encoding/json"
	"fmt"
	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
	"net/http"
)

// ==================== WAREHOUSES ====================
func CreateWarehouse(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var wh models.Warehouse
	json.NewDecoder(r.Body).Decode(&wh)

	query := `INSERT INTO Warehouse (Name, Location, Capacity, Contact)
              VALUES ($1, $2, $3, $4) RETURNING WarehouseID`
	err := config.DB.QueryRow(query, wh.Name, wh.Location, wh.Capacity, wh.Contact).Scan(&wh.WarehouseID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, wh)
}

func GetWarehouses(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT WarehouseID, Name, Location, Capacity, Contact FROM Warehouse ORDER BY Name`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	warehouses := []models.Warehouse{}
	for rows.Next() {
		var w models.Warehouse
		rows.Scan(&w.WarehouseID, &w.Name, &w.Location, &w.Capacity, &w.Contact)
		warehouses = append(warehouses, w)
	}
	utils.RespondJSON(w, http.StatusOK, warehouses)
}

func UpdateWarehouse(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var wh models.Warehouse
	json.NewDecoder(r.Body).Decode(&wh)

	query := `UPDATE Warehouse SET Name = $2, Location = $3, Capacity = $4, Contact = $5 WHERE WarehouseID = $1`
	_, err := config.DB.Exec(query, id, wh.Name, wh.Location, wh.Capacity, wh.Contact)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Warehouse updated successfully")
}

func DeleteWarehouse(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Warehouse WHERE WarehouseID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Warehouse deleted successfully")
}

// ==================== PRODUCT TYPES ====================
func CreateProductType(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)

	// Receive data with frontend field names
	var requestData struct {
		ProductName   string  `json:"product_name"`
		Category      string  `json:"category"`
		UnitPrice     float64 `json:"unit_price"`
		UnitOfMeasure string  `json:"unit_of_measure"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Store price in Description field as string
	priceStr := fmt.Sprintf("%.2f", requestData.UnitPrice)

	query := `INSERT INTO ProductType (Name, Description, Grade, UnitOfMeasure)
              VALUES ($1, $2, $3, $4) RETURNING ProductTypeID`

	var productTypeID int
	err := config.DB.QueryRow(query, requestData.ProductName, priceStr,
		requestData.Category, requestData.UnitOfMeasure).Scan(&productTypeID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Return with frontend field names
	response := map[string]interface{}{
		"product_type_id": productTypeID,
		"product_name":    requestData.ProductName,
		"category":        requestData.Category,
		"unit_price":      requestData.UnitPrice,
		"unit_of_measure": requestData.UnitOfMeasure,
	}

	utils.RespondJSON(w, http.StatusCreated, response)
}

func GetProductTypes(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT ProductTypeID, Name, Description, Grade, UnitOfMeasure 
                           FROM ProductType ORDER BY Name`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var productTypes []map[string]interface{}
	for rows.Next() {
		var id int
		var name, description, grade, unitOfMeasure string

		if err := rows.Scan(&id, &name, &description, &grade, &unitOfMeasure); err != nil {
			continue
		}

		// Convert Description (stored price) to float
		var unitPrice float64
		if description != "" {
			fmt.Sscanf(description, "%f", &unitPrice)
		}

		// Map database fields to frontend field names
		pt := map[string]interface{}{
			"product_type_id": id,
			"product_name":    name,
			"category":        grade,
			"unit_price":      unitPrice,
			"unit_of_measure": unitOfMeasure,
		}
		productTypes = append(productTypes, pt)
	}

	utils.RespondJSON(w, http.StatusOK, productTypes)
}

func UpdateProductType(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")

	// Receive data with frontend field names
	var requestData struct {
		ProductName   string  `json:"product_name"`
		Category      string  `json:"category"`
		UnitPrice     float64 `json:"unit_price"`
		UnitOfMeasure string  `json:"unit_of_measure"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Store price in Description field as string
	priceStr := fmt.Sprintf("%.2f", requestData.UnitPrice)

	query := `UPDATE ProductType SET Name = $2, Description = $3, Grade = $4, UnitOfMeasure = $5 
              WHERE ProductTypeID = $1`
	_, err := config.DB.Exec(query, id, requestData.ProductName, priceStr,
		requestData.Category, requestData.UnitOfMeasure)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "ProductType updated successfully")
}

func DeleteProductType(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM ProductType WHERE ProductTypeID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "ProductType deleted successfully")
}

// ==================== STOCK ITEMS ====================
func CreateStockItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	
	// Receive data with frontend field names
	var requestData struct {
		WarehouseID      int     `json:"warehouse_id"`
		ProductTypeID    int     `json:"product_type_id"`
		QuantityInStock  float64 `json:"quantity_in_stock"`
		ShelfLocation    string  `json:"shelf_location"`
		LastRestocked    string  `json:"last_restocked"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	query := `INSERT INTO StockItem (ProductTypeID, WarehouseID, BatchID, Quantity, ShelfLocation)
              VALUES ($1, $2, NULL, $3, $4) RETURNING StockID`
	
	var stockID int
	err := config.DB.QueryRow(query, requestData.ProductTypeID, requestData.WarehouseID,
		requestData.QuantityInStock, requestData.ShelfLocation).Scan(&stockID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	
	response := map[string]interface{}{
		"stock_id":          stockID,
		"warehouse_id":      requestData.WarehouseID,
		"product_type_id":   requestData.ProductTypeID,
		"quantity_in_stock": requestData.QuantityInStock,
		"shelf_location":    requestData.ShelfLocation,
		"last_restocked":    requestData.LastRestocked,
	}
	
	utils.RespondJSON(w, http.StatusCreated, response)
}

func GetStockItems(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT StockID, ProductTypeID, WarehouseID, BatchID, Quantity, ShelfLocation 
                           FROM StockItem ORDER BY StockID`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var items []map[string]interface{}
	for rows.Next() {
		var stockID, productTypeID, warehouseID int
		var batchID *int
		var quantity float64
		var shelfLocation string
		
		if err := rows.Scan(&stockID, &productTypeID, &warehouseID, &batchID, &quantity, &shelfLocation); err != nil {
			continue
		}
		
		item := map[string]interface{}{
			"stock_id":          stockID,
			"warehouse_id":      warehouseID,
			"product_type_id":   productTypeID,
			"batch_id":          batchID,
			"quantity_in_stock": quantity,
			"shelf_location":    shelfLocation,
			"last_restocked":    nil,
		}
		items = append(items, item)
	}
	
	utils.RespondJSON(w, http.StatusOK, items)
}

func UpdateStockItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	
	var requestData struct {
		WarehouseID      int     `json:"warehouse_id"`
		ProductTypeID    int     `json:"product_type_id"`
		QuantityInStock  float64 `json:"quantity_in_stock"`
		ShelfLocation    string  `json:"shelf_location"`
		LastRestocked    string  `json:"last_restocked"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	query := `UPDATE StockItem SET ProductTypeID = $2, WarehouseID = $3, BatchID = NULL,
              Quantity = $4, ShelfLocation = $5 WHERE StockID = $1`
	_, err := config.DB.Exec(query, id, requestData.ProductTypeID, requestData.WarehouseID, 
		requestData.QuantityInStock, requestData.ShelfLocation)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "StockItem updated successfully")
}

func DeleteStockItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM StockItem WHERE StockID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "StockItem deleted successfully")
}

// ==================== STOCK ALERTS ====================
func CreateStockAlert(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	
	// Receive data with frontend field names
	var requestData struct {
		StockID       int    `json:"stock_id"`
		AlertType     string `json:"alert_type"`
		TriggeredDate string `json:"triggered_date"`
		Resolved      bool   `json:"resolved"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Map resolved boolean to status string
	status := "Active"
	if requestData.Resolved {
		status = "Resolved"
	}

	query := `INSERT INTO StockAlert (StockID, WarehouseID, AlertType, Status)
              VALUES ($1, NULL, $2, $3) RETURNING AlertID`
	
	var alertID int
	err := config.DB.QueryRow(query, requestData.StockID, requestData.AlertType, status).Scan(&alertID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	
	response := map[string]interface{}{
		"alert_id":       alertID,
		"stock_id":       requestData.StockID,
		"alert_type":     requestData.AlertType,
		"triggered_date": requestData.TriggeredDate,
		"resolved":       requestData.Resolved,
	}
	
	utils.RespondJSON(w, http.StatusCreated, response)
}

func GetStockAlerts(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT AlertID, StockID, WarehouseID, AlertType, CreatedAt, Status 
                           FROM StockAlert ORDER BY CreatedAt DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	alerts := make([]map[string]interface{}, 0) // Initialize empty array
	
	for rows.Next() {
		var alertID, stockID int
		var warehouseID *int
		var alertType, createdAt, status string
		
		if err := rows.Scan(&alertID, &stockID, &warehouseID, &alertType, &createdAt, &status); err != nil {
			continue
		}
		
		// Map status string to resolved boolean
		resolved := status == "Resolved"
		
		alert := map[string]interface{}{
			"alert_id":       alertID,
			"stock_id":       stockID,
			"warehouse_id":   warehouseID,
			"alert_type":     alertType,
			"triggered_date": createdAt,
			"resolved":       resolved,
			"status":         status,
		}
		alerts = append(alerts, alert)
	}
	
	utils.RespondJSON(w, http.StatusOK, alerts)
}

func UpdateStockAlert(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	
	var requestData struct {
		StockID       int    `json:"stock_id"`
		AlertType     string `json:"alert_type"`
		TriggeredDate string `json:"triggered_date"`
		Resolved      bool   `json:"resolved"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Map resolved boolean to status string
	status := "Active"
	if requestData.Resolved {
		status = "Resolved"
	}

	query := `UPDATE StockAlert SET StockID = $2, WarehouseID = NULL, AlertType = $3, Status = $4 WHERE AlertID = $1`
	_, err := config.DB.Exec(query, id, requestData.StockID, requestData.AlertType, status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "StockAlert updated successfully")
}

func DeleteStockAlert(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM StockAlert WHERE AlertID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "StockAlert deleted successfully")
}
// ==================== INVENTORY TRANSACTIONS ====================
func CreateInventoryTransaction(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	
	// Receive data with frontend field names
	var requestData struct {
		StockID         int     `json:"stock_id"`
		TransactionType string  `json:"transaction_type"`
		Quantity        float64 `json:"quantity"`
		TransactionDate string  `json:"transaction_date"`
		ReferenceID     string  `json:"reference_id"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	query := `INSERT INTO InventoryTransaction (EmployeeID, StockID, WarehouseID, TransactionType, Quantity, Remarks)
              VALUES (NULL, $1, NULL, $2, $3, $4) RETURNING TransactionID`
	
	var transactionID int
	err := config.DB.QueryRow(query, requestData.StockID, requestData.TransactionType,
		requestData.Quantity, requestData.ReferenceID).Scan(&transactionID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	
	response := map[string]interface{}{
		"transaction_id":   transactionID,
		"stock_id":         requestData.StockID,
		"transaction_type": requestData.TransactionType,
		"quantity":         requestData.Quantity,
		"transaction_date": requestData.TransactionDate,
		"reference_id":     requestData.ReferenceID,
	}
	
	utils.RespondJSON(w, http.StatusCreated, response)
}

func GetInventoryTransactions(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT TransactionID, EmployeeID, StockID, WarehouseID, TransactionType, 
                           Quantity, TransactionDate, Remarks FROM InventoryTransaction ORDER BY TransactionDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	transactions := make([]map[string]interface{}, 0) // Initialize empty array
	
	for rows.Next() {
		var transactionID, stockID int
		var employeeID, warehouseID *int
		var transactionType, transactionDate, remarks string
		var quantity float64
		
		if err := rows.Scan(&transactionID, &employeeID, &stockID, &warehouseID,
			&transactionType, &quantity, &transactionDate, &remarks); err != nil {
			continue
		}
		
		transaction := map[string]interface{}{
			"transaction_id":   transactionID,
			"employee_id":      employeeID,
			"stock_id":         stockID,
			"warehouse_id":     warehouseID,
			"transaction_type": transactionType,
			"quantity":         quantity,
			"transaction_date": transactionDate,
			"reference_id":     remarks,
		}
		transactions = append(transactions, transaction)
	}
	
	utils.RespondJSON(w, http.StatusOK, transactions)
}

func UpdateInventoryTransaction(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	
	var requestData struct {
		StockID         int     `json:"stock_id"`
		TransactionType string  `json:"transaction_type"`
		Quantity        float64 `json:"quantity"`
		TransactionDate string  `json:"transaction_date"`
		ReferenceID     string  `json:"reference_id"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	query := `UPDATE InventoryTransaction SET EmployeeID = NULL, StockID = $2, WarehouseID = NULL,
              TransactionType = $3, Quantity = $4, Remarks = $5 WHERE TransactionID = $1`
	_, err := config.DB.Exec(query, id, requestData.StockID, requestData.TransactionType,
		requestData.Quantity, requestData.ReferenceID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "InventoryTransaction updated successfully")
}

func DeleteInventoryTransaction(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM InventoryTransaction WHERE TransactionID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "InventoryTransaction deleted successfully")
}