export default async function (request, context) {
  try {
    const keyContext = context?.env?.GEMINI_API_KEY;
    const keyProcess = process.env.GEMINI_API_KEY;
    const hasKeyContext = Boolean(keyContext);
    const hasKeyProcess = Boolean(keyProcess);
    const lenContext = typeof keyContext === "string" ? keyContext.length : 0;
    const lenProcess = typeof keyProcess === "string" ? keyProcess.length : 0;
    const effective = keyContext || keyProcess ? "present" : "missing";
    return new Response(
      JSON.stringify({
        ok: true,
        context: { hasKey: hasKeyContext, length: lenContext },
        process: { hasKey: hasKeyProcess, length: lenProcess },
        effective,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "env-check failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
