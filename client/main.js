

import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

/*Template.resolution.onCreated(function resolutionOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.resolution.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.resolution.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
*/

Resolutions = new Mongo.Collection('resolutions');


if (Meteor.isClient) {
	Template.body.helpers({
		resolutions: function() {
			return Resolutions.find();
			//console.log(Resolutions.find());
		}
	})

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
			return false; //same as event=preventDefault

		}
	});
}



if (Meteor.isServer) {
	Meteor.startup(function() {
	//code to run on server at startup
	})
}