const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const testSchema = require('./schema/types_schema');


const cors = require('cors');

const {
	mongoConfig: { mongoDBDatabaseName, mongoDBUsername, mongoDBPassword },
} = require('./config');

mongoose.connect(`mongodb+srv://${mongoDBUsername}:${mongoDBPassword}@cluster0.d22uz.mongodb.net/${mongoDBDatabaseName}`, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => {
	console.log('Connected...');
});


const app = express();

app.use(cors());
app.use(
	'/graphql',
	graphqlHTTP({
		graphiql: true,
		schema,
	})
);

app.listen(3000, () => {
	console.log('Listening to port 3000...');
});
