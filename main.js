
Resolutions = new Mongo.Collection('resolutions');


if (Meteor.isClient) {
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
			//console.log(event);
			Resolutions.insert({
				title: title,
				createdAt: new Date()
			});
			console.log(Resolutions.find().fetch());

			event.target.title.value = ""; //clears field
			return false; //same as event.preventDefault

		},
		'change .hide-finished': function(event) {
			Session.set('hideFinished', event.target.checked);
			console.log(event.target.checked);
		}
	});

	Template.resolution.events({
		'click .toggle-checked': function() {
			Resolutions.update(this._id, {$set: {checked: !this.checked}})
		},
		'click .delete': function() {
			Resolutions.remove(this._id);
		}
	})

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
}



if (Meteor.isServer) {
	Meteor.startup(function() {
	//code to run on server at startup
	})
}