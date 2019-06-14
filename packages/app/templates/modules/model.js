export default {
  namespace: "NAME",
  state: 0,
  reducer: {
    plus: state => state + 1,
    minus: state => state - 1,
  },
  effect: {
    asyncPlus: actions => {
      setTimeout(() => actions["NAME"].plus(), 300);
    },
    asyncMinus: actions => {
      setTimeout(() => actions["NAME"].minus(), 300);
    },
  },
};
