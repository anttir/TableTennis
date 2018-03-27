import { median, countConsecutive, pointWinner } from "~/helpers/statistics";

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
  // median(values, func) {
  //   return median(values, func);
  // }
  // countConsecutive(array, func) {
  //   return countConsecutive(array, func);
  // }
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
    var currSetTotal = this.playerScores.reduce((x, y) => x + y, 1); // laskee pisteet yhteen
    var newPoint = new Point(
      new Date(),
      personID,
      this.playerScores[i] + 1,
      currSetTotal
    );
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
    return this.players.filter(n => n != undefined && n.person != undefined)
      .length;
  }
  get enoughPlayers() {
    return this.playerCount == 2;
  }
  get stats() {
    if(!this.players.length) return;
    var points = this.players
      .map(p => p.points)
      .reduce((a, b) => a.concat(b), [])
      .sort((a, b) => a.timestamp - b.timestamp);
    if (!points.length) return; // jos ei ollut yhtään pistettä
    points.forEach((point, i) => {
      if (i == 0) {
        point.pointLength = points[0].timestamp - this.startTime;
      } else {
        point.pointLength = point.timestamp - points[i - 1].timestamp;
      }
    });
    var tie = this.players[0].points.length == this.players[1].points.length;
    var medianPointLength = median(points, x => x.pointLength);
    var maxConsecutivePoints = countConsecutive(points, x => x.personID);
    if (maxConsecutivePoints) {
      // voi olla myös tasapeli
      maxConsecutivePoints = [
        this.players.find(x => x.person.ID + "" == maxConsecutivePoints.key)
          .person.name,
        maxConsecutivePoints.count
      ];
    }
    var stats = {
      tie: tie,
      winner: pointWinner(points, this.players),
      medianPointLength: medianPointLength,
      H1Winner: pointWinner(
        points.slice(0, points.length * 0.5),
        this.players
      ),
      H2Winner: pointWinner(
        points.slice(points.length * 0.5, points.length),
        this.players
      ),
      Q1Winner: pointWinner(
        points.slice(0, points.length * 0.25),
        this.players
      ),
      Q2Winner: pointWinner(
        points.slice(points.length * 0.25, points.length * 0.5),
        this.players
      ),
      Q3Winner: pointWinner(
        points.slice(points.length * 0.5, points.length * 0.75),
        this.players
      ),
      Q4Winner: pointWinner(
        points.slice(points.length * 0.75),
        this.players
      ),
      shortPointsWinner: pointWinner(
        points.filter(p => p.pointLength < medianPointLength),
        this.players
      ),
      longPointsWinner: pointWinner(
        points.filter(p => p.pointLength >= medianPointLength),
        this.players
      ),
      maxConsecutivePoints: maxConsecutivePoints
    };
    return stats;
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
