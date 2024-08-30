
export const useAuthRedirect = () => {

  const user = sessionStorage.getItem('user');
  if (user === null) {
    window.location.href = "/";
  }

};



