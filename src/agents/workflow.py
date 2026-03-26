from src.utils.model_loader import ModelLoader
from src.tools.weather_info import WeatherInfoTool
from src.tools.place_search import PlaceSearchTool
from src.tools.currency_converter import CurrencyConverterTool
from src.tools.expense_calculator import ExpenseCalculatorTool
from src.prompts.system_prompt import SYSTEM_PROMPT
from langgraph.graph import StateGraph, MessagesState, END, START
from langgraph.prebuilt import ToolNode, tools_condition


class WorkflowAgent():
    def __init__(self, model: str = "groq"):
        # Initialize all tools for the agent
        self.tools = (
                WeatherInfoTool().get_tools()
                + PlaceSearchTool().get_tools()
                + CurrencyConverterTool().get_tools()
                + ExpenseCalculatorTool().get_tools()
            ) 
        
        # Load the language model
        model_loader = ModelLoader(model=model)
        llm = model_loader.load_llm()
        self.llm_with_tools = llm.bind_tools(self.tools)
        
        self.system_prompt = SYSTEM_PROMPT # Initialize the system prompt

    def agent_function(self, state: MessagesState):
        """Main agent function"""
        user_question = state["messages"]
        input_question = [self.system_prompt] + user_question
        response = self.llm_with_tools.invoke(input_question)
        return {"messages": [response]}

    def build_agent(self):
        graph = StateGraph(MessagesState)
    
        # Define nodes and edges
        graph.add_edge(START, "agent")
        graph.add_node("agent", self.agent_function)
        graph.add_node("tools", ToolNode(tools=self.tools))
        graph.add_edge(START, "agent")
        graph.add_conditional_edges("agent", tools_condition)
        graph.add_edge("tools", "agent")
        graph.add_edge("agent", END)
        self.agent = graph.compile()
        return self.agent
        

    def __call__(self, *args, **kwds):
        return self.build_agent() # Build the agent workflow
    
if __name__ == "__main__":
    workflow = WorkflowAgent(model="groq")
    agent = workflow.build_agent()
    result = agent.invoke({
        "messages": ["Plan a 5 day trip to Lagos"]
    })
    print(result)