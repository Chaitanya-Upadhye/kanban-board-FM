import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { createServerClient, parse, serialize } from "@supabase/ssr";
let supabase: any | null = null;

export const getSupabase = ({ request }: { request: Request }) => {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();
  // Initialize Supabase client here
  supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );

  return supabase;
};
export async function getSession({ request }: { request: Request }) {
  const supabase = getSupabase({ request });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function requireUserSession(request: Request) {
  // get the session
  const session = await getSession({ request });

  // validate the session, `userId` is just an example, use whatever value you
  // put in the session when the user authenticated
  if (!session?.user) {
    // if there is no user session, redirect to login
    throw redirect("/login");
  }

  return session;
}
