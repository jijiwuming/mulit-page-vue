/**
 * 模拟获取数据数组
 *
 * @returns {Promise}
 */
function getArrs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({
            list: [
                '苟全性命于乱世',
                '不求闻达于诸侯',
                '寄意寒星荃不察',
                '我以我血荐轩辕'
            ],
            length: 20
        })
    }, 500)
  })
}
export { getArrs }
