package main

import (
	"context"
	"errors"
	"math"
	"math/rand/v2"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"
)

type Storage interface {
	GetChallenge(int) (*Challenge, error)
	PostChallenge(*Challenge) (*Challenge, error)
	GetChallengersList(int) ([]*Challenger, error)
	PostChallenger(int, *Challenger) (*Challenger, error)
	PostNewTrial(int) (*Trial, error)
	PatchTrialResult(int, string, string, string) error
}

type PostgresStorage struct {
	dbpool *pgxpool.Pool
}

func NewPostgressStorage(connSting string) *PostgresStorage {
	dbpool, err := pgxpool.New(context.Background(), connSting)
	if err != nil {
		log.Fatal().Err(err).Msg("DB connection failed")
	}
	if err = dbpool.Ping(context.Background()); err != nil {
		log.Fatal().Err(err).Msg("DB connection failed")
	}
	log.Info().Msg("DB connection established")

	pgs := PostgresStorage{
		dbpool: dbpool,
	}
	pgs.Init()
	return &pgs
}

func (pgs *PostgresStorage) Init() {
	_, err := pgs.dbpool.Exec(context.Background(), `CREATE EXTENSION IF NOT EXISTS pgcrypto;
	CREATE TABLE IF NOT EXISTS public.challengers ( 
	  id UUID NOT NULL DEFAULT gen_random_uuid() ,
	  title VARCHAR(512) NOT NULL,
	  link VARCHAR(512) NULL,
	  description VARCHAR(2048) NULL,
	  rating NUMERIC NOT NULL DEFAULT 1000 ,
	  trials INTEGER NOT NULL DEFAULT 0 ,
	  ref_challenge_id INTEGER NOT NULL,
	  CONSTRAINT challengers_pkey PRIMARY KEY (id)
	);
	CREATE TABLE IF NOT EXISTS public.challenges ( 
	  id SERIAL,
	  title VARCHAR(250) NOT NULL,
	  description VARCHAR(2048) NULL,
	  CONSTRAINT challenges_pkey PRIMARY KEY (id)
	);
	CREATE TABLE IF NOT EXISTS public.trials ( 
	  id UUID NOT NULL DEFAULT gen_random_uuid() ,
	  ref_challenger1 UUID NOT NULL,
	  ref_challenger2 UUID NOT NULL,
	  ref_winner UUID NULL,
	  ref_loser UUID NULL,
	  ref_challenge_id INTEGER NOT NULL,
	  delta NUMERIC NULL DEFAULT 0 ,
	  CONSTRAINT trials_pkey PRIMARY KEY (id)
	);
	`)
	if err != nil {
		log.Error().Err(err).Msg("db init failed")
	}
}

func (pgs *PostgresStorage) PostChallenge(postCh *Challenge) (*Challenge, error) {
	log.Info().Msg("querry new challenge")

	res, err := pgs.dbpool.Query(context.Background(), "INSERT INTO challenges (title, description) VALUES ($1, $2) RETURNING id, title, description", postCh.Title, postCh.Description)
	if err != nil {
		log.Error().Err(err).Msg("querry failed")
		return nil, err
	}
	return pgx.CollectOneRow(res, pgx.RowToAddrOfStructByName[Challenge])
}

func (pgs *PostgresStorage) GetChallenge(chid int) (*Challenge, error) {
	log.Info().Int("challenge-id", chid).Msg("Querry challenge by id")
	res, err := pgs.dbpool.Query(context.Background(), "select id, title, description from challenges where id=$1", chid)
	if err != nil {
		log.Error().Err(err).Msg("Querry failed")
		return nil, err
	}
	return pgx.CollectOneRow(res, pgx.RowToAddrOfStructByName[Challenge])
}

func (pgs *PostgresStorage) GetChallengersList(chid int) ([]*Challenger, error) {
	log.Info().Int("challenge-id", chid).Msg("Querry challengers list by challenge id")
	res, err := pgs.dbpool.Query(context.Background(), "SELECT id, title, link, description, rating, trials FROM challengers WHERE ref_challenge_id = $1 order by rating desc", chid)
	if err != nil {
		log.Error().Err(err).Msg("Querry failed")
		return nil, err
	}
	return pgx.CollectRows(res, pgx.RowToAddrOfStructByName[Challenger])
}

func (pgs *PostgresStorage) PostChallenger(chid int, postChr *Challenger) (*Challenger, error) {
	log.Info().Any("challenger", postChr).Msg("insert new challenger")
	res, err := pgs.dbpool.Query(context.Background(), "INSERT INTO challengers (title, link, description, ref_challenge_id) VALUES ($1, $2, $3, $4) RETURNING id, title, link, description, rating, trials", postChr.Title, postChr.Link, postChr.Description, chid)
	if err != nil {
		log.Error().Err(err).Msg("querry failed")
		return nil, err
	}
	return pgx.CollectOneRow(res, pgx.RowToAddrOfStructByName[Challenger])
}

func (pgs *PostgresStorage) PostNewTrial(chid int) (*Trial, error) {
	log.Info().Int("challenge-id", chid).Msg("Request new trial")
	var cnt int
	err := pgs.dbpool.QueryRow(context.Background(), "SELECT count(*) FROM challengers WHERE ref_challenge_id = $1", chid).Scan(&cnt)
	if err != nil {
		log.Error().Err(err).Msg("Querry failed")
		return nil, err
	}
	log.Info().Int("count", cnt).Msg("amount of challengers")
	if cnt < 2 {
		log.Info().Msg("Not enough challengers")
		return nil, errors.New("not enough challengers")
	}

	var chat_pool int = 5
	if cnt < 5 {
		chat_pool = cnt
	}
	ch1_pos := rand.IntN(chat_pool)

	res, err := pgs.dbpool.Query(context.Background(), "SELECT id, title, link, description, rating, trials FROM challengers WHERE ref_challenge_id = $1 ORDER BY trials ASC, rating DESC OFFSET $2 LIMIT 1", chid, ch1_pos)
	if err != nil {
		log.Error().Err(err).Msg("querry failed")
		return nil, err
	}
	ch1, _ := pgx.CollectOneRow(res, pgx.RowToAddrOfStructByName[Challenger])

	chat_pool = 10
	if cnt > 100 {
		chat_pool = cnt / 10
	}
	if cnt < 11 {
		chat_pool = cnt - 1
	}
	ch2_pos := rand.IntN(chat_pool)
	res, err = pgs.dbpool.Query(context.Background(), "SELECT id, title, link, description, rating, trials FROM challengers WHERE ref_challenge_id = $1 AND id != $2 ORDER BY abs(rating - $3) ASC, trials DESC OFFSET $4 LIMIT 1", chid, ch1.ID, ch1.Rating, ch2_pos)
	if err != nil {
		log.Error().Err(err).Msg("Querry failed")
		return nil, err
	}
	ch2, _ := pgx.CollectOneRow(res, pgx.RowToAddrOfStructByName[Challenger])

	var trID string
	err = pgs.dbpool.QueryRow(context.Background(), "insert into trials(ref_challenger1, ref_challenger2, ref_challenge_id) values ($1, $2, $3) returning id", ch1.ID, ch2.ID, chid).Scan(&trID)
	if err != nil {
		log.Error().Err(err).Msg("Querry failed")
		return nil, err
	}
	trial := NewTrial(trID, ch1, ch2)
	return trial, nil
}

func (pgs *PostgresStorage) PatchTrialResult(chid int, trid, win, los string) error {
	log.Info().Int("challenge-id", chid).Str("trial", trid).Str("winner", win).Str("loser", los).Msg("Finish a trial")
	if win == los {
		log.Error().Msg("Same loser and winner")
		return errors.New("same loser and winner")
	}
	ctx := context.Background()

	tx, err := pgs.dbpool.Begin(ctx)
	if err != nil {
		log.Error().Err(err).Msg("Transaction start failed")
		return err
	}

	defer tx.Rollback(ctx)

	res, err := tx.Query(ctx, "select id, ref_challenger1, ref_challenger2, coalesce(ref_winner::text, '') as ref_winner, coalesce(ref_loser::text, '') as ref_loser, ref_challenge_id, delta from trials where id=$1 for update nowait", trid)
	if err != nil {
		log.Error().Err(err).Msg("Querry failed")
		return err
	}
	trSrc, err := pgx.CollectOneRow(res, pgx.RowToAddrOfStructByName[TrialDAO])
	if err != nil {
		log.Error().Err(err).Msg("Trial parsing failed")
		return err
	}

	if trSrc.Ref_Winner != "" {
		log.Error().Msg("trial already closed")
		return errors.New("trial already closed")
	}
	if !((trSrc.Ref_challenger1 == win && trSrc.Ref_challenger2 == los) || (trSrc.Ref_challenger1 == los && trSrc.Ref_challenger2 == win)) {
		log.Error().Msg("wrong challengers")
		return errors.New("wrong challengers")
	}
	res, err = pgs.dbpool.Query(context.Background(), "SELECT id, title, link, description, rating, trials FROM challengers WHERE id = $1 for update", win)
	if err != nil {
		log.Error().Err(err).Msg("Querry failed")
		return err
	}
	winner, err := pgx.CollectOneRow(res, pgx.RowToAddrOfStructByName[Challenger])
	if err != nil {
		log.Error().Err(err).Msg("Winner parsing failed")
		return err
	}
	res, err = pgs.dbpool.Query(context.Background(), "SELECT id, title, link, description, rating, trials FROM challengers WHERE id = $1 for update", los)
	if err != nil {
		log.Error().Err(err).Msg("Querry failed")
		return err
	}
	loser, err := pgx.CollectOneRow(res, pgx.RowToAddrOfStructByName[Challenger])
	if err != nil {
		log.Error().Err(err).Msg("Loser parsing failed")
		return err
	}

	var expected_delta float64 = 1 / (1 + math.Pow(10, (loser.Rating-winner.Rating)/400))
	final_delta := 20 * (1 - expected_delta)

	if _, err = tx.Exec(ctx, "update trials set ref_winner = $1, ref_loser = $2, delta = $3 where id=$4", win, los, final_delta, trid); err != nil {
		log.Error().Err(err).Msg("Failed to save trial")
		return err
	}
	if _, err = tx.Exec(ctx, "update challengers set rating = $1, trials = $2 where id=$3", winner.Rating+final_delta, winner.Trials+1, win); err != nil {
		log.Error().Err(err).Msg("Failed to save winner")
		return err
	}
	if _, err = tx.Exec(ctx, "update challengers set rating = $1, trials = $2 where id=$3", loser.Rating+final_delta, loser.Trials+1, los); err != nil {
		log.Error().Err(err).Msg("Failed to save loser")
		return err
	}

	return tx.Commit(ctx)
}
