export class Point {
    constructor(timestamp, playerID, currPlayerTotal) {
        this.timestamp = timestamp || new Date();
        this.playerID = playerID;
        this.currPlayerTotal = currPlayerTotal;
    }
}
export class Person {
    constructor(ID, name, color) {
        this.ID = ID;
        this.name = name;
        this.color = color || "black";
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
    addPoint(playerID) {
        var i = this.players.map(x => x.person.ID).indexOf(playerID);
        var now = new Date();
        this.players[i].points.push(new Point(now, playerID, this.playerScores[i] + 1));
        this.latestPoint = now;
    }
    removePoint(playerID) {
        var i = this.players.map(x => x.person.ID).indexOf(playerID);
        var points = this.players[i].points;
        if(points.length) {
            points.splice(-1,1);
        }
        var now = points.length ? points[points.length -1].timestamp : this.startTime;
        this.latestPoint = now;
    }

    get playerScores() {
        return this.players.map(x => x.points.length);
        // return [
        //     this.points.filter(n => n.playerID == this.players[0].ID).length,
        //     this.points.filter(n => n.playerID == this.players[1].ID).length
        // ]
    }
    get playerCount() {
        return this.players.filter(n => n != undefined).length;
    }
    get enoughPlayers() {
        return this.playerCount == 2;
    }
}

export function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}