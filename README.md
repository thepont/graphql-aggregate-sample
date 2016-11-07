
to run the run script run the follow command at the command line 

```#npm run run```

this should start a webserver on port 3121, connecting to this port should give you a Graph_i_QL interface allowing accesss to the people collection via the graphql-aggregation methods

## Example Query:

```graphql
{
  people {
    count
    average {
      age
      index
    }
    filter {
      age(lt: 40) {
        average {
          age
        }
        filter {
          age(lt: 29) {
            average {
              age
            }
            count
            groupedBy {
              eyeColor {
                keys
                values {
                  count
                  average {
                    age
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

```
data.js is generated by (JSON-Generator)[http://beta.json-generator.com/4J77vWKgG]