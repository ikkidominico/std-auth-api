import querystring from "node:querystring";

export type GoogleTokensResult = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    id_token: string;
    error: string;
    error_descriptions: string;
};

export type GoogleUserResult = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
};

export class GoogleOAuthService {
    async getGoogleOAuthTokens(code: string): Promise<GoogleTokensResult> {
        const googleTokensUrl = "https://oauth2.googleapis.com/token";

        const values = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
            grant_type: "authorization_code",
        };

        const url = `${googleTokensUrl}?${querystring.stringify(values)}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            const json = await response.json();
            return json as GoogleTokensResult;
        } catch {
            throw new Error("Failed to fetch Google OAuth tokens.");
        }
    }

    async getGoogleUser(
        idToken: string,
        accessToken: string,
    ): Promise<GoogleUserResult> {
        try {
            const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            const json = await response.json();
            return json as GoogleUserResult;
        } catch {
            throw new Error("Failed to fetch Google user informations.");
        }
    }
}
