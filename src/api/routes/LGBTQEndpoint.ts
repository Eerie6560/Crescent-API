import {Request, Response} from "express";
import AvatarUtil from "../util/api/AvatarUtil";
import ErrorUtil from "../util/ErrorUtil";
import PrideUtil from "../util/api/PrideUtil";
import ResponseUtil from "../util/api/ResponseUtil";

export default class LGBTQEndpoint {

    public static async sendPrideFlag(req: Request, res: Response) {
        const query = req.query.type || req.params.type as string;
        if (!query) {
            return res.status(200).json({
                status: res.statusCode,
                data: await PrideUtil.getFlag("pride", true),
                timestamps: ResponseUtil.getTimestamps()
            });
        } else {
            try {
                return res.status(200).sendFile(await PrideUtil.getFlag(<string> query));
            } catch (error) {
                return ErrorUtil.sent500Status(req, res);
            }
        }
    }

    /*
     Add pride flairs to an avatar.
     @method POST

     */

    public static async sendFlairedAvatar(req: Request, res: Response): Promise<Response> {
        const flair: string = req.query.flair as string;
        const avatar: string = req.query.avatar as string;
        const format: string = req.query.format as string;
        if (!flair || !avatar) {
            return res.status(500).json({
                status: res.statusCode,
                message: "Invalid syntax.",
                timestamps: {
                    date: new Date().toLocaleString(),
                    unix: Math.round(+ new Date() / 1000),
                }
            });
        }
        let result;
        if (format === "base64") {
            switch (flair.toLowerCase()) {
                case "abro":
                case "abrosexual":
                    result = await AvatarUtil.getFlairedAvatar("Abrosexual", avatar, true);
                    break;
                case "agender":
                    result = await AvatarUtil.getFlairedAvatar("Agender", avatar, true);
                    break;
                case "aro":
                case "aromantic":
                    result = await AvatarUtil.getFlairedAvatar("Aromantic", avatar, true);
                    break;
                case "ace":
                case "asexual":
                    result = await AvatarUtil.getFlairedAvatar("Asexual", avatar, true);
                    break;
                case "bigender":
                    result = await AvatarUtil.getFlairedAvatar("Bigender", avatar, true);
                    break;
                case "bi":
                case "bisexual":
                    result = await AvatarUtil.getFlairedAvatar("Bisexual", avatar, true);
                    break;
                case "demiboy":
                    result = await AvatarUtil.getFlairedAvatar("Demiboy", avatar, true);
                    break;
                case "demigirl":
                    result = await AvatarUtil.getFlairedAvatar("Demigirl", avatar, true);
                    break;
                case "demiro":
                case "demiromantic":
                    result = await AvatarUtil.getFlairedAvatar("Demiromantic", avatar, true);
                    break;
                case "demisexual":
                case "demi":
                    result = await AvatarUtil.getFlairedAvatar("Demisexual", avatar, true);
                    break;
                case "gay":
                    result = await AvatarUtil.getFlairedAvatar("Gay", avatar, true);
                    break;
                case "genderfluid":
                    result = await AvatarUtil.getFlairedAvatar("Genderfluid", avatar, true);
                    break;
                case "genderflux":
                    result = await AvatarUtil.getFlairedAvatar("Genderflux", avatar, true);
                    break;
                case "genderqueer":
                    result = await AvatarUtil.getFlairedAvatar("Genderqueer", avatar, true);
                    break;
                case "intersex":
                    result = await AvatarUtil.getFlairedAvatar("Intersex", avatar, true);
                    break;
                case "lgbt":
                case "lgbtq":
                    result = await AvatarUtil.getFlairedAvatar("LGBT", avatar, true);
                    break;
                case "lesbian":
                    result = await AvatarUtil.getFlairedAvatar("Lesbian", avatar, true);
                    break;
                case "enby":
                case "nonbinary":
                    result = await AvatarUtil.getFlairedAvatar("Nonbinary", avatar, true);
                    break;
                case "omni":
                case "omnisexual":
                    result = await AvatarUtil.getFlairedAvatar("Omnisexual", avatar, true);
                    break;
                case "pan":
                case "pansexual":
                    result = await AvatarUtil.getFlairedAvatar("Pansexual", avatar, true);
                    break;
                case "polyamorous":
                    result = await AvatarUtil.getFlairedAvatar("Polyamorous", avatar, true);
                    break;
                case "polysexual":
                    result = await AvatarUtil.getFlairedAvatar("Polysexual", avatar, true);
                    break;
                case "pride":
                case "progresspride":
                    result = await AvatarUtil.getFlairedAvatar("ProgressPride", avatar, true);
                    break;
                case "sapphic":
                    result = await AvatarUtil.getFlairedAvatar("Sapphic", avatar, true);
                    break;
                case "trans":
                case "transgender":
                case "transmasc":
                case "transfemme":
                    result = await AvatarUtil.getFlairedAvatar("Transgender", avatar, true);
                    break;
                case "xenogender":
                    result = await AvatarUtil.getFlairedAvatar("Xenogender", avatar, true);
                    break;
                default:
                    result = await AvatarUtil.getFlairedAvatar("ProgressPride", avatar, true);
                    break;
            }
            return res.status(200).json({
                status: 200,
                timestamps: {
                    date: new Date().toLocaleString(),
                    unix: Math.round(+ new Date() / 1000),
                },
                image: {
                    flair: flair,
                    input: avatar,
                    output: result
                }
            });
        } else {
            switch (flair.toLowerCase()) {
                case "abro":
                case "abrosexual":
                    result = await AvatarUtil.getFlairedAvatar("Abrosexual", avatar);
                    break;
                case "agender":
                    result = await AvatarUtil.getFlairedAvatar("Agender", avatar);
                    break;
                case "aro":
                case "aromantic":
                    result = await AvatarUtil.getFlairedAvatar("Aromantic", avatar);
                    break;
                case "ace":
                case "asexual":
                    result = await AvatarUtil.getFlairedAvatar("Asexual", avatar);
                    break;
                case "bigender":
                    result = await AvatarUtil.getFlairedAvatar("Bigender", avatar);
                    break;
                case "bi":
                case "bisexual":
                    result = await AvatarUtil.getFlairedAvatar("Bisexual", avatar);
                    break;
                case "demiboy":
                    result = await AvatarUtil.getFlairedAvatar("Demiboy", avatar);
                    break;
                case "demigirl":
                    result = await AvatarUtil.getFlairedAvatar("Demigirl", avatar);
                    break;
                case "demiro":
                case "demiromantic":
                    result = await AvatarUtil.getFlairedAvatar("Demiromantic", avatar);
                    break;
                case "demisexual":
                case "demi":
                    result = await AvatarUtil.getFlairedAvatar("Demisexual", avatar);
                    break;
                case "gay":
                    result = await AvatarUtil.getFlairedAvatar("Gay", avatar);
                    break;
                case "genderfluid":
                    result = await AvatarUtil.getFlairedAvatar("Genderfluid", avatar);
                    break;
                case "genderflux":
                    result = await AvatarUtil.getFlairedAvatar("Genderflux", avatar);
                    break;
                case "genderqueer":
                    result = await AvatarUtil.getFlairedAvatar("Genderqueer", avatar);
                    break;
                case "intersex":
                    result = await AvatarUtil.getFlairedAvatar("Intersex", avatar);
                    break;
                case "lgbt":
                case "lgbtq":
                    result = await AvatarUtil.getFlairedAvatar("LGBT", avatar);
                    break;
                case "lesbian":
                    result = await AvatarUtil.getFlairedAvatar("Lesbian", avatar);
                    break;
                case "enby":
                case "nonbinary":
                    result = await AvatarUtil.getFlairedAvatar("Nonbinary", avatar);
                    break;
                case "omni":
                case "omnisexual":
                    result = await AvatarUtil.getFlairedAvatar("Omnisexual", avatar);
                    break;
                case "pan":
                case "pansexual":
                    result = await AvatarUtil.getFlairedAvatar("Pansexual", avatar);
                    break;
                case "polyamorous":
                    result = await AvatarUtil.getFlairedAvatar("Polyamorous", avatar);
                    break;
                case "polysexual":
                    result = await AvatarUtil.getFlairedAvatar("Polysexual", avatar);
                    break;
                case "pride":
                case "progresspride":
                    result = await AvatarUtil.getFlairedAvatar("ProgressPride", avatar);
                    break;
                case "sapphic":
                    result = await AvatarUtil.getFlairedAvatar("Sapphic", avatar);
                    break;
                case "trans":
                case "transgender":
                case "transmasc":
                case "transfemme":
                    result = await AvatarUtil.getFlairedAvatar("Transgender", avatar);
                    break;
                case "xenogender":
                    result = await AvatarUtil.getFlairedAvatar("Xenogender", avatar);
                    break;
                default:
                    result = await AvatarUtil.getFlairedAvatar("ProgressPride", avatar);
                    break;
            }
            switch (format) {
                case "png":
                    res.writeHead(200, {
                        "Content-Type": "image/png",
                        "Content-Length": result.length
                    });
                    res.end(result);
                    break;
                case "jpg":
                case "jpeg":
                    res.writeHead(200, {
                        "Content-Type": "image/jpg",
                        "Content-Length": result.length
                    });
                    res.end(result);
                    break;
                default:
                    res.writeHead(200, {
                        "Content-Type": "image/png",
                        "Content-Length": result.length
                    });
                    res.end(result);
            }
        }
    }
}