const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLFloat, GraphQLNonNull } = require('graphql');

// Scalar Type
/*
    String
    int
    Float
    Boolean
    ID
*/

const Person = new GraphQLObjectType({
	name: 'Person',
	description: 'Represents a Person Type',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: new GraphQLNonNull(GraphQLString) },
		age: { type: GraphQLInt },
		isMarried: { type: GraphQLBoolean },
		gpa: { type: GraphQLFloat },

	}),
});
// Root Query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	description: 'Description',
	fields: {
        person: {
            type: Person,
            resolve(parent, args) {
                let presonObj = {
                    name: 'Antonio',
                    age: 35,
                    isMarried: true,
                    gpa: 3.5,
                }

                return presonObj;
            }
        }
    },
});

module.exports = new GraphQLSchema({
	query: RootQuery,
});
