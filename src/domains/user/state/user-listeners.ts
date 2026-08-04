export const registerUserListeners = (listenerMiddleware: ReturnType<typeof createListenerMiddleware>) => {
  listenerMiddleware.startListening({
    actionCreator: UserEvents.upsertUserRequested,