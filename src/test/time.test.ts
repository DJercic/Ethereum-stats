import test from 'ava';
import moment from 'moment-timezone';
import sinon from 'sinon';

import * as time from './../type/time';

const sandbox = sinon.createSandbox();

test.afterEach.always(() => sandbox.restore());

test('Calculating previous day', (t) => {
    sinon.useFakeTimers(moment('2021-10-15T12:00:00Z').tz('UTC').valueOf())

    const previousDay = time.previousDay();
    t.assert(previousDay.getDate() == 14);
    t.assert(previousDay.getMonth() == 9);
    t.assert(previousDay.getFullYear() == 2021);
});
