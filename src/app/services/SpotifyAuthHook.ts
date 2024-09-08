import { AuthorizationProperties } from "@/types/SpotifyProperties";
import { PrismaClient } from "@prisma/client";

export const sqlClient: PrismaClient = new PrismaClient({
  // log: ["query", "info", "warn", "error"],
});

export function getAuthUrl(properties: AuthorizationProperties): string {
  return `${properties.authorizationAddress}?client_id=${properties.spotifyClientId}&response_type=${properties.responseType}&redirect_uri=${properties.callbackAddress}&scope=${properties.scopes}`;
}

export async function storeToken(token: string) {
  console.log(`Storing token: ${token}`);
  await sqlClient.refreshToken.deleteMany();
  await sqlClient.refreshToken.create({
    data: {
      token: token,
    },
  });
}

export async function queryRefreshToken(): Promise<string | null> {
  const token = await sqlClient.refreshToken.findFirst();
  return token?.token ?? null;
}
