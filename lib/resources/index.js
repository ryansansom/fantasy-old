import { Event } from './event';
import { ClassicLeague } from './classic-league';

export class Resources {
  constructor(loaders) {
    this.loaders = loaders;
  }

  get events() {
    if (!this._events) {
      this._events = new Event(this);
    }

    return this._events;
  }

  get classicLeagueStandings() {
    if (!this._classicLeagueStandings) {
      this._classicLeagueStandings = new ClassicLeague(this);
    }

    return this._classicLeagueStandings;
  }
}
