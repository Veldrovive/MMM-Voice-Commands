Module.register("MMM-Voice-Commands", {

	defaults: {
		debug: false, //Displays end results and errors from annyang in the Log
		autoStart: true, //Adds annyang commands when it first starts
		activateCommand: "hello mirror", //Command to active all other commands
		deactivateCommand: "goodbye mirror", //Command to deactivate all other commands
		alertHeard: false, //Wether an alert should be shown when annyang hears a phrase (mostly for debug)
		commands: {
			"socket test :payload": "TEST_SOCKET",
			"function test :payload": function(payload){alert("Test: "+payload)} //in these functions 'this' is bound to the module so this.sendNotification() is valid
		}
	},

	start: function() {
		this.rawCommands = this.config.commands;
		this.autoStart = this.config.autoStart;
		this.activateCommand = this.config.activateCommand;
		this.deactivateCommand = this.config.deactivateCommand;
		this.alertHeard = this.config.alertHeard;
		this.debug = this.config.debug;

		this.commands = {};
		this.active = false

		this.initAnnyang();
	},

	initAnnyang: function(){
		const self = this;
		if (annyang) {

			//Iterate over commands list to create a valid annyang command object
			for (var key in self.rawCommands) {
				if (self.rawCommands.hasOwnProperty(key)) {
					//If the property is already a function, leave it that way. Otherwise assume it is a socket name
					if(typeof self.rawCommands[key] !== "function"){
						//Construct a valid function...
						function createCommand(socket){
							return function(payload){
								self.sendNotification(socket, payload);
							}
						}

						//...And then put it in the object
						self.commands[key] = createCommand(self.rawCommands[key])
					}else{
						self.commands[key] = self.rawCommands[key].bind(self);
					}
				}
			}

			if(self.autoStart){
				annyang.addCommands(self.commands);
				self.active = true;
			}

			const standardCommands = {}
			standardCommands[self.activateCommand] = function(){
				if(!self.active){
					self.addCommands(self.commands);
					self.active = true;
					self.sendNotification("SHOW_ALERT", {type: "notification", title: "Voice Commands", message: "Activated"});
				}else{
					self.sendNotification("SHOW_ALERT", {type: "notification", title: "Voice Commands", message: "Already Active"});
				}
			}

			standardCommands[self.deactivateCommand] = function(){
				if(self.active){
					self.removeCommands(self.commands);
					self.active = false;
					self.sendNotification("SHOW_ALERT", {type: "notification", title: "Voice Commands", message: "Deactivated"});
				}else{
					self.sendNotification("SHOW_ALERT", {type: "notification", title: "Voice Commands", message: "Already Deactivated"});
				}
			}

			annyang.addCommands(standardCommands);

			annyang.start();

			if(self.debug){
				annyang.addCallback("result", function(e){
					Log.log(e)
				})

				annyang.addCallback("error", function(e){
					Log.log(e)
				})
			}

			if(self.alertHeard){
				annyang.addCallback("result", function(e){
					self.sendNotification("SHOW_ALERT", {title: "Voice Commands Heard", message: e.join(', '), timer: e.length*1500})
				})
			}
		}
	},

	addCommands: function(commands){
		annyang.abort();
		annyang.addCommands(commands);
		annyang.start();
	},

	removeCommands: function(commands){
		annyang.abort();
		var test1 = typeof commands;
		var test2 = Array.isArray(commands)
		if(typeof commands === "object") annyang.removeCommands(Array.isArray(commands) ? commands : Object.keys(commands));
		annyang.start()
	},

	getScripts: function() {
		return[
			this.file("js/annyang.min.js"),
		]
	},
})