# script to test the project

from src.agents.workflow import WorkflowAgent
from pydantic import BaseModel
from langchain_core.messages import HumanMessage


class Query(BaseModel):
    question: str


def extract_final_answer(result: dict) -> str:
    """
    Safely extract the final AI response from LangGraph output
    """
    messages = result.get("messages", [])

    # Traverse backwards to find last AI message with content
    for msg in reversed(messages):
        if hasattr(msg, "content") and msg.content:
            return msg.content

    return "No answer returned."


def query_agent(query: Query):
    try:
        workflow = WorkflowAgent(model="groq")
        agent = workflow.build_agent()

        result = agent.invoke({
            "messages": [HumanMessage(content=query.question)]
        })

        final_answer = extract_final_answer(result)

        return {
            "status": "success",
            "response": final_answer
        }

    except Exception as e:
        return {
            "status": "error",
            "response": str(e)
        }


if __name__ == "__main__":
    query = Query(question="Plan a 5 day trip to Lagos")

    response = query_agent(query)

    print("\n=== FINAL RESPONSE ===\n")
    print(response["response"])