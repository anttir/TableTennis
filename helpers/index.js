export class Point {
  constructor(timestamp, personID, currPlayerTotal, currSetTotal) {
    this.timestamp = timestamp || new Date();
    this.personID = personID;
    this.currPlayerTotal = currPlayerTotal;
    this.currSetTotal = currSetTotal;
  }
}
export class Person {
  constructor(ID, name, color, sound, languageID) {
    this.ID = ID;
    this.name = name;
    this.color = color || "black";
    this.sound = sound;
    this.languageID = languageID; // voi olla null
  }
}
export class Player {
  constructor(person, remote) {
    this.ID = guidGenerator();
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
    var currSetTotal = this.playerScores.reduce((x,y) => x+y,1) // laskee pisteet yhteen
    var newPoint = new Point(new Date(), personID, this.playerScores[i] + 1, currSetTotal);
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
