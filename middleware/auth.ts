export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, session } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/");
  }

  // if (!session.value?.user?.name && loggedIn.value) {
  //   return navigateTo("/");
  // }
});
