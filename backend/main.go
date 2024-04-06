package main

import (
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Info().Msg("Application started")
	config := GetConfig()
	dbstore := NewPostgressStorage(config.DB.ConnString)
	defer dbstore.dbpool.Close()
	server := NewAPIServer(config.Server.Port, dbstore)
	server.Run()

}
