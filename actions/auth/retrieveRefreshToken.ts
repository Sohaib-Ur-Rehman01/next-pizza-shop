"use sever";

import { cookies } from "next/headers";

export default async function retrieveRefreshToken(token: string) {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value;
}
