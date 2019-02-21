export default {
  namespace: "compute",
  state: {
    count: 0,
  },
  reducer: {
    plus: state => ({
      count: state.count + 1,
    }),
    minus: state => ({
      count: state.count - 1,
    }),
  },
  effect: {
    asyncPlus: async actions => {
      setTimeout(() => actions.compute.plus(), 500);
    },
    asyncMinus: async actions => {
      setTimeout(() => actions.compute.minus(), 500);
    },
  },
};
