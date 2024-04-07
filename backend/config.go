package main

import (
	"sync"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/rs/zerolog/log"
)

type Config struct {
	DB struct {
		ConnString string `yaml:"connection_string" env:"YELLO_DB_CONN_STRING" env-required:"true"`
	} `yaml:"db"`
	Server struct {
		Port string `yaml:"port" env:"YELLO_SERVER_PORT" env-default:":4003"`
	} `yaml:"server"`
}

var instance *Config
var once sync.Once

func GetConfig() *Config {
	once.Do(func() {
		log.Info().Msg("reading configuration")
		instance = &Config{}
		if err := cleanenv.ReadConfig("./config/config.yaml", instance); err != nil {
			dsc, _ := cleanenv.GetDescription(instance, nil)
			log.Fatal().Str("description", dsc).Err(err).Msg("reading configuaration failed")
		}
	})
	return instance
}
