package config

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

const (
	Host     = "localhost"
	Port     = 5432
	User     = "postgres"
	Password = "m7mdndgamer"
	DBName   = "pern_todo"
)

func InitDB() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		Host, Port, User, Password, DBName)

	var err error
	DB, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("❌ Error opening database:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("❌ Error connecting to database:", err)
	}

	fmt.Println("✅ Database connected successfully!")
}
