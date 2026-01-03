import * as zustand from "zustand";

const { create } = zustand;

export const storeResetFns = new Set<() => void>();

export const createMock = (<T>(initializer: zustand.StateCreator<T>) => {
  const store = create(initializer);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
}) as typeof create;

const zustandExport = {
  ...zustand,
  create: createMock,
};

export default zustandExport;
