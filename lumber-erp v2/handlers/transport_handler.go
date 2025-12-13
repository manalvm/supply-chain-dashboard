package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== TRANSPORT COMPANIES ====================
func CreateTransportCompany(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var tc models.TransportCompany
	json.NewDecoder(r.Body).Decode(&tc)

	query := `INSERT INTO TransportCompany (CompanyName, ContactInfo, LicenseNumber, Rating)
              VALUES ($1, $2, $3, $4) RETURNING CompanyID`
	err := config.DB.QueryRow(query, tc.CompanyName, tc.ContactInfo, tc.LicenseNumber, tc.Rating).Scan(&tc.CompanyID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, tc)
}

func GetTransportCompanies(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT CompanyID, CompanyName, ContactInfo, LicenseNumber, Rating 
                           FROM TransportCompany ORDER BY CompanyName`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	companies := []models.TransportCompany{}
	for rows.Next() {
		var t models.TransportCompany
		rows.Scan(&t.CompanyID, &t.CompanyName, &t.ContactInfo, &t.LicenseNumber, &t.Rating)
		companies = append(companies, t)
	}
	utils.RespondJSON(w, http.StatusOK, companies)
}

func UpdateTransportCompany(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var tc models.TransportCompany
	json.NewDecoder(r.Body).Decode(&tc)

	query := `UPDATE TransportCompany SET CompanyName = $2, ContactInfo = $3, LicenseNumber = $4, Rating = $5 
              WHERE CompanyID = $1`
	_, err := config.DB.Exec(query, id, tc.CompanyName, tc.ContactInfo, tc.LicenseNumber, tc.Rating)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "TransportCompany updated successfully")
}

func DeleteTransportCompany(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM TransportCompany WHERE CompanyID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "TransportCompany deleted successfully")
}

// ==================== TRUCKS ====================
func CreateTruck(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var truck models.Truck
	json.NewDecoder(r.Body).Decode(&truck)

	query := `INSERT INTO Truck (CompanyID, PlateNumber, Capacity, FuelType, Status)
              VALUES ($1, $2, $3, $4, $5) RETURNING TruckID`
	err := config.DB.QueryRow(query, truck.CompanyID, truck.PlateNumber, truck.Capacity,
		truck.FuelType, truck.Status).Scan(&truck.TruckID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, truck)
}

func GetTrucks(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT TruckID, CompanyID, PlateNumber, Capacity, FuelType, Status 
                           FROM Truck ORDER BY PlateNumber`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	trucks := []models.Truck{}
	for rows.Next() {
		var t models.Truck
		rows.Scan(&t.TruckID, &t.CompanyID, &t.PlateNumber, &t.Capacity, &t.FuelType, &t.Status)
		trucks = append(trucks, t)
	}
	utils.RespondJSON(w, http.StatusOK, trucks)
}

func UpdateTruck(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var truck models.Truck
	json.NewDecoder(r.Body).Decode(&truck)

	query := `UPDATE Truck SET CompanyID = $2, PlateNumber = $3, Capacity = $4,
              FuelType = $5, Status = $6 WHERE TruckID = $1`
	_, err := config.DB.Exec(query, id, truck.CompanyID, truck.PlateNumber, truck.Capacity, truck.FuelType, truck.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Truck updated successfully")
}

func DeleteTruck(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Truck WHERE TruckID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Truck deleted successfully")
}

// ==================== DRIVERS ====================
func CreateDriver(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var driver models.Driver
	json.NewDecoder(r.Body).Decode(&driver)

	query := `INSERT INTO Driver (EmployeeID, LicenseNumber, ExperienceYears, Status)
              VALUES ($1, $2, $3, $4) RETURNING DriverID`
	err := config.DB.QueryRow(query, driver.EmployeeID, driver.LicenseNumber,
		driver.ExperienceYears, driver.Status).Scan(&driver.DriverID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, driver)
}

func GetDrivers(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT DriverID, EmployeeID, LicenseNumber, ExperienceYears, Status 
                           FROM Driver ORDER BY DriverID`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	drivers := []models.Driver{}
	for rows.Next() {
		var d models.Driver
		rows.Scan(&d.DriverID, &d.EmployeeID, &d.LicenseNumber, &d.ExperienceYears, &d.Status)
		drivers = append(drivers, d)
	}
	utils.RespondJSON(w, http.StatusOK, drivers)
}

func UpdateDriver(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var driver models.Driver
	json.NewDecoder(r.Body).Decode(&driver)

	query := `UPDATE Driver SET EmployeeID = $2, LicenseNumber = $3, ExperienceYears = $4, Status = $5 
              WHERE DriverID = $1`
	_, err := config.DB.Exec(query, id, driver.EmployeeID, driver.LicenseNumber, driver.ExperienceYears, driver.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Driver updated successfully")
}

func DeleteDriver(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Driver WHERE DriverID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Driver deleted successfully")
}

// ==================== ROUTES ====================
func CreateRoute(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var route models.Route
	json.NewDecoder(r.Body).Decode(&route)

	query := `INSERT INTO Route (StartLocation, EndLocation, DistanceKM, EstimatedTime)
              VALUES ($1, $2, $3, $4) RETURNING RouteID`
	err := config.DB.QueryRow(query, route.StartLocation, route.EndLocation,
		route.DistanceKM, route.EstimatedTime).Scan(&route.RouteID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, route)
}

func GetRoutes(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT RouteID, StartLocation, EndLocation, DistanceKM, EstimatedTime 
                           FROM Route ORDER BY RouteID`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	routes := []models.Route{}
	for rows.Next() {
		var r models.Route
		rows.Scan(&r.RouteID, &r.StartLocation, &r.EndLocation, &r.DistanceKM, &r.EstimatedTime)
		routes = append(routes, r)
	}
	utils.RespondJSON(w, http.StatusOK, routes)
}

func UpdateRoute(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var route models.Route
	json.NewDecoder(r.Body).Decode(&route)

	query := `UPDATE Route SET StartLocation = $2, EndLocation = $3, DistanceKM = $4, EstimatedTime = $5 
              WHERE RouteID = $1`
	_, err := config.DB.Exec(query, id, route.StartLocation, route.EndLocation, route.DistanceKM, route.EstimatedTime)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Route updated successfully")
}

func DeleteRoute(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Route WHERE RouteID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Route deleted successfully")
}

// ==================== SHIPMENTS ====================
func CreateShipment(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var ship models.Shipment
	json.NewDecoder(r.Body).Decode(&ship)

	query := `INSERT INTO Shipment (SOID, TruckID, DriverID, CompanyID, RouteID, ShipmentDate, Status, ProofOfDelivery)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ShipmentID`
	err := config.DB.QueryRow(query, ship.SOID, ship.TruckID, ship.DriverID, ship.CompanyID,
		ship.RouteID, ship.ShipmentDate, ship.Status, ship.ProofOfDelivery).Scan(&ship.ShipmentID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, ship)
}

func GetShipments(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT ShipmentID, SOID, TruckID, DriverID, CompanyID, RouteID, 
                           ShipmentDate, Status, ProofOfDelivery FROM Shipment ORDER BY ShipmentDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	shipments := []models.Shipment{}
	for rows.Next() {
		var s models.Shipment
		rows.Scan(&s.ShipmentID, &s.SOID, &s.TruckID, &s.DriverID, &s.CompanyID,
			&s.RouteID, &s.ShipmentDate, &s.Status, &s.ProofOfDelivery)
		shipments = append(shipments, s)
	}
	utils.RespondJSON(w, http.StatusOK, shipments)
}

func UpdateShipment(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var ship models.Shipment
	json.NewDecoder(r.Body).Decode(&ship)

	query := `UPDATE Shipment SET SOID = $2, TruckID = $3, DriverID = $4, CompanyID = $5,
              RouteID = $6, ShipmentDate = $7, Status = $8, ProofOfDelivery = $9 WHERE ShipmentID = $1`
	_, err := config.DB.Exec(query, id, ship.SOID, ship.TruckID, ship.DriverID, ship.CompanyID,
		ship.RouteID, ship.ShipmentDate, ship.Status, ship.ProofOfDelivery)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Shipment updated successfully")
}

func DeleteShipment(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Shipment WHERE ShipmentID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Shipment deleted successfully")
}

// ==================== FUEL LOGS ====================
func CreateFuelLog(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var fl models.FuelLog
	json.NewDecoder(r.Body).Decode(&fl)

	query := `INSERT INTO FuelLog (DriverID, TruckID, TripDate, DistanceTraveled)
              VALUES ($1, $2, $3, $4) RETURNING FuelLogID`
	err := config.DB.QueryRow(query, fl.DriverID, fl.TruckID, fl.TripDate, fl.DistanceTraveled).Scan(&fl.FuelLogID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, fl)
}

func GetFuelLogs(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT FuelLogID, DriverID, TruckID, TripDate, DistanceTraveled 
                           FROM FuelLog ORDER BY TripDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	logs := []models.FuelLog{}
	for rows.Next() {
		var f models.FuelLog
		rows.Scan(&f.FuelLogID, &f.DriverID, &f.TruckID, &f.TripDate, &f.DistanceTraveled)
		logs = append(logs, f)
	}
	utils.RespondJSON(w, http.StatusOK, logs)
}

func UpdateFuelLog(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var fl models.FuelLog
	json.NewDecoder(r.Body).Decode(&fl)

	query := `UPDATE FuelLog SET DriverID = $2, TruckID = $3, TripDate = $4, DistanceTraveled = $5 
              WHERE FuelLogID = $1`
	_, err := config.DB.Exec(query, id, fl.DriverID, fl.TruckID, fl.TripDate, fl.DistanceTraveled)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "FuelLog updated successfully")
}

func DeleteFuelLog(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM FuelLog WHERE FuelLogID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "FuelLog deleted successfully")
}