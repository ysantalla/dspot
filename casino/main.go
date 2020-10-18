package main

import "fmt"

func totalAmountOfFullDecks(cards []Card, totalCardsInDecks int) int {
	maxDecksCard := 0

	totalCardMap := make(map[string]int)

	for i := 0; i < len(cards); i++ {
		key := fmt.Sprintf("%v-%v", cards[i].suit, cards[i].value)
		totalCardMap[key]++

		if totalCardMap[key] > maxDecksCard {
			maxDecksCard = totalCardMap[key]
		}
	}

	if len(totalCardMap) < totalCardsInDecks {
		return 0
	}

	return maxDecksCard
}

type Card struct {
	suit  string
	value string
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
			suit:  suit,
			value: value,
		})
	}

	fmt.Println(totalAmountOfFullDecks(cards, totalCardsInDecks))
}
