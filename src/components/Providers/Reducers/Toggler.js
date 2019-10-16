export const Toggler = (toggleWhat, action) => {
  switch (action.type) {
    case 'toggleCart':
      return {
        ...toggleWhat,
        toggleCart: !toggleWhat.toggleCart,
        toggleAuth: false
      };
    case 'toggleAuth':
      return {
        ...toggleWhat,
        toggleAuth: !toggleWhat.toggleAuth
      };
    case 'Clear':
      return {
        ...toggleWhat,
        toggleAuth: false,
        toggleCart: false
      };
    default:
      return toggleWhat;
  }
};
