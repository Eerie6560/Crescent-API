import {NextFunction, Request, Response} from "express";
import QueryUtil from "minecraft-server-util";

export default class MCBedrock {

    public static queryBedrockServer(req: Request, res: Response, next: NextFunction) {
        const host = req.query.host as string;
        // @ts-ignore
        const port = parseInt(req.query.port)
        try {
            QueryUtil.queryFull(host, {port: port || 19132, enableSRV: true})
                .then(response => {
                    return res.status(200).json({
                        status: 200,
                        host: response.host,
                        port: response.port,
                        srvRecord: response.srvRecord,
                        gameType: response.gameType,
                        version: response.version,
                        software: response.software,
                        plugins: response.plugins,
                        levelName: response.levelName,
                        latency: response.roundTripLatency,
                        players: {
                            online: response.onlinePlayers,
                            max: response.maxPlayers,
                            list: response.players
                        }
                    });
                }).catch(error => {
                    return res.status(500).json({
                        status: 500,
                        message: "Query failed. The server might not be online."
                    });
                });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 404,
                message: "An error occurred. Please contact an API developer.",
                timestamps: {
                    date: new Date().toLocaleString(),
                    unix: Math.round(+ new Date() / 1000),
                }
            });
        }
    }
}