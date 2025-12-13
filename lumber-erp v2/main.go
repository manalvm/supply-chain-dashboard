package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"lumber-erp-api/config"
	"lumber-erp-api/routes"
)

func main() {
	// Initialize database
	config.InitDB()
	defer config.DB.Close()

	// Setup all routes
	routes.SetupRoutes()

	// Server configuration
	port := ":3000"
	
	// Print startup banner
	printStartupBanner(port)
	
	// Start server
	fmt.Println("\n🎯 Server is ready to accept connections!")
	log.Fatal(http.ListenAndServe(port, nil))
}

func printStartupBanner(port string) {
	fmt.Println("\n" + strings.Repeat("=", 70))
	fmt.Println("🌲 LUMBER ERP API - COMPLETE SYSTEM v2.0")
	fmt.Println(strings.Repeat("=", 70))
	fmt.Printf("🚀 Server: http://localhost%s\n", port)
	fmt.Println(strings.Repeat("=", 70))
	
	fmt.Println("\n📋 API ENDPOINTS BY CATEGORY:")
	fmt.Println(strings.Repeat("-", 70))
	
	endpoints := []struct {
		category string
		routes   []string
	}{
		{"👥 USER MANAGEMENT", []string{
			"GET/POST    /api/users",
			"GET/PUT/DEL /api/user?id={id}",
			"GET/POST    /api/permissions",
			"PUT/DEL     /api/permission?id={id}",
			"GET/POST    /api/roles",
			"PUT/DEL     /api/role?id={id}",
		}},
		{"👷 HR & EMPLOYEES", []string{
			"GET/POST    /api/employees",
			"PUT/DEL     /api/employee?id={id}",
			"GET/POST    /api/workerassignments",
			"PUT/DEL     /api/workerassignment?id={id}",
			"GET/POST    /api/managementinsights",
			"PUT/DEL     /api/managementinsight?id={id}",
		}},
		{"🏭 SUPPLIERS", []string{
			"GET/POST    /api/suppliers",
			"PUT/DEL     /api/supplier?id={id}",
			"GET/POST    /api/supplierperformances",
			"PUT/DEL     /api/supplierperformance?id={id}",
			"GET/POST    /api/suppliercontracts",
			"PUT/DEL     /api/suppliercontract?id={id}",
		}},
		{"🌲 FOREST & HARVESTING", []string{
			"GET/POST    /api/forests",
			"PUT/DEL     /api/forest?id={id}",
			"GET/POST    /api/treespecies",
			"PUT/DEL     /api/treespecies-item?id={id}",
			"GET/POST    /api/harvestschedules",
			"PUT/DEL     /api/harvestschedule?id={id}",
			"GET/POST    /api/harvestbatches",
			"PUT/DEL     /api/harvestbatch?id={id}",
		}},
		{"🏗️ PROCESSING & SAWMILL", []string{
			"GET/POST    /api/sawmills",
			"PUT/DEL     /api/sawmill?id={id}",
			"GET/POST    /api/processingunits",
			"PUT/DEL     /api/processingunit?id={id}",
			"GET/POST    /api/processingorders",
			"PUT/DEL     /api/processingorder?id={id}",
			"GET/POST    /api/maintenancerecords",
			"PUT/DEL     /api/maintenancerecord?id={id}",
			"GET/POST    /api/wasterecords",
			"PUT/DEL     /api/wasterecord?id={id}",
		}},
		{"✅ QUALITY CONTROL", []string{
			"GET/POST    /api/qualityinspections",
			"PUT/DEL     /api/qualityinspection?id={id}",
		}},
		{"📦 WAREHOUSE & INVENTORY", []string{
			"GET/POST    /api/warehouses",
			"PUT/DEL     /api/warehouse?id={id}",
			"GET/POST    /api/producttypes",
			"PUT/DEL     /api/producttype?id={id}",
			"GET/POST    /api/stockitems",
			"PUT/DEL     /api/stockitem?id={id}",
			"GET/POST    /api/stockalerts",
			"PUT/DEL     /api/stockalert?id={id}",
			"GET/POST    /api/inventorytransactions",
			"PUT/DEL     /api/inventorytransaction?id={id}",
		}},
		{"🛒 PROCUREMENT", []string{
			"GET/POST    /api/purchaseorders",
			"PUT/DEL     /api/purchaseorder?id={id}",
			"GET/POST    /api/purchaseorderitems",
			"PUT/DEL     /api/purchaseorderitem?id={id}",
		}},
		{"🛍️ SALES & CUSTOMERS", []string{
			"GET/POST    /api/customers",
			"PUT/DEL     /api/customer?id={id}",
			"GET/POST    /api/salesorders",
			"PUT/DEL     /api/salesorder?id={id}",
			"GET/POST    /api/salesorderitems",
			"PUT/DEL     /api/salesorderitem?id={id}",
		}},
		{"💰 INVOICING & PAYMENTS", []string{
			"GET/POST    /api/invoices",
			"PUT/DEL     /api/invoice?id={id}",
			"GET/POST    /api/payments",
			"PUT/DEL     /api/payment?id={id}",
		}},
		{"🚚 TRANSPORTATION", []string{
			"GET/POST    /api/transportcompanies",
			"PUT/DEL     /api/transportcompany?id={id}",
			"GET/POST    /api/trucks",
			"PUT/DEL     /api/truck?id={id}",
			"GET/POST    /api/drivers",
			"PUT/DEL     /api/driver?id={id}",
			"GET/POST    /api/routes",
			"PUT/DEL     /api/route?id={id}",
			"GET/POST    /api/shipments",
			"PUT/DEL     /api/shipment?id={id}",
			"GET/POST    /api/fuellogs",
			"PUT/DEL     /api/fuellog?id={id}",
		}},
		{"📊 AUDIT & LOGS", []string{
			"GET/POST    /api/auditlogs",
		}},
	}

	for _, group := range endpoints {
		fmt.Printf("\n%s\n", group.category)
		for _, route := range group.routes {
			fmt.Printf("  %s\n", route)
		}
	}

	fmt.Println("\n" + strings.Repeat("=", 70))
	fmt.Println("💡 USAGE EXAMPLES:")
	fmt.Println("  curl http://localhost:3000/api/users")
	fmt.Println("  curl -X POST http://localhost:3000/api/users -d '{...}'")
	fmt.Println("  curl -X PUT http://localhost:3000/api/user?id=1 -d '{...}'")
	fmt.Println("  curl -X DELETE http://localhost:3000/api/user?id=1")
	fmt.Println(strings.Repeat("=", 70))
}