function clean(value, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

async function sendToFollowUpBoss(lead) {
  const apiKey = process.env.FUB_API_KEY;

  if (!apiKey) {
    throw new Error("Follow Up Boss is not configured.");
  }

  const [firstName, ...rest] = lead.name.split(" ");
  const lastName = rest.join(" ") || "";

  const auth = Buffer.from(`${apiKey}:`).toString("base64");

  const response = await fetch("https://api.followupboss.com/v1/events", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "X-System": "Quatrillionaire Website",
      "X-System-Key": apiKey
    },
    body: JSON.stringify({
      source: lead.source || "quatrillionaire.com",
      type: "General Inquiry",
      person: {
        firstName,
        lastName,
        emails: lead.email ? [{ value: lead.email }] : [],
        phones: lead.phone ? [{ value: lead.phone }] : []
      },
      message: [
        lead.interest ? `Interest: ${lead.interest}` : null,
        lead.language ? `Language: ${lead.language}` : null,
        lead.message || null
      ].filter(Boolean).join(" | ")
    })
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Follow Up Boss error:", body);
    throw new Error("Follow Up Boss notification failed.");
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const lead = {
    name: clean(req.body?.name, 120),
    email: clean(req.body?.email, 254),
    phone: clean(req.body?.phone, 50),
    interest: clean(req.body?.interest, 100),
    language: clean(req.body?.language, 50),
    message: clean(req.body?.message, 2000),
    source: clean(req.body?.source, 50)
  };

  if (!lead.name || (!lead.email && !lead.phone)) {
    return res.status(400).json({
      error: "Please include your name and at least an email address or phone number."
    });
  }

  try {
    await sendToFollowUpBoss(lead);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "The form could not send right now. Please try again."
    });
  }
}
