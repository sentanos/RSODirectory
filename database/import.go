package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type rso struct {
	Name string
	Description string
	Category string
	Logo string
}

func main() {
	if len(os.Args) <= 1 {
		log.Fatal("Please csv file followed by connection string")
		return
	}
	file, err := os.Open(os.Args[1])
	defer file.Close()
	if err != nil {
		log.Fatal(err)
	}

	connStr := os.Args[2]

	opts := options.Client().ApplyURI(connStr)
	client, err := mongo.Connect(context.TODO(), opts)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to database")

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	var rsos []interface{}
	for i := 1; i < len(records); i++ {
		record := records[i]
		rsos = append(rsos, rso{
			Name: record[1],
			Description: record[4],
			Category: record[6],
			Logo: record[7],
		})
	}

	collection := client.Database("rsodirectory").Collection("rsos")
	_, err = collection.InsertMany(context.TODO(), rsos)
	if err != nil {
		log.Fatal(err)
	}
}
