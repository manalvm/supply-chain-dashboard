package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
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
	var pt models.ProductType
	json.NewDecoder(r.Body).Decode(&pt)

	query := `INSERT INTO ProductType (Name, Description, Grade, UnitOfMeasure)
              VALUES ($1, $2, $3, $4) RETURNING ProductTypeID`
	err := config.DB.QueryRow(query, pt.Name, pt.Description, pt.Grade, pt.UnitOfMeasure).Scan(&pt.ProductTypeID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, pt)
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

	pts := []models.ProductType{}
	for rows.Next() {
		var p models.ProductType
		rows.Scan(&p.ProductTypeID, &p.Name, &p.Description, &p.Grade, &p.UnitOfMeasure)
		pts = append(pts, p)
	}
	utils.RespondJSON(w, http.StatusOK, pts)
}

func UpdateProductType(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var pt models.ProductType
	json.NewDecoder(r.Body).Decode(&pt)

	query := `UPDATE ProductType SET Name = $2, Description = $3, Grade = $4, UnitOfMeasure = $5 
              WHERE ProductTypeID = $1`
	_, err := config.DB.Exec(query, id, pt.Name, pt.Description, pt.Grade, pt.UnitOfMeasure)
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
	var si models.StockItem
	json.NewDecoder(r.Body).Decode(&si)

	query := `INSERT INTO StockItem (ProductTypeID, WarehouseID, BatchID, Quantity, ShelfLocation)
              VALUES ($1, $2, $3, $4, $5) RETURNING StockID`
	err := config.DB.QueryRow(query, si.ProductTypeID, si.WarehouseID, si.BatchID,
		si.Quantity, si.ShelfLocation).Scan(&si.StockID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, si)
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

	items := []models.StockItem{}
	for rows.Next() {
		var s models.StockItem
		rows.Scan(&s.StockID, &s.ProductTypeID, &s.WarehouseID, &s.BatchID, &s.Quantity, &s.ShelfLocation)
		items = append(items, s)
	}
	utils.RespondJSON(w, http.StatusOK, items)
}

func UpdateStockItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var si models.StockItem
	json.NewDecoder(r.Body).Decode(&si)

	query := `UPDATE StockItem SET ProductTypeID = $2, WarehouseID = $3, BatchID = $4,
              Quantity = $5, ShelfLocation = $6 WHERE StockID = $1`
	_, err := config.DB.Exec(query, id, si.ProductTypeID, si.WarehouseID, si.BatchID, si.Quantity, si.ShelfLocation)
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
	var sa models.StockAlert
	json.NewDecoder(r.Body).Decode(&sa)

	query := `INSERT INTO StockAlert (StockID, WarehouseID, AlertType, Status)
              VALUES ($1, $2, $3, $4) RETURNING AlertID`
	err := config.DB.QueryRow(query, sa.StockID, sa.WarehouseID, sa.AlertType, sa.Status).Scan(&sa.AlertID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, sa)
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

	alerts := []models.StockAlert{}
	for rows.Next() {
		var s models.StockAlert
		rows.Scan(&s.AlertID, &s.StockID, &s.WarehouseID, &s.AlertType, &s.CreatedAt, &s.Status)
		alerts = append(alerts, s)
	}
	utils.RespondJSON(w, http.StatusOK, alerts)
}

func UpdateStockAlert(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var sa models.StockAlert
	json.NewDecoder(r.Body).Decode(&sa)

	query := `UPDATE StockAlert SET StockID = $2, WarehouseID = $3, AlertType = $4, Status = $5 WHERE AlertID = $1`
	_, err := config.DB.Exec(query, id, sa.StockID, sa.WarehouseID, sa.AlertType, sa.Status)
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
	var it models.InventoryTransaction
	json.NewDecoder(r.Body).Decode(&it)

	query := `INSERT INTO InventoryTransaction (EmployeeID, StockID, WarehouseID, TransactionType, Quantity, Remarks)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING TransactionID`
	err := config.DB.QueryRow(query, it.EmployeeID, it.StockID, it.WarehouseID,
		it.TransactionType, it.Quantity, it.Remarks).Scan(&it.TransactionID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, it)
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

	transactions := []models.InventoryTransaction{}
	for rows.Next() {
		var i models.InventoryTransaction
		rows.Scan(&i.TransactionID, &i.EmployeeID, &i.StockID, &i.WarehouseID,
			&i.TransactionType, &i.Quantity, &i.TransactionDate, &i.Remarks)
		transactions = append(transactions, i)
	}
	utils.RespondJSON(w, http.StatusOK, transactions)
}

func UpdateInventoryTransaction(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var it models.InventoryTransaction
	json.NewDecoder(r.Body).Decode(&it)

	query := `UPDATE InventoryTransaction SET EmployeeID = $2, StockID = $3, WarehouseID = $4,
              TransactionType = $5, Quantity = $6, Remarks = $7 WHERE TransactionID = $1`
	_, err := config.DB.Exec(query, id, it.EmployeeID, it.StockID, it.WarehouseID,
		it.TransactionType, it.Quantity, it.Remarks)
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