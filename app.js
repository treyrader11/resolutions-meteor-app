
Resolutions = new Mongo.Collection('resolutions');


if (Meteor.isClient) {

	Meteor.subscribe("resolutions");

	Template.body.helpers({
		resolutions: function() {
			if(Session.get('hideFinished')) {
				return Resolutions.find({checked: {$ne: true}});
			} else {
				return Resolutions.find();
			}
		},
		hideFinished: function() {
			return Session.get('hideFinished');
		}
	});

	Template.body.events({
		'submit .new-resolution': function(event) {
			//event.preventDefault();
			var title = event.target.title.value;
			Meteor.call('addResolution', title);

			event.target.title.value = ""; //clears field
			return false; //same as event.preventDefault	
		},
		
		'change .hide-finished': function(event) {
			Session.set('hideFinished', event.target.checked);
			console.log(event.target.checked);
		}
	});

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
}



if (Meteor.isServer) {
	Meteor.startup(function() {
	//code to run on server at startup
	});

	Meteor.publish("resolutions", function() {
		return Resolutions.find({
			$or: [
				{private: {$ne: true}},
				{owner: this.userId}
			]
		});
	})
}

Meteor.methods({
	addResolution: function(title) {
		Resolutions.insert({
			title: title,
			createdAt: new Date(),
			owner: Meteor.userId()
		});
	},
	updateResolution: function(id, checked) {
		var resolution = Resolutions.findOne(id);

		if(resolution.owner !== Meteor.userId) {
			throw new Meteor.Error('not-authorized');
		}
		
		Resolutions.update(id, {$set: {checked: checked}});
	},
	setPrivate: function(id, private) {
		var resolution = Resolutions.findOne(id);

		if(resolution.owner !== Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Resolutions.update(id, {$set: {private: private}});
	},
	deleteResolution: function(id) {
		var resolution = Resolutions.findOne(id);
		console.log(resolution);
		if(resolution.owner !== Meteor.userId) {
			throw new Meteor.Error('not-authorized');
		}
		Resolutions.remove(id);
	}
})