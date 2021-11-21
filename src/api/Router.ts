/*
 * Copyright 2021 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

import * as express from "express";
import limiter from "./config/RateLimitConfig";
import ColorEndpoint from "./routes/ColorEndpoint";
import LGBTQEndpoint from "./routes/LGBTQEndpoint";
import DataEndpoint from "./routes/DataEndpoint";
import RandomEndpoint from "./routes/RandomEndpoint";
import ImageManipulationEndpoint from "./routes/ImageManipulationEndpoint";
import UtilityEndpoint from "./routes/UtilityEndpoint";
import {NextFunction, Request, Response} from "express";
import AuthorizationUtil from "./util/api/AuthorizationUtil";
import GameQueryEndpoint from "./routes/GameQueryEndpoint";
import DeckEndpoint from "./routes/DeckEndpoint";
import SCPEndpoint from "./routes/SCPEndpoint";
import RoboEerieEndpoint from "./routes/RoboEerieEndpoint";
import AuthEndpoint from "./routes/AuthEndpoint";
import multer from "multer";
import HostingUtil from "./util/HostingUtil";

const router = express.Router();
const premiumRouter = express.Router();
const uploadRouter = express.Router();

router.use(limiter.rateLimiter);
premiumRouter.use(limiter.rateLimiter);

premiumRouter.use(async (req: Request, res: Response, next: NextFunction) => {
    await AuthorizationUtil.checkKeyValidity(req, res, next);
});

router.get("/health", DataEndpoint.getApiHealth);
router.get("/affirmations", RandomEndpoint.getRandomAffirmation);

router.get("/color", ColorEndpoint.hexToImage);
router.get("/prime", UtilityEndpoint.checkIfNumberIsPrime);
router.get("/prime/:number", UtilityEndpoint.checkIfNumberIsPrime);

router.post("/trigger", ImageManipulationEndpoint.sendTriggeredImage);
router.post("/jail", ImageManipulationEndpoint.sendJailedImage);
router.post("/gay", ImageManipulationEndpoint.sendGayImage);
router.post("/circle", ImageManipulationEndpoint.sendCircularImage);
router.post("/burn", ImageManipulationEndpoint.sendBurningImage);
router.post("/facepalm", ImageManipulationEndpoint.sendFacepalmImage);
router.post("/pixelate", ImageManipulationEndpoint.sendPixelatedImage);
router.post("/rip", ImageManipulationEndpoint.sendRipEffect);

router.post("/pride/avatar", LGBTQEndpoint.sendFlairedAvatar);
router.get("/pride/flags", LGBTQEndpoint.sendPrideFlag);
router.get("/pride/flags/:type", LGBTQEndpoint.sendPrideFlag);
router.get("/pride/orientations", LGBTQEndpoint.searchForOrientation);

premiumRouter.get("/chatbot", DataEndpoint.sendChatbotMessage);
premiumRouter.get("/captcha", DataEndpoint.getCaptchaData);

premiumRouter.get("/query/mcbe", GameQueryEndpoint.queryBedrockServer);
premiumRouter.get("/query/mcjava", GameQueryEndpoint.queryJavaServer);
premiumRouter.get("/query/fivem", GameQueryEndpoint.queryFivemServer);
premiumRouter.get("/query/ark", GameQueryEndpoint.queryArkServer);

premiumRouter.get("/decks/evalhand", DeckEndpoint.getPokerHand);
premiumRouter.get("/decks/find", DeckEndpoint.getDeckById);
premiumRouter.patch("/decks/shuffle", DeckEndpoint.shuffleDeckById);
premiumRouter.patch("/decks/draw", DeckEndpoint.drawCards);
premiumRouter.post("/decks/create", DeckEndpoint.createDeck);
premiumRouter.post("/decks/reset", DeckEndpoint.resetDeck);

premiumRouter.get("/scp", SCPEndpoint.getScpData);
premiumRouter.get("/scp/personnel", SCPEndpoint.getFoundationPersonnel);
premiumRouter.get("/scp/branches", SCPEndpoint.getFoundationBranches);
premiumRouter.get("/scp/taskforces", SCPEndpoint.getFoundationTaskForce);
premiumRouter.get("/scp/sites", SCPEndpoint.getFoundationSites);
premiumRouter.get("/scp/areas", SCPEndpoint.getFoundationAreas);
premiumRouter.get("/scp/all", SCPEndpoint.getAllFoundationData);

premiumRouter.get("/covid/world", DataEndpoint.getWorldwideCovidStats);
premiumRouter.get("/covid/country", DataEndpoint.getCovidStatsByCountry);
premiumRouter.get("/covid/:country", DataEndpoint.getCovidStatsByCountry);

premiumRouter.get("/roboeerie/tags", RoboEerieEndpoint.getTags);
premiumRouter.get("/roboeerie/tags/:count", RoboEerieEndpoint.getTags);

premiumRouter.get("/weather", DataEndpoint.sendWeatherResponse);
premiumRouter.get("/weather/:location", DataEndpoint.sendWeatherResponse);

premiumRouter.get("/random/month", RandomEndpoint.getRandomMonth);
premiumRouter.get("/random/userprofile", RandomEndpoint.getRandomUserProfile);
premiumRouter.get("/random/userprofile/:count", RandomEndpoint.getRandomUserProfile);
premiumRouter.get("/random/timezone", RandomEndpoint.getRandomTimezone);
premiumRouter.get("/random/timezone/:count", RandomEndpoint.getRandomTimezone);

premiumRouter.post("/auth/keys/create", AuthEndpoint.createKey);
premiumRouter.get("/auth/keys/list", AuthEndpoint.getAllKeys);

const storage = multer.diskStorage(HostingUtil.getDiskStorageOptions());

uploadRouter.post("/post", multer({storage}).array("avatar"), (req: Request, res: Response) => {
    return HostingUtil.sendImagePostResponse(req, res);
});

uploadRouter.get("/list", (req: Request, res: Response) => {
    return HostingUtil.sendArrayOfAllImages(req, res).then(() => {});
});

uploadRouter.get("/:image", async (req: Request, res: Response) => {
    await HostingUtil.getImage(req, res);
});

export = {
    v1: router,
    premium: premiumRouter,
    hosting: uploadRouter
};