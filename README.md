# MMM-Voice-Commands
Voice Commands is a voice commands module that is designed to be bare bones and allow the user to do whatever they want on their [MagicMirror²](https://github.com/MichMich/MagicMirror). The voice recognition is built off of [annyang](https://github.com/TalAter/annyang) so it uses a command based structure. However, it does not use an activation phrase and instead just opts for direct use of statements.

## Installation
Navigate to the modules folder of your Magic Mirror installation.
```bash
cd ~/MagicMirror/modules
```

Clone the repository.
```bash
git clone https://github.com/Veldrovive/MMM-Page-Selector.git
```

Navigate into the installation and Install Dependencies.
```bash
cd MMM-Page-Selector && npm i
```

## Usage
```js
modules[
    ...
    {
        module: "MMM-Page-Selector",
        config: {
            debug: false,
            commands: {
                "command statement :variable (optional statement)": "SOCKET_NOTIFICATION_NAME",
                //The payload of the socket notification will be whatever is said in the :variable
                "command statement *variable": function(param){
                    alert("Whatever is said in the *variable space is given as the "+param);
                    //These function's 'this' are bound to the module's 'this' so you can do stuff like:
                    this.sendNotification("PAGE_SELECT", "2");
                }
            }
        }
    },
  ...
]
```
- If a string is provided as the property in a command, the module will send out a notification with the socket name given by the property and the payload given by the variable in the annyang command.<br/>
- If a function is provided as the property in a command, the module will simply run the function when the command is hear. The argument of the command is given by the variable and `this` refers to the module's `this`.

For more information on the command stucure look to the [annyang documentation](https://www.talater.com/annyang/)

## Usage with external modules
- Voice Commands communicates with other modules through the notification system.<br/>
- Voice Commands was developed in conjunction with MMM-Page-Selector. Two use the two together simply use a command in the following format:<br/>
`"switch to (the) :page (page)": "PAGE_SELECT"` or `"go to (page) :number": "PAGE_SELECT"`
