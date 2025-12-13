package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== EMPLOYEES ====================
func CreateEmployee(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var emp models.Employee
	json.NewDecoder(r.Body).Decode(&emp)

	query := `INSERT INTO Employee (FullName, Department, Position, HireDate, PerformanceRating)
              VALUES ($1, $2, $3, $4, $5) RETURNING EmployeeID`
	err := config.DB.QueryRow(query, emp.FullName, emp.Department, emp.Position,
		emp.HireDate, emp.PerformanceRating).Scan(&emp.EmployeeID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, emp)
}

func GetEmployees(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT EmployeeID, FullName, Department, Position, 
                           HireDate, PerformanceRating FROM Employee ORDER BY FullName`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	emps := []models.Employee{}
	for rows.Next() {
		var e models.Employee
		rows.Scan(&e.EmployeeID, &e.FullName, &e.Department, &e.Position, &e.HireDate, &e.PerformanceRating)
		emps = append(emps, e)
	}
	utils.RespondJSON(w, http.StatusOK, emps)
}

func UpdateEmployee(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var emp models.Employee
	json.NewDecoder(r.Body).Decode(&emp)

	query := `UPDATE Employee SET FullName = $2, Department = $3, Position = $4,
              HireDate = $5, PerformanceRating = $6 WHERE EmployeeID = $1`
	_, err := config.DB.Exec(query, id, emp.FullName, emp.Department, emp.Position, emp.HireDate, emp.PerformanceRating)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Employee updated successfully")
}

func DeleteEmployee(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Employee WHERE EmployeeID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Employee deleted successfully")
}

// ==================== WORKER ASSIGNMENTS ====================
func CreateWorkerAssignment(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var wa models.WorkerAssignment
	json.NewDecoder(r.Body).Decode(&wa)

	query := `INSERT INTO WorkerAssignment (EmployeeID, ProcessingID, RoleInTask, Notes)
              VALUES ($1, $2, $3, $4) RETURNING AssignmentID`
	err := config.DB.QueryRow(query, wa.EmployeeID, wa.ProcessingID, wa.RoleInTask, wa.Notes).Scan(&wa.AssignmentID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, wa)
}

func GetWorkerAssignments(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT AssignmentID, EmployeeID, ProcessingID, RoleInTask, Notes 
                           FROM WorkerAssignment ORDER BY AssignmentID`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	assignments := []models.WorkerAssignment{}
	for rows.Next() {
		var w models.WorkerAssignment
		rows.Scan(&w.AssignmentID, &w.EmployeeID, &w.ProcessingID, &w.RoleInTask, &w.Notes)
		assignments = append(assignments, w)
	}
	utils.RespondJSON(w, http.StatusOK, assignments)
}

func UpdateWorkerAssignment(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var wa models.WorkerAssignment
	json.NewDecoder(r.Body).Decode(&wa)

	query := `UPDATE WorkerAssignment SET EmployeeID = $2, ProcessingID = $3, RoleInTask = $4, Notes = $5 
              WHERE AssignmentID = $1`
	_, err := config.DB.Exec(query, id, wa.EmployeeID, wa.ProcessingID, wa.RoleInTask, wa.Notes)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "WorkerAssignment updated successfully")
}

func DeleteWorkerAssignment(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM WorkerAssignment WHERE AssignmentID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "WorkerAssignment deleted successfully")
}

// ==================== MANAGEMENT INSIGHTS ====================
func CreateManagementInsights(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var mi models.ManagementInsights
	json.NewDecoder(r.Body).Decode(&mi)

	query := `INSERT INTO Management_Insights (EmployeeID, KPI_Type, Time_Period)
              VALUES ($1, $2, $3) RETURNING Report_ID`
	err := config.DB.QueryRow(query, mi.EmployeeID, mi.KPIType, mi.TimePeriod).Scan(&mi.ReportID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, mi)
}

func GetManagementInsights(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT Report_ID, EmployeeID, KPI_Type, Time_Period 
                           FROM Management_Insights ORDER BY Report_ID DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	insights := []models.ManagementInsights{}
	for rows.Next() {
		var m models.ManagementInsights
		rows.Scan(&m.ReportID, &m.EmployeeID, &m.KPIType, &m.TimePeriod)
		insights = append(insights, m)
	}
	utils.RespondJSON(w, http.StatusOK, insights)
}

func UpdateManagementInsights(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var mi models.ManagementInsights
	json.NewDecoder(r.Body).Decode(&mi)

	query := `UPDATE Management_Insights SET EmployeeID = $2, KPI_Type = $3, Time_Period = $4 
              WHERE Report_ID = $1`
	_, err := config.DB.Exec(query, id, mi.EmployeeID, mi.KPIType, mi.TimePeriod)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "ManagementInsights updated successfully")
}

func DeleteManagementInsights(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Management_Insights WHERE Report_ID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "ManagementInsights deleted successfully")
}