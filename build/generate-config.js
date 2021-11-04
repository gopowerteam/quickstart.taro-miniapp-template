const path = require('path')
const fs = require('fs')

const ROOT_PATH = path.join(__dirname, '..', 'src')
const MAIN_PACKAGE_PATH = path.join(ROOT_PATH, 'pages')
const SUB_PACKAGE_PATH = path.join(ROOT_PATH, 'packages')

/**
 * 生成Page数据
 * @param {*} package
 */
function generatePages(pages) {
  const directory = path.join(MAIN_PACKAGE_PATH)

  fs.readdirSync(directory)
    .filter(page => {
      const stat = fs.statSync(path.join(MAIN_PACKAGE_PATH, page))
      return stat.isDirectory()
    })
    .forEach(function(page) {
      pages.push(`/pages/${page}/index`)
    })
}

function generatePackage(packages, package) {
  const directory = path.join(PACKAGE_ROOT, package, 'pages')
  const pages = []

  fs.readdirSync(directory)
    .filter(page => {
      const stat = fs.statSync(path.join(PACKAGE_ROOT, package))
      return stat.isDirectory()
    })
    .forEach(function(page) {
      pages.push(`pages/${page}/${page}`)
    })

  packages.push({
    root: `packages/${package}`,
    pages: pages
  })
}

// 分包目录
const subPackages = []
// 主包目录
const mainPackage = []

// 获取主包列表
generatePages(mainPackage)

// 获取分包列表
if (fs.existsSync(SUB_PACKAGE_PATH)) {
  fs.readdirSync(SUB_PACKAGE_PATH).forEach(function(package) {
    const stat = fs.statSync(path.join(SUB_PACKAGE_PATH, package))

    if (!stat.isDirectory()) return

    generatePackage(packages, subPackages)
  })
}

module.exports = {
  pages: mainPackage,
  subpackages: subPackages
}
