export default class APIUtil {

    public static getTimestamp(): string {
        return new Date().toLocaleTimeString();
    }

    public static generateUniqueId(): string {
        return "yxxx-4xx-xxxxxx".replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public static async sleep(ms): Promise<any> {
        new Promise(res => setTimeout(res, ms));
    }

    public static getMultipleElementsFromArray(array: string[], amount: number) {
        return array.slice(0, amount)
    }

    public static shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }
        return array;
    }

    public static replaceAll(str: string, find, replace) {
        return str.replace(new RegExp(find, "g"), replace);
    }

    public static setCharAt(str, index, chr) {
        if (index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }
}