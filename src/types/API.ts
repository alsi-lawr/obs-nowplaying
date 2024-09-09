export type APIResult<T> = {
  result: T | null;
  status: number;
};

export const OK: APIResult<string> = {
  result: "OK",
  status: 200,
};

export function Success<T>(result: T): APIResult<T> {
  return {
    result,
    status: 200,
  };
}

export function Error<T>(error: T): APIResult<T> {
  return {
    result: error,
    status: 500,
  };
}

export function NotFound<T>(error: T): APIResult<T> {
  return {
    result: error,
    status: 404,
  };
}

export function BadRequest<T>(error: T): APIResult<T> {
  return {
    result: error,
    status: 400,
  };
}
