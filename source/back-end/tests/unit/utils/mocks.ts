export function createMock<T extends { execute: (...args: any[]) => any }>() {

  const executeMock = vi.fn();
  const usecase = {
    execute: executeMock,
  } as unknown as T;

  return {
    usecase,
    executeMock,
  };
}
