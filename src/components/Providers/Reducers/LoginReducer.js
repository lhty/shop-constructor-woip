export const LoginReducer = (user, action) => {
  switch (action.type) {
    case 'LOG_OUT':
      return (user = false);
    case 'LOG_IN':
      return action.payload;
    default:
      return user;
  }
};
