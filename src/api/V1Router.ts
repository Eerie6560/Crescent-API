import * as express from "express";
import limiter from "./config/RateLimitConfig";
import TriggerRoute from "./routes/images/TriggerRoute";
import JailRoute from "./routes/images/JailRoute";
import GayRoute from "./routes/images/GayRoute";
import DeckRoute from "./routes/game/DeckRoute";
import ColorEndpoint from "./routes/ColorEndpoint";
import LGBTQEndpoint from "./routes/LGBTQEndpoint";
import DataEndpoint from "./routes/DataEndpoint";
import RandomEndpoint from "./routes/RandomEndpoint";

const router = express.Router();

router.use(limiter.rateLimiter);

router.get("/trigger", TriggerRoute.triggerImage);
router.get("/jail", JailRoute.jailImage);
router.get("/gay", GayRoute.gayImage);

router.get("/health", DataEndpoint.getApiHealth);
router.get("/affirmations", RandomEndpoint.getRandomAffirmation);

router.get("/color", ColorEndpoint.hexToImage);

router.get("/decks/create", DeckRoute.createDeck);
router.get("/decks/find", DeckRoute.getDeckById);
router.get("/decks/shuffle", DeckRoute.shuffleDeckById);
router.get("/decks/poker/evalhand", DeckRoute.getPokerHand);

router.post("/pride/avatar", LGBTQEndpoint.sendFlairedAvatar);

router.get("/weather", DataEndpoint.sendWeatherResponse);
router.get("/weather/:location", DataEndpoint.sendWeatherResponse);

router.get("/random/month", RandomEndpoint.getRandomMonth);
router.get("/random/userprofile", RandomEndpoint.getRandomUserProfile);
router.get("/random/userprofile/:amount", RandomEndpoint.getRandomUserProfile);
router.get("/random/timezone", RandomEndpoint.getRandomTimezone);
router.get("/random/timezone/:amount", RandomEndpoint.getRandomTimezone);

export = router;