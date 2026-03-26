from fastapi import FastAPI
from src.agents.workflow import WorkflowAgent
from pydantic import BaseModel
from starlette.responses import JSONResponse
from langchain_core.messages import HumanMessage
from fastapi.middleware.cors import CORSMiddleware
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Initialize FastAPI app
app = FastAPI(title="VagaBot API", version="1.0.0")

# CORS middleware (allow all origins for now, restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global agent (initialized on startup)
agent = None

# Pydantic model for incoming query
class Query(BaseModel):
    question: str
    budget: str | None = None
    travelers: int | None = 1

# Helper function to extract final answer from LangGraph output
def extract_final_answer(result: dict) -> str:
    messages = result.get("messages", [])

    for msg in reversed(messages):
        if hasattr(msg, "content") and msg.content:
            return msg.content

    return "No answer returned."

# Startup event to initialize the agent
@app.on_event("startup")
def startup_event():
    global agent
    logging.info("Initializing WorkflowAgent...")
    workflow = WorkflowAgent(model="groq")
    agent = workflow.build_agent()

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}

# API endpoint to handle trip planning queries
@app.post("/api/v1/plan-trip")
async def query_agent(query: Query):
    logging.info(f"Received query: {query.question} | Budget: {query.budget} | Travelers: {query.travelers}")   
    try:
        logging.info("Invoking agent...")
        result = agent.invoke({
            "messages": [HumanMessage(content=query.question)]
        })

        logging.info("Agent invocation completed. Extracting final answer...")
        final_answer = extract_final_answer(result)

        return {
            "status": "success",
            "data": {
                "query": query.question,
                "response": final_answer
            }
        }

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )