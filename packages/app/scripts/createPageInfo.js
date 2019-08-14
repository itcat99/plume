const fse = require("fs-extra");
const path = require("path");
const { scanDir } = require("@fremango/dir-tree");
const { normalizedPath } = require("@plume/helper");

const isLayoutFile = title => !!title.match(/^_(L|l)ayout\.(js|jsx)$/);
const isAuthorFile = title => !!title.match(/^_(A|a)uthor\.(js|jsx)$/);
const isIndexFile = title => !!title.match(/^(I|i)ndex\.(js|jsx)$/);
const isJsFile = title => !!title.match(/\.(js|jsx)$/);

/**
 * 获取路由的url地址
 * @param {object} info 目录的结构信息
 */
const getUrlPath = info => {
  const { path: dirPath, isDir, title } = info;
  if (isDir && title.match(/^(H|h)ome/)) return "/";

  let name = title;
  const parentPath = dirPath.slice(0, dirPath.indexOf(title) - 1);

  if (!isDir) {
    const titleArr = title.split(".");
    titleArr.pop();
    name = titleArr.join(".");
  }

  name = getDynamicName(name);
  return `${parentPath}/${name}`;
};

/**
 * 获取动态路由的url路径名称
 * $id --> :id
 * id$ --> :id?
 *
 * @param {string} name 文件名称
 * @return {string}
 */
const getDynamicName = name => {
  return name.match(/^\$.*[^$]$/)
    ? `:${name.slice(1)}`
    : name.match(/^[^$].*\$$/)
    ? `:${name.slice(0, -1)}?`
    : name;
};

/* routes 集合
  如果既没有layout也没有author 放入none
  否则放入各自相应的layout或author或layout&&author的数组内
*/
let routesCollection = {
  none: [],
};

/**
 * 处理目录结构
 * 分布到4个不同的数组对象 [layout],[author],[both],[none] 这些都作为 根节点
 * 判断依据：
 *  - 只有layout放到layout
 *  - 只有author放到author
 *  - 都有放到both
 *  - 都没有放到none
 *  如果有children的话，同时要判断它的子目录，子目录有author 或 layout 将子目录从children删除
 *
 * @param {object} info
 */
const parsePage = info => {
  info.forEach(child => {
    const { children, layout, author, component } = child;

    if (!children && !component) return true;
    if (children) {
      child.children = getCleanChildren(children);
    }

    if (layout && !author) pushToCollection(child, "layout");
    if (author && !layout) pushToCollection(child, "author");
    if (author && layout) pushToCollection(child, "both");
    if (!author && !layout) pushToCollection(child, "none");
  });
};

const getCleanChildren = routes => {
  let cleanChildren = [];
  routes.map(route => {
    const { isDir, layout, author, children, component, path: url } = route;
    if (layout || author) {
      parsePage([route]);
    } else if (isDir && children && children.length) {
      cleanChildren.push({
        path: url,
        component,
        children: getCleanChildren(children),
      });
    } else {
      cleanChildren.push({ path: url, component });
    }
  });

  return cleanChildren;
};

const pushToCollection = (item, collectionType) => {
  const { path: url, component, children, layout, author } = item;
  let key,
    route = { path: url };

  if (component) route.component = component;
  if (children) route.children = children;

  switch (collectionType) {
    case "none":
      key = collectionType;
      break;
    case "layout": {
      key = `${url}_${layout}`;
      route.layout = layout;
      break;
    }
    case "author": {
      key = `${url}_${author}`;
      route.author = author;
      break;
    }
    case "both": {
      key = `${url}_${author}_${layout}`;
      route = Object.assign({}, route, { layout, author });
      break;
    }
    default:
      break;
  }

  if (collectionType === "none") {
    const { children } = route;
    delete route.children;

    if (children) {
      routesCollection[key] = [].concat(routesCollection[key], [route], children);
    } else {
      routesCollection[key].push(route);
    }
  } else if (routesCollection[key]) {
    routesCollection[key].push(route);
  } else {
    routesCollection[key] = [route];
  }
};

const sortRoutes = routes => {
  routes.sort((a, b) => {
    let _a = a.path.match(/\/./g);
    let _b = b.path.match(/\/./g);

    if (a.children) a.children = sortRoutes(a.children);
    if (b.children) b.children = sortRoutes(b.children);

    _a = _a ? _a.length : _a * 1;
    _b = _b ? _b.length : _b * 1;

    return _b - _a;
  });

  return routes;
};

module.exports = (pagesPath, plumePath) => {
  /**
   * return {
   *  title:
   *  isDir:
   *  path:
   *  component:
   *  layout:
   *  author:
   *  children:
   *
   * }
   */

  /* clean collecton */
  routesCollection = {
    none: [],
  };

  let result = scanDir(
    {
      dir: pagesPath,
    },
    item => {
      const { path: dirPath, isDir, title, children } = item;
      let result = { title, isDir };

      /* 处理相对路径 */
      let relativePath = `/${path.relative(pagesPath, dirPath)}`;
      result.path = getUrlPath({
        path: normalizedPath(relativePath),
        isDir,
        title,
      });

      /* 如果是dir 则处理 children&&author&&layout&&component的部分 */
      if (children && children.length > 0) {
        let layout, author, index;

        const _children = children
          .map(child => {
            if (child) {
              if (child.isDir) {
                return child;
              } else {
                /* 过滤除了.js|.jsx以外 不为目录的文件 */
                const { title } = child;
                if (!isJsFile(title)) return false;

                if (!layout && isLayoutFile(title)) {
                  layout = `${relativePath}/${title}`;
                  return;
                }
                if (!author && isAuthorFile(title)) {
                  author = `${relativePath}/${title}`;
                  return;
                }
                if (!index && isIndexFile(title)) {
                  index = `${relativePath}/${title}`;
                  return;
                }

                return child;
              }
            }
          })
          .filter(item => item);

        if (index) result.component = normalizedPath(index);
        if (layout) result.layout = normalizedPath(layout);
        if (author) result.author = normalizedPath(author);

        if (_children && _children.length > 0) result.children = _children;
      }

      /* 处理不为dir时的component路径 */
      if (!isDir) {
        let parentPath = relativePath.split("/");
        parentPath.pop();
        parentPath = parentPath.join("/");
        result.component = `${parentPath}/${result.title}`;
      }

      return result;
    },
  );

  let glob;

  result = result.filter(child => {
    const { title, component } = child;
    if (isLayoutFile(title)) {
      glob = Object.assign({}, glob, {
        layout: component,
      });
    } else if (isAuthorFile(title)) {
      glob = Object.assign({}, glob, {
        author: component,
      });
    } else {
      return child;
    }
  });

  if (glob) {
    glob = Object.assign({}, glob, {
      title: "__GLOB__",
      isDir: true,
      path: "/",
    });

    glob.children = result;
    parsePage([glob]);
  } else {
    parsePage(result);
  }

  let pagesInfo = [];
  for (const key of Object.keys(routesCollection)) {
    const collection = routesCollection[key];
    pagesInfo = [].concat(pagesInfo, collection);
  }

  pagesInfo = sortRoutes(pagesInfo);

  fse.writeJsonSync(normalizedPath(path.join(plumePath, "pagesInfo.json")), pagesInfo, {
    spaces: 2,
  });
};
