package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== QUALITY INSPECTIONS ====================
func CreateQualityInspection(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var qi models.QualityInspection
	if err := json.NewDecoder(r.Body).Decode(&qi); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	query := `INSERT INTO QualityInspection (EmployeeID, ProcessingID, POItemID, BatchID, Result, MoistureLevel, CertificationID, Date)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING InspectionID`
	err := config.DB.QueryRow(query, qi.EmployeeID, qi.ProcessingID, qi.POItemID, qi.BatchID,
		qi.Result, qi.MoistureLevel, qi.CertificationID, qi.Date).Scan(&qi.InspectionID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, qi)
}

func GetQualityInspections(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT InspectionID, EmployeeID, ProcessingID, POItemID, BatchID, 
                           Result, MoistureLevel, CertificationID, Date 
                           FROM QualityInspection ORDER BY Date DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	inspections := []models.QualityInspection{}
	for rows.Next() {
		var q models.QualityInspection
		if err := rows.Scan(&q.InspectionID, &q.EmployeeID, &q.ProcessingID, &q.POItemID, &q.BatchID,
			&q.Result, &q.MoistureLevel, &q.CertificationID, &q.Date); err != nil {
			continue
		}
		inspections = append(inspections, q)
	}
	utils.RespondJSON(w, http.StatusOK, inspections)
}

func UpdateQualityInspection(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var qi models.QualityInspection
	if err := json.NewDecoder(r.Body).Decode(&qi); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	query := `UPDATE QualityInspection SET EmployeeID = $2, ProcessingID = $3, POItemID = $4, BatchID = $5,
              Result = $6, MoistureLevel = $7, CertificationID = $8, Date = $9 WHERE InspectionID = $1`
	_, err := config.DB.Exec(query, id, qi.EmployeeID, qi.ProcessingID, qi.POItemID, qi.BatchID,
		qi.Result, qi.MoistureLevel, qi.CertificationID, qi.Date)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "QualityInspection updated successfully")
}

func DeleteQualityInspection(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM QualityInspection WHERE InspectionID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "QualityInspection deleted successfully")
}