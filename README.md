![](./res/toolql-logo-close.png)



> ## Create A.I. Tools with GraphQL

> #### *Rapidly generate intelligent Agents for business data and operations*

Visit https://toolql.com



### Get Started

Step 1: Describe environment in `.env`

```properties
GRAPHQL_API="https://swapi-graphql.netlify.app/graphql"
OPENAI_API_KEY=<API_KEY_GOES_HERE>
```

Step 2: Define tools in `tools.graphql`

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



### Next Steps

* Explore the included examples, including tools for Github

```
Hi, I'm your personal Github assistant, how can I help?
- How many commits have I made since yesterday?
You've made seven commits to the master branch of `toolql`.
- How many stars does toolql have?
The `toolql` project now has 1,234 stars. 
```

*(Please give us a star and check back soon for updates :-)*

* Build intelligent tools for your own GraphQL operations!

* Assemble robust schema-driven toolkits across multiple services

* Enable visiting Agents to transact with your business via [MCP](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)

```properties
MCP_PORT=3456
```

* Connect with agent designers like Flowise / N8N / CoPilot Studio / ...



### Contact Us

Accelerate your A.I. journey with GraphQL!

Build convergent applications that combine conventional and conversational user experiences.

Strategy / design / development / training / mentoring / support.

https://toolql.com/contact
