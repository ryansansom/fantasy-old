import DataLoader from 'dataloader';
import { getEntryPicks, getEvents, getLeaguesClassic, getElements, getEventLive, getDraftLeague, getDraftPicks } from '../lib/fetch-data';
import { Resources } from '../lib/resources';

function wrapLoader(loader) {
  return function loaderWrapper(stringifiedKeys) {
    const { id, week } = JSON.parse(stringifiedKeys);

    return loader(id, week);
  };
}

const newDataLoader = func => new DataLoader(keys => Promise.all(keys.map(key => func(key))));

export default (req, res, next) => {
  req.resources = new Resources({
    classicLeagueLoader: newDataLoader(getLeaguesClassic),
    draftEntryPicksLoader: newDataLoader(wrapLoader(getDraftPicks)),
    draftLeagueLoader: newDataLoader(getDraftLeague),
    eventsLoader: newDataLoader(getEvents),
    eventLiveLoader: newDataLoader(getEventLive),
    entryPicksLoader: newDataLoader(wrapLoader(getEntryPicks)),
    elementsLoader: newDataLoader(getElements),
  });

  next();
};
