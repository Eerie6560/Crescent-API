import * as express from "express";
import limiter from "./config/RateLimitConfig";
import TriggerRoute from "./routes/images/TriggerRoute";
import JailRoute from "./routes/images/JailRoute";
import GayRoute from "./routes/images/GayRoute";
import ChatbotRoute from "./routes/utility/ChatbotRoute";
import HealthRoute from "./routes/HealthRoute";
import MCBedrock from "./routes/game/MCBedrock";
import DeckRoute from "./routes/game/DeckRoute";
import AffirmationRoute from "./routes/utility/AffirmationRoute";
import ColorRoute from "./routes/utility/ColorRoute";
import SCPRoute from "./routes/info/SCPRoute";
import AuthorizationUtil from "./util/AuthorizationUtil";
import KeyRoute from "./routes/authorization/KeyRoute";

const router = express.Router();
router.use(limiter.rateLimiter);

router.get("/trigger", TriggerRoute.triggerImage);
router.get("/jail", JailRoute.jailImage);
router.get("/gay", GayRoute.gayImage);

router.get("/health", HealthRoute.fetchApiHealth);
router.get("/chatbot", ChatbotRoute.sendChatbotMessage);
router.get("/affirmations", AffirmationRoute.getAffirmation);
router.get("/color", ColorRoute.hexToImage);
router.get("/scp", SCPRoute.getScpData);

router.get("/mcbe", MCBedrock.queryBedrockServer);

router.get("/decks/create", DeckRoute.createDeck);
router.get("/decks/find", DeckRoute.getDeckById);
router.get("/decks/shuffle", DeckRoute.shuffleDeckById);
router.get("/decks/poker/evalhand", DeckRoute.getPokerHand);

router.post("/auth/keys/create", KeyRoute.createKey);

export = router;