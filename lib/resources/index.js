import { Event } from './event';
import { LiveEvent } from './live-event';
import { EntryPicks } from './entry-picks';
import { Elements } from './elements';
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

  get entryPicks() {
    if (!this._entryPicks) {
      this._entryPicks = new EntryPicks(this);
    }

    return this._entryPicks;
  }

  get elements() {
    if (!this._elements) {
      this._elements = new Elements(this);
    }

    return this._elements;
  }

  get liveEvent() {
    if (!this._liveEvent) {
      this._liveEvent = new LiveEvent(this);
    }

    return this._liveEvent;
  }

  get classicLeagueStandings() {
    if (!this._classicLeagueStandings) {
      this._classicLeagueStandings = new ClassicLeague(this);
    }

    return this._classicLeagueStandings;
  }
}
