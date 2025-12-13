package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== INVOICES ====================
func CreateInvoice(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var inv models.Invoice
	json.NewDecoder(r.Body).Decode(&inv)

	query := `INSERT INTO Invoice (SOID, InvoiceDate, DueDate, TotalAmount, Tax, Currency, Status)
              VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING InvoiceID`
	err := config.DB.QueryRow(query, inv.SOID, inv.InvoiceDate, inv.DueDate, inv.TotalAmount,
		inv.Tax, inv.Currency, inv.Status).Scan(&inv.InvoiceID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, inv)
}

func GetInvoices(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT InvoiceID, SOID, InvoiceDate, DueDate, TotalAmount, Tax, Currency, Status 
                           FROM Invoice ORDER BY InvoiceDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	invoices := []models.Invoice{}
	for rows.Next() {
		var i models.Invoice
		rows.Scan(&i.InvoiceID, &i.SOID, &i.InvoiceDate, &i.DueDate, &i.TotalAmount, &i.Tax, &i.Currency, &i.Status)
		invoices = append(invoices, i)
	}
	utils.RespondJSON(w, http.StatusOK, invoices)
}

func UpdateInvoice(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var inv models.Invoice
	json.NewDecoder(r.Body).Decode(&inv)

	query := `UPDATE Invoice SET SOID = $2, InvoiceDate = $3, DueDate = $4, TotalAmount = $5,
              Tax = $6, Currency = $7, Status = $8 WHERE InvoiceID = $1`
	_, err := config.DB.Exec(query, id, inv.SOID, inv.InvoiceDate, inv.DueDate, inv.TotalAmount,
		inv.Tax, inv.Currency, inv.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Invoice updated successfully")
}

func DeleteInvoice(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Invoice WHERE InvoiceID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Invoice deleted successfully")
}

// ==================== PAYMENTS ====================
func CreatePayment(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var pay models.Payment
	json.NewDecoder(r.Body).Decode(&pay)

	query := `INSERT INTO Payment (InvoiceID, PaymentDate, Amount, Method, ReferenceNo, Status)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING PaymentID`
	err := config.DB.QueryRow(query, pay.InvoiceID, pay.PaymentDate, pay.Amount,
		pay.Method, pay.ReferenceNo, pay.Status).Scan(&pay.PaymentID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, pay)
}

func GetPayments(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT PaymentID, InvoiceID, PaymentDate, Amount, Method, ReferenceNo, Status 
                           FROM Payment ORDER BY PaymentDate DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	payments := []models.Payment{}
	for rows.Next() {
		var p models.Payment
		rows.Scan(&p.PaymentID, &p.InvoiceID, &p.PaymentDate, &p.Amount, &p.Method, &p.ReferenceNo, &p.Status)
		payments = append(payments, p)
	}
	utils.RespondJSON(w, http.StatusOK, payments)
}

func UpdatePayment(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var pay models.Payment
	json.NewDecoder(r.Body).Decode(&pay)

	query := `UPDATE Payment SET InvoiceID = $2, PaymentDate = $3, Amount = $4,
              Method = $5, ReferenceNo = $6, Status = $7 WHERE PaymentID = $1`
	_, err := config.DB.Exec(query, id, pay.InvoiceID, pay.PaymentDate, pay.Amount,
		pay.Method, pay.ReferenceNo, pay.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Payment updated successfully")
}

func DeletePayment(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Payment WHERE PaymentID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Payment deleted successfully")
}