package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== SAWMILLS ====================
func CreateSawmill(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var sm models.Sawmill
	json.NewDecoder(r.Body).Decode(&sm)

	query := `INSERT INTO Sawmill (Name, Location, Capacity, Status)
              VALUES ($1, $2, $3, $4) RETURNING SawmillID`
	err := config.DB.QueryRow(query, sm.Name, sm.Location, sm.Capacity, sm.Status).Scan(&sm.SawmillID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, sm)
}

func GetSawmills(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT SawmillID, Name, Location, Capacity, Status FROM Sawmill ORDER BY Name`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	sawmills := []models.Sawmill{}
	for rows.Next() {
		var s models.Sawmill
		rows.Scan(&s.SawmillID, &s.Name, &s.Location, &s.Capacity, &s.Status)
		sawmills = append(sawmills, s)
	}
	utils.RespondJSON(w, http.StatusOK, sawmills)
}

func UpdateSawmill(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var sm models.Sawmill
	json.NewDecoder(r.Body).Decode(&sm)

	query := `UPDATE Sawmill SET Name = $2, Location = $3, Capacity = $4, Status = $5 WHERE SawmillID = $1`
	_, err := config.DB.Exec(query, id, sm.Name, sm.Location, sm.Capacity, sm.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Sawmill updated successfully")
}

func DeleteSawmill(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Sawmill WHERE SawmillID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Sawmill deleted successfully")
}

// ==================== PROCESSING UNITS ====================
func CreateProcessingUnit(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var pu models.ProcessingUnit
	json.NewDecoder(r.Body).Decode(&pu)

	query := `INSERT INTO ProcessingUnit (SawmillID, Cutting, Drying, Finishing, Capacity, Status)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING UnitID`
	err := config.DB.QueryRow(query, pu.SawmillID, pu.Cutting, pu.Drying, pu.Finishing,
		pu.Capacity, pu.Status).Scan(&pu.UnitID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, pu)
}

func GetProcessingUnits(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT UnitID, SawmillID, Cutting, Drying, Finishing, Capacity, Status 
                           FROM ProcessingUnit ORDER BY UnitID`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	units := []models.ProcessingUnit{}
	for rows.Next() {
		var p models.ProcessingUnit
		rows.Scan(&p.UnitID, &p.SawmillID, &p.Cutting, &p.Drying, &p.Finishing, &p.Capacity, &p.Status)
		units = append(units, p)
	}
	utils.RespondJSON(w, http.StatusOK, units)
}

func UpdateProcessingUnit(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var pu models.ProcessingUnit
	json.NewDecoder(r.Body).Decode(&pu)

	query := `UPDATE ProcessingUnit SET SawmillID = $2, Cutting = $3, Drying = $4, Finishing = $5,
              Capacity = $6, Status = $7 WHERE UnitID = $1`
	_, err := config.DB.Exec(query, id, pu.SawmillID, pu.Cutting, pu.Drying, pu.Finishing, pu.Capacity, pu.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "ProcessingUnit updated successfully")
}

func DeleteProcessingUnit(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM ProcessingUnit WHERE UnitID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "ProcessingUnit deleted successfully")
}

// ==================== PROCESSING ORDERS ====================
func CreateProcessingOrder(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var po models.ProcessingOrder
	json.NewDecoder(r.Body).Decode(&po)

	query := `INSERT INTO ProcessingOrder (ProductTypeID, UnitID, StartDate, EndDate, OutputQuantity, EfficiencyRate)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING ProcessingID`
	err := config.DB.QueryRow(query, po.ProductTypeID, po.UnitID, po.StartDate, po.EndDate,
		po.OutputQuantity, po.EfficiencyRate).Scan(&po.ProcessingID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, po)
}

func GetProcessingOrders(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT ProcessingID, ProductTypeID, UnitID, StartDate, EndDate, 
                           OutputQuantity, EfficiencyRate FROM ProcessingOrder ORDER BY StartDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	orders := []models.ProcessingOrder{}
	for rows.Next() {
		var p models.ProcessingOrder
		rows.Scan(&p.ProcessingID, &p.ProductTypeID, &p.UnitID, &p.StartDate, &p.EndDate,
			&p.OutputQuantity, &p.EfficiencyRate)
		orders = append(orders, p)
	}
	utils.RespondJSON(w, http.StatusOK, orders)
}

func UpdateProcessingOrder(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var po models.ProcessingOrder
	json.NewDecoder(r.Body).Decode(&po)

	query := `UPDATE ProcessingOrder SET ProductTypeID = $2, UnitID = $3, StartDate = $4, EndDate = $5,
              OutputQuantity = $6, EfficiencyRate = $7 WHERE ProcessingID = $1`
	_, err := config.DB.Exec(query, id, po.ProductTypeID, po.UnitID, po.StartDate, po.EndDate,
		po.OutputQuantity, po.EfficiencyRate)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "ProcessingOrder updated successfully")
}

func DeleteProcessingOrder(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM ProcessingOrder WHERE ProcessingID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "ProcessingOrder deleted successfully")
}

// ==================== MAINTENANCE RECORDS ====================
func CreateMaintenanceRecord(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var mr models.MaintenanceRecord
	json.NewDecoder(r.Body).Decode(&mr)

	query := `INSERT INTO MaintenanceRecord (UnitID, MaintenanceDate, Description, Cost, PartsUsed, DowntimeHours)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING MaintenanceID`
	err := config.DB.QueryRow(query, mr.UnitID, mr.MaintenanceDate, mr.Description,
		mr.Cost, mr.PartsUsed, mr.DowntimeHours).Scan(&mr.MaintenanceID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, mr)
}

func GetMaintenanceRecords(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT MaintenanceID, UnitID, MaintenanceDate, Description, Cost, PartsUsed, DowntimeHours 
                           FROM MaintenanceRecord ORDER BY MaintenanceDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	records := []models.MaintenanceRecord{}
	for rows.Next() {
		var m models.MaintenanceRecord
		rows.Scan(&m.MaintenanceID, &m.UnitID, &m.MaintenanceDate, &m.Description,
			&m.Cost, &m.PartsUsed, &m.DowntimeHours)
		records = append(records, m)
	}
	utils.RespondJSON(w, http.StatusOK, records)
}

func UpdateMaintenanceRecord(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var mr models.MaintenanceRecord
	json.NewDecoder(r.Body).Decode(&mr)

	query := `UPDATE MaintenanceRecord SET UnitID = $2, MaintenanceDate = $3, Description = $4,
              Cost = $5, PartsUsed = $6, DowntimeHours = $7 WHERE MaintenanceID = $1`
	_, err := config.DB.Exec(query, id, mr.UnitID, mr.MaintenanceDate, mr.Description,
		mr.Cost, mr.PartsUsed, mr.DowntimeHours)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "MaintenanceRecord updated successfully")
}

func DeleteMaintenanceRecord(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM MaintenanceRecord WHERE MaintenanceID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "MaintenanceRecord deleted successfully")
}

// ==================== WASTE RECORDS ====================
func CreateWasteRecord(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var wr models.WasteRecord
	json.NewDecoder(r.Body).Decode(&wr)

	query := `INSERT INTO WasteRecord (ProcessingID, WasteType, Volume, DisposalMethod, Recycled)
              VALUES ($1, $2, $3, $4, $5) RETURNING WasteID`
	err := config.DB.QueryRow(query, wr.ProcessingID, wr.WasteType, wr.Volume,
		wr.DisposalMethod, wr.Recycled).Scan(&wr.WasteID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, wr)
}

func GetWasteRecords(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT WasteID, ProcessingID, WasteType, Volume, DisposalMethod, Recycled 
                           FROM WasteRecord ORDER BY WasteID`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	records := []models.WasteRecord{}
	for rows.Next() {
		var w models.WasteRecord
		rows.Scan(&w.WasteID, &w.ProcessingID, &w.WasteType, &w.Volume, &w.DisposalMethod, &w.Recycled)
		records = append(records, w)
	}
	utils.RespondJSON(w, http.StatusOK, records)
}

func UpdateWasteRecord(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var wr models.WasteRecord
	json.NewDecoder(r.Body).Decode(&wr)

	query := `UPDATE WasteRecord SET ProcessingID = $2, WasteType = $3, Volume = $4,
              DisposalMethod = $5, Recycled = $6 WHERE WasteID = $1`
	_, err := config.DB.Exec(query, id, wr.ProcessingID, wr.WasteType, wr.Volume, wr.DisposalMethod, wr.Recycled)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "WasteRecord updated successfully")
}

func DeleteWasteRecord(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM WasteRecord WHERE WasteID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "WasteRecord deleted successfully")
}