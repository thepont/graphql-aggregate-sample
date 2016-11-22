
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from 'graphql';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import {AggregationType} from 'graphql-aggregate'
import OpticsAgent from 'optics-agent';

var data = require('./data.json');

var PersonType = new GraphQLObjectType({ 
            name: 'Person',
            fields: () => ({
                _id : {
                    type: GraphQLID
                },
                index : {
                    type: GraphQLInt
                },
                guid : {
                    type: GraphQLString
                },
                firstName: {
                    type: GraphQLString,
                    resolve: (obj) => obj.name.first
                },
                lastName: {
                    type: GraphQLString,
                    resolve: (obj) => obj.name.last 
                },
                eyeColor : {
                    type: GraphQLString
                },
                age : {
                    type: GraphQLInt
                },
                company: {
                    type: GraphQLString
                }, 
                address: {
                    type: GraphQLString
                },
                range: {
                    type: new GraphQLList(GraphQLInt)
                },
                friends: {
                    type: new GraphQLObjectType({ 
                        name: 'Friends',
                        fields: () => ({
                            id: {
                                type: GraphQLID
                            },
                            name: {
                                type: GraphQLString
                            }
                        })
                    })
                },
                greeting: {
                    type: GraphQLString
                },
                favoriteFruit: {
                    type: GraphQLString
                },
                random: {
                    type: GraphQLFloat,
                    resolve: (obj, args, {random}) => {
                        return Promise.resolve(Math.random())
                    }
                }
            })
        });

var PersonType1 = new GraphQLObjectType({ 
            name: 'PersonNoInt',
            fields: () => ({
                _id : {
                    type: GraphQLID
                },
                guid : {
                    type: GraphQLString
                },
                firstName: {
                    type: GraphQLString,
                    resolve: (obj) => obj.name.first
                },
                lastName: {
                    type: GraphQLString,
                    resolve: (obj) => obj.name.last 
                }, 
                eyeColor : {
                    type: GraphQLString
                },
                company: {
                    type: GraphQLString
                }, 
                address: {
                    type: GraphQLString
                },
                greeting: {
                    type: GraphQLString
                },
                favoriteFruit: {
                    type: GraphQLString
                }
            })
        });

var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            people: {
                type: AggregationType(PersonType),
                resolve: (root, args, {dataloaders})=> data
            },
            peopleNoInt: {
                type: AggregationType(PersonType1),
                resolve: (root, args, {dataloaders})=> data
            }
        }
    })
});

var app = express();
OpticsAgent.instrumentSchema(schema);
app.use('/', OpticsAgent.middleware());
app.use('/', (request, response, next) => {
    const opticsContext = OpticsAgent.context(request);
    return graphqlHTTP({
        schema: schema,
        pretty: true,
        graphiql: true,
        context: {
            opticsContext: opticsContext,
            random: Math.random
        }
    })(request, response, next);
});

app.listen(3121);
console.log('Started on http://localhost:3121/');