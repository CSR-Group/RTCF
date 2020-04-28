import { subscribe, publish } from "./relay";

const DataType = {
  int64: 'int64',
  str: 'str',
  doc: 'doc'
}

class State  {
  /*
      input: 
         {
              "asd": {type: "int", value="0"}
              "asd2": {type: "doc", value="0"}, 
              "adsad": {type: "doc", value="1"}, 
          }
   */

  constructor(definition, clientID, topic, dsynkHubHost) {

      this.intVars = {};
      this.strVars = {}; 
      this.docVars = {};
      this.typeMap = {}; 
      this.clientID = clientID;
      this.topic = topic;
      this.dsynkHubHost = dsynkHubHost;

      for(var name in definition) {
          if(definition[name].type === DataType.int64) {
              this.intVars[name] = definition[name].value; 
              this.typeMap[name] = DataType.int64;
          }
          if(definition[name].type === DataType.str) {
              this.strVars[name] = definition[name].value; 
              this.typeMap[name] = DataType.str;
          }
          if(definition[name].type === DataType.doc) {
              this.docVars[name] = { "0" : definition[name].value }; 
              this.typeMap[name] = DataType.doc;
          }
      }
  }

  set(variableName, value = '0', docKey = -1) {
    if(!(variableName in this.typeMap)) {
      throw "variable " + variableName + " does not exist"; 
    }

    var type = this.typeMap[variableName];
    var message; 

    if(type === DataType.int64) {
      this.intVars[variableName] = value;
      message = { 'type': DataType[type],
                  'key': variableName,
                  'value': value.toString()}
    }
    if(type === DataType.str) {
      this.strVars[variableName] = value;
      message = { 'type': DataType[type],
                  'key': variableName,
                  'value': value}
    }
    if(type === DataType.doc) {
      this.docVars[variableName][docKey] = value;
      message = { 'type': DataType[type],
                  'key': variableName,
                  'line': docKey,
                  'value': value}
    }

    publish(this.dsynkHubHost, this.topic, this.clientID, message);
  }

  get(variableName) {
    if(!(variableName in this.typeMap)) {
      throw "variable " + variableName + " does not exist"; 
    }

    var type = this.typeMap[variableName];
    if(type === DataType.int64) {
      return this.intVars[variableName];
    }
    if(type === DataType.str) {
      return this.strVars[variableName];
    }
    if(type === DataType.doc) {
      return this.docVars[variableName];
    }
  }

  handle(message) {

    console.log(message);
    const event = JSON.parse(message.body);

    if(event.from === this.clientID) {
      return;
    }
 
    var change = event.message; 
    var type;

    if(!(change.key in this.typeMap)) {
      type = change.type;
    } else {
      type = this.typeMap[change.key];
    }

    if(type === DataType.int64) { 
      console.log("change state : " + change.key + " - "+ change.value);
      this.intVars[change.key] = change.value;
    }
    if(type === DataType.str) {
      console.log("change state : " + change.key + " - "+ change.value);
      this.strVars[change.key] = change.value;
    }
    if(type === DataType.doc) {
      console.log("change state : " + change.key + " - "+ change.line + " - "+ change.value);
      
      this.docVars[change.key][change.line] = change.value;
    }

  }

  buildState(message) {

    const parsedState = JSON.parse(message.body);

    console.log(parsedState);
    for(var name in parsedState.integers) {
      if(!(name in this.typeMap)) {
        this.intVars[name] = parsedState.integers[name]; 
        this.typeMap[name] = DataType.int64;
        console.log("building state int: " + name + " = " + parsedState.integers[name]);
      }
    }
    for(var name in parsedState.strings) {
      if(!(name in this.typeMap)) {
        this.strVars[name] = parsedState.strings[name]; 
        this.typeMap[name] = DataType.str;
        console.log("building state str: " + name + " = " + parsedState.strings[name]);
      }
    }
    for(var name in parsedState.docs) {
      if(!(name in this.typeMap)) {
        this.docVars[name] = parsedState.docs[name]; 
        this.typeMap[name] = DataType.doc;
        console.log("building state doc: " + name + " = " + parsedState.docs[name]);
      }
    }

    console.log(this);
  }

}

export { State, DataType }; 
