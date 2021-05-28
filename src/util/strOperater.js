/**
 * @Description:
 * @date 2021/2/1
 * @params
 */

/**
 *  处理过长字符串，返回缩写, 中文算两个
 * @param text
 * @param opts {maxLength: 表示最大长度}
 * @returns {string|*}
 */
export function simplifyStr(text, opts) {
  const maxLength = opts.maxLength || 10;
  text = text.trim();
  const checkRes = checkLength(text, maxLength);
  if (checkRes.sum < maxLength * 2) {
    return text;
  }
  return `${text.slice(0, checkRes.maxLoc - 2)}...`;
}
/**
 *  判断长度（汉字算两个）, 返回总字符数量，以及超出最大字符数的位置
 * @param strTemp 字符
 * @param maxLimit 最大字符数
 * @returns {{maxLoc: number, sum: number}}
 */
export function checkLength(strTemp, maxLimit) {
  let i;
  let maxLoc;
  let sum = 0;
  for (i = 0; i < strTemp.length; i++) {
    strTemp.charCodeAt(i) >= 0 && strTemp.charCodeAt(i) <= 255 ? sum++ : (sum += 2);
    if (sum <= maxLimit * 2) maxLoc = i;
  }
  return { sum, maxLoc };
}
