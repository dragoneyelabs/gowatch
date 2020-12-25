export const state = () => ({
  watches: [],
});

export const getters = {
  watches: state => state.watches,
};

export const mutations = {
  addWatch(state, watch) {
    state.watches.push(watch);
  },

  removeWatch(state, watch) {
    state.watches = state.watches.filter(v => v.id !== watch.id);
  },

  clearWatches(state) {
    state.watches = [];
  },
};
