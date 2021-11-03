import request from "request";
import cheerio from "cheerio";
import SCPExceptions from "../../data/foundation/SCPExceptions";

export default class SCPScraper {

    public static async getScpData(scp: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            request("https://www.scpwiki.com/scp-" + scp, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    if (scp === "001") {
                        const item = "SCP-" + scp;
                        const warning = $(".content-panel").find("p").first().text()
                            .replace(/█/g, "X");
                        const imageSrc = $('.scp-image-block').find("img").first().attr("src");
                        resolve({
                            status: 200,
                            item: item,
                            class: null,
                            description: warning,
                            procedures: null,
                            imageSrc: imageSrc || null
                        });
                    } else {
                        if (scp === "000") {
                            resolve({
                                status: 200,
                                item: "SCP-000",
                                class: "#NULL",
                                description: "Internal system error: Field undefined. Please contact system administrator.",
                                procedures: "An error has occurred.",
                                imageSrc: null
                            });
                        } else {
                            let item = $("#page-title")
                                .first()
                                .text()
                                .replace(/\s\s+/g, "");
                            let objectClass = $('p:contains("Object Class:")')
                                .first()
                                .text()
                                .replace(/█/g, 'X')
                                .replace("Object Class: ", "");
                            let procedures = $('p:contains("Special Containment Procedures:")')
                                .first()
                                .text()
                                .replace(/█/g, 'X')
                                .replace("Special Containment Procedures: ", "");
                            let description = $('p:contains("Description:")')
                                .first()
                                .text()
                                .replace(/█/g, 'X')
                                .replace("Description: ", "");
                            let imageSrc = $('.scp-image-block')
                                .find("img")
                                .first()
                                .attr("src");
                            if (item === "") item = "CLASSIFIED";
                            if (objectClass === "") objectClass = "Undefined.";
                            if (procedures === "") procedures = "Undefined.";
                            if (description === "") description = "Undefined.";
                            for (let i = 0; i < SCPExceptions.length; i++) {
                                if (SCPExceptions[i].item === "SCP-" + scp) {
                                    resolve({
                                        status: 200,
                                        item: SCPExceptions[i].item,
                                        class: SCPExceptions[i].class,
                                        description: SCPExceptions[i].description,
                                        procedures: SCPExceptions[i].procedures,
                                        imageSrc: imageSrc || null
                                    });
                                }
                            }
                            resolve({
                                status: 200,
                                item: item,
                                class: objectClass,
                                description: description,
                                procedures: procedures,
                                imageSrc: imageSrc || null
                            });
                        }
                    }
                } else {
                    reject({
                        status: 400,
                        message: "An SCP by that item number was not found."
                    });
                }
            });
        }).catch(error => {
            console.log(error);
        });
    }
}