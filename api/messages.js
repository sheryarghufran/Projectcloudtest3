export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5.4",
      messages: req.body.messages,
    }),
  });

  const data = await response.json();
  res.json(data);
}
