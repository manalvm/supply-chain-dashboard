package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== PURCHASE ORDERS ====================
func CreatePurchaseOrder(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var po models.PurchaseOrder
	json.NewDecoder(r.Body).Decode(&po)

	query := `INSERT INTO PurchaseOrder (EmployeeID, SupplierID, OrderDate, ExpectedDeliveryDate, Status, TotalAmount)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING POID`
	err := config.DB.QueryRow(query, po.EmployeeID, po.SupplierID, po.OrderDate,
		po.ExpectedDeliveryDate, po.Status, po.TotalAmount).Scan(&po.POID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, po)
}

func GetPurchaseOrders(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT POID, EmployeeID, SupplierID, OrderDate, ExpectedDeliveryDate, Status, TotalAmount 
                           FROM PurchaseOrder ORDER BY OrderDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	orders := []models.PurchaseOrder{}
	for rows.Next() {
		var p models.PurchaseOrder
		rows.Scan(&p.POID, &p.EmployeeID, &p.SupplierID, &p.OrderDate,
			&p.ExpectedDeliveryDate, &p.Status, &p.TotalAmount)
		orders = append(orders, p)
	}
	utils.RespondJSON(w, http.StatusOK, orders)
}

func UpdatePurchaseOrder(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var po models.PurchaseOrder
	json.NewDecoder(r.Body).Decode(&po)

	query := `UPDATE PurchaseOrder SET EmployeeID = $2, SupplierID = $3, OrderDate = $4,
              ExpectedDeliveryDate = $5, Status = $6, TotalAmount = $7 WHERE POID = $1`
	_, err := config.DB.Exec(query, id, po.EmployeeID, po.SupplierID, po.OrderDate,
		po.ExpectedDeliveryDate, po.Status, po.TotalAmount)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "PurchaseOrder updated successfully")
}

func DeletePurchaseOrder(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM PurchaseOrder WHERE POID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "PurchaseOrder deleted successfully")
}

// ==================== PURCHASE ORDER ITEMS ====================
func CreatePurchaseOrderItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var poi models.PurchaseOrderItem
	json.NewDecoder(r.Body).Decode(&poi)

	query := `INSERT INTO PurchaseOrderItem (POID, ProductTypeID, Quantity, UnitPrice, Subtotal)
              VALUES ($1, $2, $3, $4, $5) RETURNING POItemID`
	err := config.DB.QueryRow(query, poi.POID, poi.ProductTypeID, poi.Quantity,
		poi.UnitPrice, poi.Subtotal).Scan(&poi.POItemID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, poi)
}

func GetPurchaseOrderItems(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT POItemID, POID, ProductTypeID, Quantity, UnitPrice, Subtotal 
                           FROM PurchaseOrderItem ORDER BY POItemID`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	items := []models.PurchaseOrderItem{}
	for rows.Next() {
		var p models.PurchaseOrderItem
		rows.Scan(&p.POItemID, &p.POID, &p.ProductTypeID, &p.Quantity, &p.UnitPrice, &p.Subtotal)
		items = append(items, p)
	}
	utils.RespondJSON(w, http.StatusOK, items)
}

func UpdatePurchaseOrderItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var poi models.PurchaseOrderItem
	json.NewDecoder(r.Body).Decode(&poi)

	query := `UPDATE PurchaseOrderItem SET POID = $2, ProductTypeID = $3, Quantity = $4,
              UnitPrice = $5, Subtotal = $6 WHERE POItemID = $1`
	_, err := config.DB.Exec(query, id, poi.POID, poi.ProductTypeID, poi.Quantity, poi.UnitPrice, poi.Subtotal)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "PurchaseOrderItem updated successfully")
}

func DeletePurchaseOrderItem(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM PurchaseOrderItem WHERE POItemID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "PurchaseOrderItem deleted successfully")
}