from __future__ import annotations

import pytest
from analytics_agent.agent.graph import build_graph
from analytics_agent.prompts.system import build_system_prompt


def test_no_engine_system_prompt_branding_and_guidance():
    prompt = build_system_prompt("")
    assert "InsightFlow AI" in prompt
    assert "business intelligence copilot" in prompt
    assert "Settings \u2192 Connections" in prompt or "Settings" in prompt
    # Verifies guidelines for greetings and general questions
    assert "hello" in prompt.lower()
    assert "Never claim to have queried data" in prompt


def test_build_graph_no_engine_succeeds_with_empty_engine_tools():
    # Calling build_graph with engine_name="" and engine=None should NOT raise ValueError
    graph = build_graph(engine_name="", engine=None)
    assert graph is not None


def test_configured_engine_system_prompt_format():
    prompt = build_system_prompt("test_snowflake")
    assert "test_snowflake" in prompt
