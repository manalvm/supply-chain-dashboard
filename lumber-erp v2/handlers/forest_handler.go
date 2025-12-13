package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== FORESTS ====================
func CreateForest(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var forest models.Forest
	json.NewDecoder(r.Body).Decode(&forest)

	query := `INSERT INTO Forest (ForestName, GeoLocation, AreaSize, OwnershipType, Status)
              VALUES ($1, $2, $3, $4, $5) RETURNING ForestID`
	err := config.DB.QueryRow(query, forest.ForestName, forest.GeoLocation, forest.AreaSize,
		forest.OwnershipType, forest.Status).Scan(&forest.ForestID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, forest)
}

func GetForests(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT ForestID, ForestName, GeoLocation, AreaSize, OwnershipType, Status 
                           FROM Forest ORDER BY ForestName`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	forests := []models.Forest{}
	for rows.Next() {
		var f models.Forest
		rows.Scan(&f.ForestID, &f.ForestName, &f.GeoLocation, &f.AreaSize, &f.OwnershipType, &f.Status)
		forests = append(forests, f)
	}
	utils.RespondJSON(w, http.StatusOK, forests)
}

func UpdateForest(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var forest models.Forest
	json.NewDecoder(r.Body).Decode(&forest)

	query := `UPDATE Forest SET ForestName = $2, GeoLocation = $3, AreaSize = $4,
              OwnershipType = $5, Status = $6 WHERE ForestID = $1`
	_, err := config.DB.Exec(query, id, forest.ForestName, forest.GeoLocation, forest.AreaSize,
		forest.OwnershipType, forest.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Forest updated successfully")
}

func DeleteForest(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Forest WHERE ForestID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Forest deleted successfully")
}

// ==================== TREE SPECIES ====================
func CreateTreeSpecies(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var ts models.TreeSpecies
	json.NewDecoder(r.Body).Decode(&ts)

	query := `INSERT INTO TreeSpecies (SpeciesName, AverageHeight, Density, MoistureContent, Grade)
              VALUES ($1, $2, $3, $4, $5) RETURNING SpeciesID`
	err := config.DB.QueryRow(query, ts.SpeciesName, ts.AverageHeight, ts.Density,
		ts.MoistureContent, ts.Grade).Scan(&ts.SpeciesID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, ts)
}

func GetTreeSpecies(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT SpeciesID, SpeciesName, AverageHeight, Density, MoistureContent, Grade 
                           FROM TreeSpecies ORDER BY SpeciesName`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	species := []models.TreeSpecies{}
	for rows.Next() {
		var t models.TreeSpecies
		rows.Scan(&t.SpeciesID, &t.SpeciesName, &t.AverageHeight, &t.Density, &t.MoistureContent, &t.Grade)
		species = append(species, t)
	}
	utils.RespondJSON(w, http.StatusOK, species)
}

func UpdateTreeSpecies(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var ts models.TreeSpecies
	json.NewDecoder(r.Body).Decode(&ts)

	query := `UPDATE TreeSpecies SET SpeciesName = $2, AverageHeight = $3, Density = $4,
              MoistureContent = $5, Grade = $6 WHERE SpeciesID = $1`
	_, err := config.DB.Exec(query, id, ts.SpeciesName, ts.AverageHeight, ts.Density, ts.MoistureContent, ts.Grade)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "TreeSpecies updated successfully")
}

func DeleteTreeSpecies(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM TreeSpecies WHERE SpeciesID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "TreeSpecies deleted successfully")
}

// ==================== HARVEST SCHEDULES ====================
func CreateHarvestSchedule(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var hs models.HarvestSchedule
	json.NewDecoder(r.Body).Decode(&hs)

	query := `INSERT INTO HarvestSchedule (ForestID, StartDate, EndDate, Status)
              VALUES ($1, $2, $3, $4) RETURNING ScheduleID`
	err := config.DB.QueryRow(query, hs.ForestID, hs.StartDate, hs.EndDate, hs.Status).Scan(&hs.ScheduleID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, hs)
}

func GetHarvestSchedules(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT ScheduleID, ForestID, StartDate, EndDate, Status 
                           FROM HarvestSchedule ORDER BY StartDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	schedules := []models.HarvestSchedule{}
	for rows.Next() {
		var h models.HarvestSchedule
		rows.Scan(&h.ScheduleID, &h.ForestID, &h.StartDate, &h.EndDate, &h.Status)
		schedules = append(schedules, h)
	}
	utils.RespondJSON(w, http.StatusOK, schedules)
}

func UpdateHarvestSchedule(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var hs models.HarvestSchedule
	json.NewDecoder(r.Body).Decode(&hs)

	query := `UPDATE HarvestSchedule SET ForestID = $2, StartDate = $3, EndDate = $4, Status = $5 
              WHERE ScheduleID = $1`
	_, err := config.DB.Exec(query, id, hs.ForestID, hs.StartDate, hs.EndDate, hs.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "HarvestSchedule updated successfully")
}

func DeleteHarvestSchedule(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM HarvestSchedule WHERE ScheduleID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "HarvestSchedule deleted successfully")
}

// ==================== HARVEST BATCHES ====================
func CreateHarvestBatch(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var hb models.HarvestBatch
	json.NewDecoder(r.Body).Decode(&hb)

	query := `INSERT INTO HarvestBatch (ForestID, SpeciesID, ScheduleID, Quantity, HarvestDate, QualityIndicator, QRCode)
              VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING BatchID`
	err := config.DB.QueryRow(query, hb.ForestID, hb.SpeciesID, hb.ScheduleID, hb.Quantity,
		hb.HarvestDate, hb.QualityIndicator, hb.QRCode).Scan(&hb.BatchID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, hb)
}

func GetHarvestBatches(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT BatchID, ForestID, SpeciesID, ScheduleID, Quantity, 
                           HarvestDate, QualityIndicator, QRCode FROM HarvestBatch ORDER BY HarvestDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	batches := []models.HarvestBatch{}
	for rows.Next() {
		var h models.HarvestBatch
		rows.Scan(&h.BatchID, &h.ForestID, &h.SpeciesID, &h.ScheduleID, &h.Quantity,
			&h.HarvestDate, &h.QualityIndicator, &h.QRCode)
		batches = append(batches, h)
	}
	utils.RespondJSON(w, http.StatusOK, batches)
}

func UpdateHarvestBatch(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var hb models.HarvestBatch
	json.NewDecoder(r.Body).Decode(&hb)

	query := `UPDATE HarvestBatch SET ForestID = $2, SpeciesID = $3, ScheduleID = $4, Quantity = $5,
              HarvestDate = $6, QualityIndicator = $7, QRCode = $8 WHERE BatchID = $1`
	_, err := config.DB.Exec(query, id, hb.ForestID, hb.SpeciesID, hb.ScheduleID, hb.Quantity,
		hb.HarvestDate, hb.QualityIndicator, hb.QRCode)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "HarvestBatch updated successfully")
}

func DeleteHarvestBatch(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM HarvestBatch WHERE BatchID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "HarvestBatch deleted successfully")
}