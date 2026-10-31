from google import genai

from app.config.settings import GEMINI_API_KEY, GEMINI_MODEL_NAME


class GeminiGenerator:
    def __init__(self):
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set in the environment.")

        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model_name = GEMINI_MODEL_NAME

    def generate(self, prompt: str) -> str:
        """
        Send a prompt to Gemini and return the generated response.
        """

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )

        return response.text