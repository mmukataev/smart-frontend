export async function GET(req) {
  const res = await fetch("https://admission.apa.kz/api/check_access", {
    headers: {
      Authorization: req.headers.get("authorization") || "",
    },
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
