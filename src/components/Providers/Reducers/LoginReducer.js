export const LoginReducer = (user, action) => {
  switch (action.type) {
    case 'LOG_OUT':
      return { ...user, online: false };
    case 'LOG_IN':
      return { ...action.payload, online: true };
    case 'SIGN_UP':
      return { ...action.payload, online: true };
    default:
      return user;
  }
};
