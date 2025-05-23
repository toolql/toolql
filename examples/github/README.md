# Sample tools for Github API

Provides a set of tools to enable an agent to answer questions about your Gihub repositories and activity.

## You could ask...

How many repositories do I have access to?

What repositories have I committed to this week?

etc...

In addition to query-based tools such as these, this toolkit includes a mutation to add a star to any project, including special handling for the `toolql` project to express our gratitude. Please consider giving us a star, thanks!

## Config

Copy the `.env.template` file in this directory to `.env` and configure the following environment variables:

GRAPHQL-BEARER

This variable sets the `Authorization: bearer` header value for GraphQL API access.

Generate a token for your Github account here:

https://github.com/settings/tokens

(Select Classic)

OPENAI_API_KEY

Generate a key for you OpenAI account:

https://platform.openai.com/api-keys
