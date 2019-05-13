const path = require("path");
const { isObject, deepAssign, isExist, isDir, relativePostion } = require("../");

/* test isObject */
describe("===> isObject <===", () => {
  test("{} -> true", () => {
    expect(isObject({})).toBe(true);
  });

  test("[] -> false", () => {
    expect(isObject([])).toBe(false);
  });

  test("'123' -> false", () => {
    expect(isObject("123")).toBe(false);
  });

  test("null -> false", () => {
    expect(isObject(null)).toBe(false);
  });

  test("() => {} -> false", () => {
    expect(isObject(() => {})).toBe(false);
  });

  test("NaN -> false", () => {
    expect(isObject(NaN)).toBe(false);
  });

  test("undefined -> false", () => {
    expect(isObject(undefined)).toBe(false);
  });
});

/* test deepAssign */
describe("===> deepAssign <===", () => {
  test("{name: 1} && {name: 2}", () => {
    expect(deepAssign({ name: 1 }, { name: 2 })).toEqual({ name: 2 });
  });

  test("{user: {name: 1}} && {user : {name: 2}}", () => {
    expect(deepAssign({ user: { name: 1 } }, { user: { name: 2 } })).toEqual({ user: { name: 2 } });
  });

  test("{user: {name: 1}} && {user : {name: 2}, age: 1}", () => {
    const result = deepAssign({ user: { name: () => 1 } }, { user: { name: 2 }, age: 1 });
    expect(result.age).toBe(1);
  });

  test("{user: {name:() => 1}} && {user: {name:() => 2}}", () => {
    const result = deepAssign({ user: { name: () => 1 } }, { user: { name: () => 2 } });
    expect(result.user.name()).toBe(2);
  });
});

/* test isExist */
describe("===> isExist <===", () => {
  test("test for exist dir", () => {
    expect(isExist(path.resolve(__dirname, "..", "index.js"))).toBe(true);
  });

  test("test for no exist dir", () => {
    expect(isExist(path.resolve(__dirname, "..", "index.jsx"))).toBe(false);
  });
});

/* test isDir */
describe("===> isDir <===", () => {
  test("test for dir", () => {
    expect(isDir(path.resolve(__dirname, "..", "scripts"))).toBe(true);
  });

  test("test for file", () => {
    expect(isDir(path.resolve(__dirname, "..", "index.js"))).toBe(false);
  });

  test("test for no exist dir", () => {
    expect(isDir(path.resolve(__dirname, "..", "aabbcc"))).toBe(false);
  });
});
