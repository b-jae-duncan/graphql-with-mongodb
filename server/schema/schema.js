const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');

const User = require('../model/user');
const Post = require('../model/post');
const Hobby = require('../model/hobby');

// let usersData = [
// 	{
// 		id: '1',
// 		name: 'Arya',
// 		age: 18,
// 		skill: 'faceless',
// 	},
// 	{
// 		id: '2',
// 		name: 'Jon',
// 		age: 28,
// 		skill: 'knows nothing',
// 	},
// 	{
// 		id: '3',
// 		name: 'Nedd',
// 		age: 60,
// 		skill: 'headless',
// 	},
// 	{
// 		id: '4',
// 		name: 'Sansa',
// 		age: 20,
// 		skill: 'dumb',
// 	},
// 	{
// 		id: '5',
// 		name: 'Tyrion',
// 		age: 38,
// 		skill: 'drinks and knows shit',
// 	},
// ];

// let hobbiesData = [
// 	{ id: '1', title: 'sword fighting', description: 'something about swords', userId: '1' },
// 	{ id: '2', title: 'sowing', description: 'sowing stuff', userId: '4' },
// 	{ id: '3', title: 'drinking', description: 'drinks', userId: '5' },
// 	{ id: '4', title: 'reading', description: 'reads', userId: '5' },
// ];

// let postData = [
// 	{ id: '1', comment: 'Tell them the north remembers', userId: '1' },
// 	{ id: '2', comment: 'I bend the knee to you my queen', userId: '2' },
// 	{ id: '3', comment: 'The Man Who Passes The Sentence Should Swing The Sword.', userId: '3' },
// 	{ id: '4', comment: 'You stupid lil boy', userId: '4' },
// 	{ id: '5', comment: 'Never forget what you are, the rest of the world will not. ', userId: '5' },
// 	{ id: '6', comment: 'valar morghulis', userId: '1' },
// ];
//Deine types
const UserType = new GraphQLObjectType({
	name: 'User',
	description: 'Documentation for user',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		skill: { type: GraphQLString },
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				// return postData.filter(m => m.userId === parent.id)
				return Post.find({ userId: parent.id });
			},
		},
		hobbies: {
			type: new GraphQLList(HobbyType),
			resolve(parent, args) {
				// return hobbiesData.filter(m => m.userId === parent.id)
				return Hobby.find({ userId: parent.id });
			},
		},
	}),
});

const HobbyType = new GraphQLObjectType({
	name: 'Hobby',
	description: 'Hobby Description',
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		description: { type: GraphQLString },
		user: {
			type: UserType,
			resolve(parent, args) {
				// return usersData.find(m => m.id === parent.userId)
				return User.findById(parent.userId);
			},
		},
	}),
});

const PostType = new GraphQLObjectType({
	name: 'Post',
	description: 'Post Description',
	fields: () => ({
		id: { type: GraphQLID },
		comment: { type: GraphQLString },
		user: {
			type: UserType,
			resolve(parent, args) {
				// return usersData.find(m => m.id === parent.userId)
				return User.findById(parent.userId);
			},
		},
	}),
});

//Root Query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	description: 'Description',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				//resolve with data
				//get and return data from a data source
				return User.findById(args.id);
			},
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				return User.find();
			},
		},
		hobby: {
			type: HobbyType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return hobbiesData.find((m) => m.id === args.id);
				return Hobby.findById(args.id);
			},
		},
		hobbies: {
			type: new GraphQLList(HobbyType),
			resolve(parent, args) {
				// return  hobbiesData;
				return Hobby.find();
			},
		},
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return postData.find((m) => m.id === args.id);
				return Post.findById(args.id);
			},
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				// return  postData;
				return Post.find();
			},
		},
	},
});

//Mutations
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		CreateUser: {
			type: UserType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				skill: { type: GraphQLString },
			},
			resolve(parent, args) {
				let user = new User({
					name: args.name,
					age: args.age,
					skill: args.skill,
				});

				return user.save();
			},
		},
		UpdateUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				age: { type: GraphQLInt },
				skill: { type: GraphQLString },
			},
			resolve(parent, args) {
				return User.findByIdAndUpdate(
					args.id,
					{
						$set: {
							name: args.name,
							age: args.age,
							skill: args.skill,
						},
					},
					{
						new: false,
					}
				);
			},
		},
		RemoveUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let removedUser = User.findByIdAndRemove(args.id).exec();

				if (!removedUser) {
					throw new 'Error'();
				}

				return removedUser;
			},
		},
		CreatePost: {
			type: PostType,
			args: {
				comment: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let post = new Post({
					comment: args.comment,
					userId: args.userId,
				});

				return post.save();
			},
		},
		RemovePost: {
			type: PostType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let removedPost = Post.findByIdAndRemove(args.id).exec();

				if (!removedPost) {
					throw new 'Error'();
				}

				return removedPost;
			},
		},
		UpdatePost: {
			type: PostType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				comment: { type: new GraphQLNonNull(GraphQLString) },
				// userId: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				return Post.findByIdAndUpdate(
					args.id,
					{
						$set: {
							comment: args.comment,
							// userId: args.userId,
						},
					},
					{
						new: true,
					}
				);
			},
		},
		CreateHobby: {
			type: HobbyType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let hobby = new Hobby({
					title: args.title,
					description: args.description,
					userId: args.userId,
				});

				return hobby.save();
			},
		},
		UpdateHobby: {
			type: HobbyType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				title: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				// userId: { type: (GraphQLString) },
			},
			resolve(parent, args) {
				return Hobby.findByIdAndUpdate(
					args.id,
					{
						$set: {
							title: args.title,
							description: args.description,
							// userId: args.userId,
						},
					},
					{
						new: true,
					}
				);
			},
		},
		RemoveHobby: {
			type: HobbyType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let removedHobby = Hobby.findByIdAndRemove(args.id).exec();

				if (!removedHobby) {
					throw new 'Error'();
				}

				return removedHobby;
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
