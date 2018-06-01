/**
 * banner列表model
 * 
 * @export
 * @class BannerModel
 */
export default class BannerModel {
    /**
     * Creates an instance of BannerModel.
     * @param {Array} [contents=[{url:"",open:""}]] banner数据列表；url：图片地址，open:跳转地址
     * @memberof BannerModel
     */
    constructor(contents = [{ url: "", open: "" }]) {
        this.contetns = [...contents];
    }

    /**
     * 向数据列表添加数据
     * 
     * @param {String} urlValue 图片地址
     * @param {String} openValue 跳转地址
     * @memberof BannerModel
     */
    add(urlValue, openValue) {
        this.contents.push({ url: urlValue, open: openValue });
    }

    /**
     * 获取数据列表
     * 
     * @returns 数据列表
     * @memberof BannerModel
     */
    get() {
        return this.contents;
    }
}