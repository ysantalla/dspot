package main

import (
	"errors"
	"testing"
)

var casinoDataTests = []struct {
	cards          []Card
	totalCardDecks int
	expected       int
}{
	{
		[]Card{
			Card{
				Suit:  "heart",
				Value: "1",
			},
			Card{
				Suit:  "heart",
				Value: "1",
			},
		},
		10,
		0,
	},
	{
		[]Card{
			Card{
				Suit:  "heart",
				Value: "1",
			},
			Card{
				Suit:  "heart",
				Value: "1",
			},
		},
		1,
		2,
	},
	{
		[]Card{
			Card{
				Suit:  "heart",
				Value: "1",
			},
			Card{
				Suit:  "heart",
				Value: "2",
			},
			Card{
				Suit:  "heart",
				Value: "1",
			},
			Card{
				Suit:  "heart",
				Value: "3",
			},
		},
		3,
		2,
	},
}

func TestTotalAmountOfFullDecks(t *testing.T) {
	for _, data := range casinoDataTests {
		total, _ := totalAmountOfFullDecks(data.cards, data.totalCardDecks)

		if total != data.expected {
			t.Errorf("Expected this ==> %d recieve this ==> %d: \n", data.expected, total)
		}
	}
}

var casinoDataTestsInvalid = []struct {
	cards          []Card
	totalCardDecks int
	expected       error
}{
	{
		[]Card{
			Card{
				Suit:  "heart",
				Value: "1",
			},
			Card{
				Suit:  "heart",
				Value: "2",
			},
		},
		1,
		errors.New("Invalid total of cards"),
	},
}

func TestTotalAmountOfFullDecksError(t *testing.T) {
	for _, data := range casinoDataTestsInvalid {
		_, err := totalAmountOfFullDecks(data.cards, data.totalCardDecks)

		if err.Error() != data.expected.Error() {
			t.Errorf("Expected this error ==> (%s) recieve this ==> (%s)  \n", data.expected, err)
		}
	}
}
