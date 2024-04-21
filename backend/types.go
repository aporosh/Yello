package main

type Challenger struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Link        string  `json:"link"`
	Description string  `json:"description"`
	Rating      float64 `json:"rating"`
	Trials      int     `json:"trials"`
	Active      bool    `json:"active"`
	Resolution  string  `json:"resolution"`
}

func NewChallenger(id, title, link, description string) *Challenger {
	return &Challenger{
		ID:          id,
		Title:       title,
		Link:        link,
		Description: description,
		Rating:      1000,
		Trials:      0,
		Active:      true,
		Resolution:  "",
	}
}

type Challenge struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func NewChallenge(id int, title, description string) *Challenge {
	return &Challenge{
		ID:          id,
		Title:       title,
		Description: description,
	}
}

type Trial struct {
	ID          string        `json:"id"`
	Challengers [2]Challenger `json:"challengers"`
	Winner      string        `json:"winner"`
	Loser       string        `json:"loser"`
	Delta       float32       `json:"delta"`
}

type TrialDAO struct {
	ID               string
	Ref_challenger1  string
	Ref_challenger2  string
	Ref_Winner       string
	Ref_Loser        string
	Ref_challenge_id int
	Delta            float32
}

type TrialDTO struct {
	Winner string
	Loser  string
}

func NewTrial(id string, challenger1, challenger2 *Challenger) *Trial {
	return &Trial{
		ID:          id,
		Challengers: [2]Challenger{*challenger1, *challenger2},
		Winner:      "",
		Loser:       "",
	}
}
