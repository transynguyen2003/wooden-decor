import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function RootRedirectPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const targetLocale = savedLocale === "en" ? "en" : "vi";
  redirect(`/${targetLocale}`);
}
