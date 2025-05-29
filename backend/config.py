from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    DEEPSEEK_KEY = os.getenv("CHUTES_API_TOKEN")