export const getTokenFromLocalStorage = (): string => {
    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token") || "";
    }
    return token;
};

export const getApisHeaders = (): { headers: { "Content-Type": string; authorization: string } } => {
    const token = getTokenFromLocalStorage();
    return {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    };
};