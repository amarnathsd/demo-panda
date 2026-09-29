// Receives enquiries from the request dialog and the contact page form.
// TODO: forward to email / CRM (e.g. theflyingpanda.io@gmail.com).
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "A valid email is required" }, { status: 422 });
  }

  console.info("[request]", JSON.stringify(body));
  return Response.json({ ok: true });
}
