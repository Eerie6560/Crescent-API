import path from "path";
import Canvas from "canvas";

export default class AvatarUtil {

    /*
    @param image string: img URL
    @param flair string: img path
    @comment first parameter here will be the back image, second will be front.
     */

    public static async getFlairedAvatar(flair: string, image: string, base64?: boolean): Promise<string | Buffer> {

        /*
        @description Gets the appropriate path based on the flair parameter.
        */

        const type = path.join(__dirname, `../../public/assets/lgbtq/flairs/${flair}.png`);

        const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage(type);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        /*
        @description: Draws the circular crop of the provided image.
        @param x: x value of the circle's center.
        @param y: y value of the circle's center.
        @param radius: the radius of the crop.
        @param startAngle: the point of which to start the crop.
        @param endAngle: where to end the angle.
         */

        ctx.beginPath();
        ctx.arc(250, 250, 175, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(decodeURI(image));
        ctx.drawImage(avatar, 75, 60, 350, 375);

        /*
        Returns the avatar as a base64 string.
        @return string
         */

        if (base64) {
            return canvas.toDataURL();
        } else {
            return canvas.toBuffer();
        }
    }
}