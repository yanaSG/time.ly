type Tokens = {
    access: string;
    refresh: string;
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token');
};

export const setTokens = (tokens: Tokens): void => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
};

export const clearTokens = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};