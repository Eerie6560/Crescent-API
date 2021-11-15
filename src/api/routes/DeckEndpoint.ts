import {Request, Response} from "express";
import DeckUtil from "../util/DeckUtil";
import Deck from "../models/Decks";
import APIUtil from "../util/api/APIUtil";
import ErrorUtil from "../util/ErrorUtil";
import Logger from "../../Logger";

export default class DeckEndpoint {

    /*
     Evaluate a specific poker hand. Hands must have 3, 5, 6, or 7 cards.
     @method GET
     @header Authentication: token
     @uri /v1/decks/evalhand?hand=Ah,As,2c,5d,9h
     @param hand: string
     */

    public static getPokerHand(req: Request, res: Response) {
        const hand = req.query.hand as string;
        if (!hand) return ErrorUtil.send400Status(req, res);
        const cards = hand.replace(/\s/g, "").split(",");
        try {
            const result = DeckUtil.evaluateHand(<string[]> cards);
            return res.status(200).json({
               status: res.statusCode,
               hand: {
                   name: result.handName,
                   type: result.handType,
                   rank: result.handRank,
                   value: result.value
               },
               timestamps: APIUtil.getTimestamps()
            });
        } catch (error) {
            Logger.error(error);
            return ErrorUtil.sent500Status(req, res);
        }
    }

    /*
     Create a virtual deck of cards.
     @method POST
     @header Authentication: token
     @uri /v1/decks/create
     */

    public static createDeck(req: Request, res: Response) {
        try {
            const deck = DeckUtil.createDeck();
            const deckId = APIUtil.generateUniqueId();
            Deck.create({
                deckId: deckId,
                deck: deck,
                data: {
                    shuffled: false,
                    remainingCards: deck.length
                }
            }).then(() => {
                return res.status(200).json({
                    status: res.statusCode,
                    deckId: deckId,
                    deck: deck,
                    data: {
                        shuffled: false,
                        remainingCards: deck.length
                    },
                    timestamps: APIUtil.getTimestamps()
                });
            }).catch(() => {
                return res.status(400).json({
                    status: res.statusCode,
                    message: "Could not create a deck.",
                    timestamps: {
                        date: new Date().toLocaleString(),
                        unix: Math.round(+ new Date() / 1000),
                    }
                });
            });
        } catch (error) {
            return ErrorUtil.sent500Status(req, res);
        }
    }

    /*
     Get a deck of cards by ID.
     @method GET
     @header Authentication: token
     @uri /v1/decks/find?id=b9e1-4a5-68738
     @param id: string
     */

    public static getDeckById(req: Request, res: Response) {
        const deckId = req.query.id as string;
        if (!deckId) return ErrorUtil.send400Status(req, res);
        try {
            Deck.findOne({deckId: deckId})
                .then(deck => {
                    if (!deck) {
                        return res.status(400).json({
                            status: res.statusCode,
                            message: "Could not find a deck by that ID.",
                            timestamps: APIUtil.getTimestamps()
                        });
                    } else {
                        return res.status(200).json({
                            status: res.statusCode,
                            deckId: deck.deckId,
                            deck: deck.deck,
                            data: deck.data,
                            timestamps: APIUtil.getTimestamps()
                        });
                    }
            });
        } catch (error) {
            return ErrorUtil.sent500Status(req, res);
        }
    }

    /*
     Shuffle a deck by ID.
     @method PATCH
     @header Authentication: token
     @uri /v1/decks/shuffle?id=b9e1-4a5-68738
     @param id: string
     */

    public static async shuffleDeckById(req: Request, res: Response) {
        const deckId = req.query.id as string;
        if (!deckId) return ErrorUtil.send400Status(req, res);
        try {
            Deck.findOne({deckId: deckId}, async function (error, deck) {
                if (!deck) {
                    return res.status(400).json({
                        status: res.statusCode,
                        message: "Could not find a deck by that ID.",
                        timestamps: APIUtil.getTimestamps()
                    });
                } else {
                    const shuffledDeck = DeckUtil.shuffleDeck(deck.deck);
                    Deck.findOneAndUpdate({deckId: deckId}, {deck: shuffledDeck, data: {shuffled: true, remainingCards: shuffledDeck.length}}, (error, result) => {
                        if (error) {
                            return res.status(400).json({
                                status: res.statusCode,
                                message: "Could not find a deck by that ID.",
                                timestamps: APIUtil.getTimestamps()
                            });
                        } else {
                            return res.status(200).json({
                                status: 200,
                                deckId: deckId,
                                deck: shuffledDeck,
                                details: {
                                    shuffled: result.shuffled,
                                    remainingCards: result.remainingCards
                                },
                                timestamps: APIUtil.getTimestamps()
                            });
                        }
                    });
                }
            });
        } catch (error) {
            return ErrorUtil.sent500Status(req, res);
        }
    }

    /*
     Draw a specified number of cards from a deck.
     @method PATCH
     @header Authentication: token
     @uri /v1/decks/draw?id=b9e1-4a5-68738&count=4
     @param id: string
     @param count: int
     */

    public static async drawCards(req: Request, res: Response) {
        const deckId = req.query.id as string;
        const count = req.query.count as string;
        if (!deckId) return ErrorUtil.send400Status(req, res);
        try {
            Deck.findOne({deckId: deckId}, async function (error, deck) {
                if (!deck) {
                    return res.status(400).json({
                        status: res.statusCode,
                        message: "Invalid deck ID.",
                        timestamps: APIUtil.getTimestamps()
                    });
                } else if (!count) {
                    return ErrorUtil.send400Status(req, res);
                } else {
                    const drawn = DeckUtil.drawCard(deck.deck, parseInt(count));
                    Deck.findOneAndUpdate({deckId: deckId}, {deck: drawn.updatedDeck, data: {shuffled: deck.data.shuffled, remainingCards: drawn.remainingCards}}, async function (error, deck) {
                        if (!deck) {
                            return res.status(400).json({
                                status: res.statusCode,
                                message: "Could not find a deck by that ID.",
                                timestamps: APIUtil.getTimestamps()
                            });
                        } else {
                            return res.status(200).json({
                                status: res.statusCode,
                                deckId: deckId,
                                deck: drawn.updatedDeck,
                                details: {
                                    shuffled: deck.shuffled,
                                    remainingCards: drawn.remainingCards,
                                    drawnCards: drawn.cardsDrawn,
                                    amountDrawn: drawn.amountDrawn
                                },
                                timestamps: APIUtil.getTimestamps()
                            });
                        }
                    });
                }
            });
        } catch (error) {
            return ErrorUtil.sent500Status(req, res);
        }
    }

    /*
     Reset a deck to its original state.
     @method POST
     @header Authentication: token
     @uri /v1/decks/reset?id=b9e1-4a5-68738
     @param id: string
     */

    public static async resetDeck(req: Request, res: Response) {
        const deckId = req.query.id as string;
        if (!deckId) return ErrorUtil.send400Status(req, res);
        try {
            Deck.findOneAndUpdate({deckId: deckId}, {deck: DeckUtil.createDeck(), data: {shuffled: false, remainingCards: 52}}, async function (error, deck) {
                if (!deck) {
                    return res.status(400).json({
                        status: res.statusCode,
                        message: "Could not find a deck by that ID.",
                        timestamps: APIUtil.getTimestamps()
                    });
                } else {
                    return res.status(200).json({
                        status: res.statusCode,
                        deckId: deckId,
                        deck: DeckUtil.createDeck(),
                        data: {
                            shuffled: deck.data.shuffled,
                            remainingCards: deck.data.remainingCards
                        },
                        timestamps: APIUtil.getTimestamps()
                    });
                }
            });
        } catch (error) {
            return ErrorUtil.sent500Status(req, res);
        }
    }
}