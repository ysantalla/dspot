package main

import (
	"errors"
	"fmt"
)

func totalAmountOfFullDecks(cards []Card, totalCardsInDecks int) (int, error) {
	totalCardMap := make(map[string]int)
	maxDecksCard := len(cards) / totalCardsInDecks

	for i := 0; i < len(cards); i++ {
		key := fmt.Sprintf("%v-%v", cards[i].Suit, cards[i].Value)
		totalCardMap[key]++
	}

	for _, value := range totalCardMap {
		if value < maxDecksCard {
			maxDecksCard = value
		}
	}

	if len(totalCardMap) < totalCardsInDecks {
		return 0, nil
	} else if len(totalCardMap) > totalCardsInDecks {
		return 0, errors.New("Invalid total of cards")
	}
	return maxDecksCard, nil
}

// Card struct
type Card struct {
	Suit  string
	Value string
}

func main() {
	var suit, value string
	var totalCards, totalCardsInDecks int = 0, 0

	fmt.Println("Enter number of cards")
	fmt.Scanf("%d", &totalCards)

	fmt.Println("Enter the total cards that have the decks")
	fmt.Scanf("%d", &totalCardsInDecks)

	var cards = []Card{}

	for i := 0; i < totalCards; i++ {
		fmt.Println("Enter card in format suit-value")
		fmt.Scanf("%v-%v", &suit, &value)

		cards = append(cards, Card{
			Suit:  suit,
			Value: value,
		})
	}

	total, err := totalAmountOfFullDecks(cards, totalCardsInDecks)

	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(total)
	}

}
