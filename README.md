![](./res/toolql-logo-close.png)



> ## Create A.I. Tools with GraphQL

> #### *Instantly generate intelligent Agents for business data and operations*

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
> npx toolql -ex github

Hi, I'm your personal Github assistant, how can I help?
- How many commits have I made since yesterday?
You've made seven commits to the master branch of `toolql`.
- How many stars does toolql have?
The `toolql` project now has 123 stars. Would you like to add a star?
- Yes please
OK, `toolql` now has 124 stars. Thanks for your support.
```

*(Please do give us a star, and then check back soon to see the difference you make to our documentation :-)*

* Create intelligent tools and agents for your own GraphQL operations!

* Enable visiting Agents to transact with your business via [MCP](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)

```properties
MCP_PORT=3456
```

* Connect with agent designers like Flowise / N8N / CoPilot Studio / ...
* Assemble robust, schema-driven agentic toolkits across multiple services
* Build *convergent applications*, combining conventional and conversational user experiences



### Contact Us

Accelerate your A.I. journey with GraphQL!

*Strategy • Design • Development • Mentoring • Training • Support*

https://toolql.com/contact
