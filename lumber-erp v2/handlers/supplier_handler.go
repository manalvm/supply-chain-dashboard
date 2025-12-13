package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== SUPPLIERS ====================
func CreateSupplier(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var sup models.Supplier
	json.NewDecoder(r.Body).Decode(&sup)

	query := `INSERT INTO Supplier (CompanyName, ContactPerson, Email, Phone, ComplianceStatus, Raw, Semi_Processed)
              VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING SupplierID`
	err := config.DB.QueryRow(query, sup.CompanyName, sup.ContactPerson, sup.Email, sup.Phone,
		sup.ComplianceStatus, sup.Raw, sup.SemiProcessed).Scan(&sup.SupplierID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, sup)
}

func GetSuppliers(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT SupplierID, CompanyName, ContactPerson, Email, Phone, 
                           ComplianceStatus, Raw, Semi_Processed FROM Supplier ORDER BY CompanyName`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	sups := []models.Supplier{}
	for rows.Next() {
		var s models.Supplier
		rows.Scan(&s.SupplierID, &s.CompanyName, &s.ContactPerson, &s.Email, &s.Phone,
			&s.ComplianceStatus, &s.Raw, &s.SemiProcessed)
		sups = append(sups, s)
	}
	utils.RespondJSON(w, http.StatusOK, sups)
}

func UpdateSupplier(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var sup models.Supplier
	json.NewDecoder(r.Body).Decode(&sup)

	query := `UPDATE Supplier SET CompanyName = $2, ContactPerson = $3, Email = $4, Phone = $5,
              ComplianceStatus = $6, Raw = $7, Semi_Processed = $8 WHERE SupplierID = $1`
	_, err := config.DB.Exec(query, id, sup.CompanyName, sup.ContactPerson, sup.Email, sup.Phone,
		sup.ComplianceStatus, sup.Raw, sup.SemiProcessed)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Supplier updated successfully")
}

func DeleteSupplier(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Supplier WHERE SupplierID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Supplier deleted successfully")
}

// ==================== SUPPLIER PERFORMANCE ====================
func CreateSupplierPerformance(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var sp models.SupplierPerformance
	json.NewDecoder(r.Body).Decode(&sp)

	query := `INSERT INTO SupplierPerformance (SupplierID, Rating, DeliveryTimeliness, QualityScore, ReviewDate)
              VALUES ($1, $2, $3, $4, $5) RETURNING PerformanceID`
	err := config.DB.QueryRow(query, sp.SupplierID, sp.Rating, sp.DeliveryTimeliness,
		sp.QualityScore, sp.ReviewDate).Scan(&sp.PerformanceID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, sp)
}

func GetSupplierPerformances(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT PerformanceID, SupplierID, Rating, DeliveryTimeliness, QualityScore, ReviewDate 
                           FROM SupplierPerformance ORDER BY ReviewDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	performances := []models.SupplierPerformance{}
	for rows.Next() {
		var s models.SupplierPerformance
		rows.Scan(&s.PerformanceID, &s.SupplierID, &s.Rating, &s.DeliveryTimeliness, &s.QualityScore, &s.ReviewDate)
		performances = append(performances, s)
	}
	utils.RespondJSON(w, http.StatusOK, performances)
}

func UpdateSupplierPerformance(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var sp models.SupplierPerformance
	json.NewDecoder(r.Body).Decode(&sp)

	query := `UPDATE SupplierPerformance SET SupplierID = $2, Rating = $3, DeliveryTimeliness = $4,
              QualityScore = $5, ReviewDate = $6 WHERE PerformanceID = $1`
	_, err := config.DB.Exec(query, id, sp.SupplierID, sp.Rating, sp.DeliveryTimeliness, sp.QualityScore, sp.ReviewDate)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "SupplierPerformance updated successfully")
}

func DeleteSupplierPerformance(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM SupplierPerformance WHERE PerformanceID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "SupplierPerformance deleted successfully")
}

// ==================== SUPPLIER CONTRACT ====================
func CreateSupplierContract(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var sc models.SupplierContract
	json.NewDecoder(r.Body).Decode(&sc)

	query := `INSERT INTO SupplierContract (SupplierID, StartDate, EndDate, Terms, ContractValue, Status)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING ContractID`
	err := config.DB.QueryRow(query, sc.SupplierID, sc.StartDate, sc.EndDate,
		sc.Terms, sc.ContractValue, sc.Status).Scan(&sc.ContractID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, sc)
}

func GetSupplierContracts(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT ContractID, SupplierID, StartDate, EndDate, Terms, ContractValue, Status 
                           FROM SupplierContract ORDER BY StartDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	contracts := []models.SupplierContract{}
	for rows.Next() {
		var s models.SupplierContract
		rows.Scan(&s.ContractID, &s.SupplierID, &s.StartDate, &s.EndDate, &s.Terms, &s.ContractValue, &s.Status)
		contracts = append(contracts, s)
	}
	utils.RespondJSON(w, http.StatusOK, contracts)
}

func UpdateSupplierContract(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var sc models.SupplierContract
	json.NewDecoder(r.Body).Decode(&sc)

	query := `UPDATE SupplierContract SET SupplierID = $2, StartDate = $3, EndDate = $4,
              Terms = $5, ContractValue = $6, Status = $7 WHERE ContractID = $1`
	_, err := config.DB.Exec(query, id, sc.SupplierID, sc.StartDate, sc.EndDate, sc.Terms, sc.ContractValue, sc.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "SupplierContract updated successfully")
}

func DeleteSupplierContract(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM SupplierContract WHERE ContractID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "SupplierContract deleted successfully")
}