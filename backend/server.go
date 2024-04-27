package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/rs/zerolog/log"
)

type APIServer struct {
	listenAddr string
	store      Storage
}

func NewAPIServer(listenAddr string, store Storage) *APIServer {
	return &APIServer{
		listenAddr: listenAddr,
		store:      store,
	}
}

func (s *APIServer) Run() {
	router := mux.NewRouter()

	router.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]bool{"ok": true})
	})

	router.HandleFunc("/challenge", s.handleNewChhalenge).Methods(http.MethodPost)
	router.HandleFunc("/challenge/{chid}/trials/{trid}", s.handleFinishTrialOpt).Methods(http.MethodOptions)
	router.HandleFunc("/challenge/{chid}/trials/{trid}", s.handleFinishTrial).Methods(http.MethodPatch)
	router.HandleFunc("/challenge/{chid}/trials", s.handleNewTrial).Methods(http.MethodPost)
	router.HandleFunc("/challenge/{chid}/challengers", s.handleChallengers).Methods(http.MethodGet)
	router.HandleFunc("/challenge/{chid}/challengers", s.handleNewChallenger).Methods(http.MethodPost)
	router.HandleFunc("/challenge/{chid}/challengers/{chrid}", s.handleUpdateChallenger).Methods(http.MethodPatch)
	router.HandleFunc("/challenge/{chid}", s.handleChallenge).Methods(http.MethodGet)

	crs := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedMethods:   []string{"POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"},
		AllowedHeaders:   []string{"*"},
	})

	handler := crs.Handler(router)

	log.Info().Str("Port", s.listenAddr).Msg("Server is running")

	http.ListenAndServe(s.listenAddr, handler)
}

func (s *APIServer) handleNewChhalenge(w http.ResponseWriter, r *http.Request) {
	log.Info().Str("Method", r.Method).Str("URL", r.RequestURI).Msg("new challenge")
	var req_ch Challenge
	if err := json.NewDecoder(r.Body).Decode(&req_ch); err != nil {
		log.Error().Err(err).Msg("cannot parse request body")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	res, err := s.store.PostChallenge(&req_ch)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func (s *APIServer) handleFinishTrialOpt(w http.ResponseWriter, r *http.Request) {
	log.Info().Str("Method", r.Method).Str("URL", r.RequestURI).Msg("Trial finished - options")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
	w.WriteHeader(http.StatusOK)
}

func (s *APIServer) handleFinishTrial(w http.ResponseWriter, r *http.Request) {
	log.Info().Str("Method", r.Method).Str("URL", r.RequestURI).Msg("trial finished")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
	chid, err := strconv.Atoi(mux.Vars(r)["chid"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var req_tr TrialDTO
	if err := json.NewDecoder(r.Body).Decode(&req_tr); err != nil {
		log.Error().Err(err).Msg("Cannot parse request body")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	res, err := s.store.PatchTrialResult(chid, mux.Vars(r)["trid"], req_tr.Winner, req_tr.Loser)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func (s *APIServer) handleNewTrial(w http.ResponseWriter, r *http.Request) {
	log.Info().Str("Method", r.Method).Str("URL", r.RequestURI).Msg("New trial requested")
	chid, err := strconv.Atoi(mux.Vars(r)["chid"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	trial, err := s.store.PostNewTrial(chid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(trial)
}

func (s *APIServer) handleChallengers(w http.ResponseWriter, r *http.Request) {
	log.Info().Str("Method", r.Method).Str("URL", r.RequestURI).Msg("Challengers list requested")
	chid, err := strconv.Atoi(mux.Vars(r)["chid"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	challengers, err := s.store.GetChallengersList(chid)
	if err != nil {
		log.Error().Err(err).Msg("failed to build the list")
		w.WriteHeader(http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(challengers)
}

func (s *APIServer) handleNewChallenger(w http.ResponseWriter, r *http.Request) {
	log.Info().Str("Method", r.Method).Str("URL", r.RequestURI).Msg("new challenger posted")
	chid, err := strconv.Atoi(mux.Vars(r)["chid"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var req_chr Challenger
	if err := json.NewDecoder(r.Body).Decode(&req_chr); err != nil {
		log.Error().Err(err).Msg("cannot parse request body")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	res, err := s.store.PostChallenger(chid, &req_chr)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func (s *APIServer) handleUpdateChallenger(w http.ResponseWriter, r *http.Request) {
	log.Info().Str("Method", r.Method).Str("URL", r.RequestURI).Msg("challenger updated")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
	chid, err := strconv.Atoi(mux.Vars(r)["chid"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var req_chr Challenger
	if err := json.NewDecoder(r.Body).Decode(&req_chr); err != nil {
		log.Error().Err(err).Msg("cannot parse request body")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	req_chr.ID = mux.Vars(r)["chrid"]
	res, err := s.store.PatchChallenger(chid, &req_chr)
	if err != nil {
		log.Error().Err(err).Msg("cannot upadate challenger")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func (s *APIServer) handleChallenge(w http.ResponseWriter, r *http.Request) {
	log.Info().Str("Method", r.Method).Str("URL", r.RequestURI).Msg("Challenge requested")
	chid, err := strconv.Atoi(mux.Vars(r)["chid"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	challenge, err := s.store.GetChallenge(chid)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(challenge)
}
