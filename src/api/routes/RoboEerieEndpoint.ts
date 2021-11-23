/*
 * Copyright © 2021 Ben Petrillo. All rights reserved.
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

import {Request, Response} from "express";
import ErrorUtil from "../util/ErrorUtil";
import RoboEerieUtil from "../util/RoboEerieUtil";
import APIUtil from "../util/api/APIUtil";

export default class RoboEerieEndpoint {

    /*
     Get a list of all tags from the RoboEerie bot.
     @method GET
     @header Authentication: token
     @uri /v1/roboeerie/tags?count=2
     @param count: int
     */

    public static async getTags(req: Request, res: Response) {
        const count = req.query.count || req.params.count as string;
        try {
            if (count) {
                await RoboEerieUtil.fetchTags(parseInt(<string> count))
                    .then(result => {
                        res.status(200).send({
                            status: res.statusCode,
                            data: result,
                            timestamps: APIUtil.getTimestamps()
                        });
                    });
            } else {
                await RoboEerieUtil.fetchTags()
                    .then(result => {
                        res.status(200).send({
                            status: res.statusCode,
                            data: result,
                            timestamps: APIUtil.getTimestamps()
                        });
                    });
            }
        } catch (error) {
            return ErrorUtil.sent500Status(req, res);
        }
    }
}