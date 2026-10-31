const API_BASE_URL = "http://127.0.0.1:8000";

export async function askQuestion(question, messages = []) {
  try {
    const conversation = messages.map((message) => ({
      role: message.role,
      text: message.text,
    }));

    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        messages: conversation,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Error communicating with backend:", error);
    throw new Error(
      error.message || "Unable to connect to the Tax Assistant backend."
    );
  }
}

export async function uploadDocument(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || `Upload failed: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Document upload error:", error);
    throw new Error(
      error.message || "Unable to upload the document."
    );
  }
}