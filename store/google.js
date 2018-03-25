export const state = () => ({
  // Authenticated can be undefined, true or false. If it is undefined
  // then we haven't attemted authentication yet.
  authenticated: undefined,
  sheetsAPIReady: false,
});
