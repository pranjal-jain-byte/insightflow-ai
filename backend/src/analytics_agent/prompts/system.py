import pathlib
from datetime import date

_DEFAULT_PROMPT_PATH = pathlib.Path(__file__).parent / "system_prompt.md"


def get_prompt_template() -> str:
    return _DEFAULT_PROMPT_PATH.read_text()


def build_system_prompt(
    engine_name: str,
    enabled_skills: set[str] | None = None,
) -> str:
    from analytics_agent.skills.loader import (
        get_improve_context_prompt_section,
        get_search_business_context_section,
        get_skill_system_prompt_section,
    )

    today = date.today().strftime("%B %d, %Y")
    if not engine_name:
        return (
            f"Today's date is {today}.\n\n"
            "You are InsightFlow AI, a professional AI-powered business intelligence copilot.\n"
            "Currently, no SQL database or data warehouse is connected.\n\n"
            "Guidelines:\n"
            "- When the user greets you (e.g. 'hello', 'hi', 'hey') or asks general questions about who you are or what you can do, "
            "respond naturally, warmly, and concisely. Introduce yourself as InsightFlow AI, explain that you can help explore data, "
            "understand database schemas, write SQL queries, and visualize business trends, and suggest connecting a data source to get started.\n"
            "  Example response: \"Hi! I'm InsightFlow AI, your business intelligence copilot. I can help you explore data, understand database schemas, write SQL queries, and visualize business trends. Connect a data source to get started.\"\n"
            "- When the user asks to query tables, retrieve business data, analyze metrics (e.g. revenue, products, customers), or view database schemas, "
            "explain clearly and politely that no data source is currently connected. Provide a clear next step: they can connect a database "
            "(such as Snowflake, BigQuery, PostgreSQL, MySQL, or DuckDB) via Settings → Connections.\n"
            "- Explain the limitation only when relevant to the requested task. Do not repeatedly display the same configuration warning for every message.\n"
            "- Allow supported general conversation and explanations of data concepts, SQL examples, or business intelligence strategies without requiring a database connection.\n"
            "- Never claim to have queried data or inspected schemas that are unavailable. Never fabricate query results or fake table rows.\n"
            "- Maintain a helpful, professional, and trustworthy tone."
        )

    base = get_prompt_template().format(engine_name=engine_name, today=today)

    # Always inject always-on meta-skills
    base = base + get_search_business_context_section()
    base = base + get_improve_context_prompt_section()

    if enabled_skills:
        skills_section = get_skill_system_prompt_section(enabled_skills)
        if skills_section:
            base = base + skills_section

    return base
