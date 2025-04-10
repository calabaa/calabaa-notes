from bilibili_api import search, sync
from mcp.server.fastmcp import FastMCP

mcp = FastMCP('Bilibili Mcp Server')

@mcp.tool()
def general_search(keyword: str) -> dict:
    """
    Search Bilibili API with the givern keyword.
    Args:
        keyword: Search term to look for on Bilibili
    Returns:
        Dictionary containing search results from Bilibili API
    """
    return sync(search.search(keyword))
# def main():
#     print("Hello from b-mcp-server!")


if __name__ == "__main__":
    mcp.run(transport='stdio')
