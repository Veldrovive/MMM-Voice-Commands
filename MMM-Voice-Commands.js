Module.register("MMM-Voice-Commands", {

	defaults: {
		debug: false,
		commands: {
			"socket test :payload": "TEST_SOCKET",
			"function test :payload": function(payload){alert("Test: "+payload)} //in these functions 'this' is bound to the module so this.sendNotification() is valid
		}
	},

	start: function() {
		const self = this;
		if (annyang) {
			var rawCommands = this.config.commands;
			var commands = {};

			//Iterate over commands list to create a valid annyang command object
			for (var key in rawCommands) {
				if (rawCommands.hasOwnProperty(key)) {
					//If the property is already a function, leave it that way. Otherwise assume it is a socket name
					if(typeof rawCommands[key] !== "function"){
						//Construct a valid function...
						function createCommand(socket){
							return function(payload){
								self.sendNotification(socket, payload);
							}
						}

						//...And then put it in the object
						commands[key] = createCommand(rawCommands[key])
					}else{
						commands[key] = rawCommands[key].bind(self);
					}
				}
			}

			annyang.addCommands(commands);
			annyang.start();

			if(this.config.debug){
				annyang.addCallback("result", function(e){
					console.log(e)
				})

				annyang.addCallback("error", function(e){
					console.log(e)
				})
			}
		}
	},

	getScripts: function() {
		return[
			this.file("js/annyang.min.js"),
		]
	},
})