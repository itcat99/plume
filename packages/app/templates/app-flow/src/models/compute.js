export default {
  namespace: "compute",
  state: 0,
  reducer: {
    plus: state => state + 1,
    minus: state => state - 1,
  },
  effect: {
    plusAsync: async (payload, actions) => {
      setTimeout(() => {
        actions.compute.plus();
      }, 300);
    },
    minusAsync: async (payload, actions) => {
      setTimeout(() => {
        actions.compute.minus();
      }, 300);
    },
  },
};
