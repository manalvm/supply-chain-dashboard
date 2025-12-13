package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== AUDIT LOGS ====================
func CreateAuditLog(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var al models.AuditLog
	json.NewDecoder(r.Body).Decode(&al)

	query := `INSERT INTO AuditLog (User_ID, ActionType, EntityAffected, Description, IPAddress)
              VALUES ($1, $2, $3, $4, $5) RETURNING LogID`
	err := config.DB.QueryRow(query, al.UserID, al.ActionType, al.EntityAffected,
		al.Description, al.IPAddress).Scan(&al.LogID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, al)
}

func GetAuditLogs(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT LogID, User_ID, ActionType, EntityAffected, Timestamp, Description, IPAddress 
                           FROM AuditLog ORDER BY Timestamp DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	logs := []models.AuditLog{}
	for rows.Next() {
		var a models.AuditLog
		rows.Scan(&a.LogID, &a.UserID, &a.ActionType, &a.EntityAffected, &a.Timestamp, &a.Description, &a.IPAddress)
		logs = append(logs, a)
	}
	utils.RespondJSON(w, http.StatusOK, logs)
}