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

const collection = [{ name: "zbp", age: 18 }, { name: "zbp", age: 1 }, { name: "zbp", age: 2 }];
const querys = [{ key: "name", value: "zbp" }, { key: "age", value: 11 }];

console.log("Scan: ", scanSameOne(collection, querys));
