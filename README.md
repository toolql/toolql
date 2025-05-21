![](./res/toolql-logo-close.png)

> A.I. for GraphQL

*Rapidly deploy intelligent agents for your business data services*

Step 1: Set connections in `toolql.json`

```json
{
  "graphql": {
    "url": "https://swapi-graphql.netlify.app/graphql"
  },
  "llm": {
    "provider": "OpenAI",
    "apiKey": "<API_KEY_GOES_HERE>"
  }
}
```

Step 2: Define agent tools in `toolql.graphql`

```graphql
# Find information about Star Wars movies
query starWars {
  allFilms {
    films {
      # The title of the film
      title
      planetConnection {
        # A list of planets for this film
        planets {
          # Name of the planet
          name
        }
      }
    }
  }
}
```


Step 3: Run!

```
> npx toolql

Hi, how can I help?
- Which Star Wars films featured the planet Alderaan?
Alderaan featured in two Star Wars movies, A New Hope and Revenge of the Sith.
```

*Next Steps*

* Explore the included examples

```
> set TOOLQL_OPENAI_API_KEY=<Your OpenAI API Key>
> npx toolql -ex star-wars

Hi, do you have a question about Star Wars movies?
- Which droid appeared in most movies?
C3PO and R2D2 both appeared in 6 movies each.
```

* Configure ToolQL for your own business data services and try it out!

* Assemble robust schema-driven toolkits across multiple services

* Connect with agent designers like Flowise / N8N / CoPilot Studio / ...

* Enable visiting Agents to transact with your business via [MCP](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)

```json
{
  "mcp": {
    "port": 3456
  }
}
```

Use [VisiQL](https://visiql.com) to design and generate intelligent visual business applications

*Contact Us*

Need more advanced A.I. / GraphQL integrations and applications?

Strategy / design / development / training / mentoring / support

https://toolql.com/contact
