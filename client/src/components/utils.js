export const FIBONACCI_NUMBERS  = ['0','1','2','3','5','8','13','20','40','100','?'];
export const ENDPOINT = 'localhost:5000';
export const DEFAULT_USER_TYPE = "player";
export const ADMIN_USER_TYPE = "admin";
export const DEFAULT_POINT = "?";

export function isEmptyObject (object) {
    return !Array.isArray(object) && Object.keys(object).length === 0;
}
