export class Point {
  constructor(timestamp, personID, currPlayerTotal) {
    this.timestamp = timestamp || new Date();
    this.personID = personID;
    this.currPlayerTotal = currPlayerTotal;
  }
}
export class Person {
  constructor(ID, name, color, sound) {
    this.ID = ID;
    this.name = name;
    this.color = color || "black";
    this.sound = sound;
  }
}
export class Player {
  constructor(person, remote) {
    this.person = person;
    this.remote = remote;
    this.points = [];
  }
}
export class Remote {
  constructor(name, buttonIDs) {
    this.ID = guidGenerator();
    this.name = name;
    this.buttonIDs = [];
    buttonIDs.forEach(button => {
      this.buttonIDs.push(button);
    });
  }
}
export class Match {
  constructor() {
    this.ID = guidGenerator();
    this.startTime = new Date();
    this.players = [];
    this.remotes = [];
    this.isRunning = false;
    this.latestPoint = null;
  }
  addPoint(personID) {
    var i = this.players.map(x => x.person.ID).indexOf(personID);
    var newPoint = new Point(new Date(), personID, this.playerScores[i] + 1);
    this.players[i].points.push(newPoint);
    this.latestPoint = newPoint;
  }
  removePoint(personID) {
    var i = this.players.map(x => x.person.ID).indexOf(personID);
    var points = this.players[i].points;
    if (points.length) {
      points.splice(-1, 1);
    }
    this.latestPoint = points.length ? points[points.length - 1] : null;
  }

  get playerScores() {
    return this.players.map(x => x.points.length);
  }
  get playerCount() {
    return this.players.filter(n => n != undefined).length;
  }
  get enoughPlayers() {
    return this.playerCount == 2;
  }
}

export function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}
