const fse = require("fs-extra");
const path = require("path");
const { scanDir } = require("@fremango/dir-tree");

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

/* 不同的route结构集合 */
const layout = [],
  author = [],
  both = [],
  none = [];

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
  console.log("INFO: ", info);

  info.forEach(child => {
    const { isDir, children, layout, author, component } = child;
    if (!isDir || (!children && !component)) return true;
    if (children) {
      const cleanChildren = [];

      children.forEach(item => {
        const { layout, author, isDir } = item;
        if (isDir && (layout || author)) {
          parsePage([item]);
        } else {
          cleanChildren.push(item);
        }
      });

      // console.log("cleanChildren: ", cleanChildren);
      child.children = cleanChildren;
      if (layout && !author) pushToCollection(child, "layout");
      if (author && !layout) pushToCollection(child, "author");
      if (author && layout) pushToCollection(child, "both");
      if (!author && !layout) cleanChildren.forEach(item => none.push(item));
    } else {
      // no children buy has component
      if (layout) {
        pushToCollection(child, "layout");
      } else {
        none.push(child);
      }
    }
  });
};

const pushToCollection = (item, collectionType) => {
  if (collectionType === "none") none.push(item);
  if (collectionType === "layout") {
    const index = scanSameOne(layout, [{ key: "layout", value: item.layout }]);
    if (index >= 0) {
      layout[index].children.push(item);
    } else {
      layout.push({
        layout: item.layout,
        children: [item],
      });
    }
  }
  if (collectionType === "author") {
    const index = scanSameOne(author, [{ key: "author", value: item.author }]);
    if (index >= 0) {
      author[index].children.push(item);
    } else {
      author.push({
        author: item.author,
        children: [item],
      });
    }
  }
  if (collectionType === "both") {
    const index = scanSameOne(both, [
      { key: "author", value: item.author },
      { key: "layout", value: item.layout },
    ]);
    if (index >= 0) {
      both[index].children.push(item);
    } else {
      both.push({
        author: item.author,
        layout: item.layout,
        children: [item],
      });
    }
  }
};

const scanSameOne = (collection, querys) => {
  for (let index = 0; index < collection.length; index++) {
    const item = collection[index];
    let count = 0;

    querys.forEach(query => {
      const { key, value } = query;

      if (item[key] === value) {
        count += 1;
      }
    });

    if (count === querys.length) return index;
  }

  return -1;
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
  let result = scanDir(
    {
      dir: pagesPath,
    },
    item => {
      const { path: dirPath, isDir, title, children } = item;
      let result = { title, isDir };

      /* 处理相对路径 */
      let relativePath = `/${path.relative(pagesPath, dirPath)}`;
      result.path = getUrlPath({ path: relativePath, isDir, title });

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

                if (!layout && isLayoutFile(title)) layout = `${relativePath}/${title}`;
                if (!author && isAuthorFile(title)) author = `${relativePath}/${title}`;
                if (!index && isIndexFile(title)) index = `${relativePath}/${title}`;

                if (layout || author || index) return false;
                return child;
              }
            }
          })
          .filter(item => item);

        if (index) result.component = index;
        if (layout) result.layout = layout;
        if (author) result.author = author;

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
    });

    glob.children = result;
    parsePage([glob]);
  } else {
    parsePage(result);
  }

  fse.writeJsonSync(
    path.join(plumePath, "_pagesInfo.json"),
    { none, layout, author, both },
    {
      spaces: 2,
    },
  );
};
