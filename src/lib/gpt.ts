// Generate GPT content for a book
export async function generateBookContent(prompt: string, messages: any[]) {
  try {
    const response = await fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error generating content:", error);
    return "I'm having trouble generating content right now. Please try again later.";
  }
}

