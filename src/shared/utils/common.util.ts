/**
 * 数据分组
 * @param data
 * @param key
 * @returns
 */
export function groupBy(data: any[], key: string): { [key: string]: any[] } {
  return data.reduce((result, item) => {
    result[item[key] || ''] = [
      ...(result[item[key] || ''] || []),
      item
    ]
    return result
  }, {})
}
