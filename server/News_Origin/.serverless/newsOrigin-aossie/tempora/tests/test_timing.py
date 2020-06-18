import datetime
import time
import contextlib
import os
from unittest import mock

from tempora import timing


def test_IntervalGovernor():
    """
    IntervalGovernor should prevent a function from being called more than
    once per interval.
    """
    func_under_test = mock.MagicMock()
    # to look like a function, it needs a __name__ attribute
    func_under_test.__name__ = 'func_under_test'
    interval = datetime.timedelta(seconds=1)
    governed = timing.IntervalGovernor(interval)(func_under_test)
    governed('a')
    governed('b')
    governed(3, 'sir')
    func_under_test.assert_called_once_with('a')


@contextlib.contextmanager
def change(alt_tz, monkeypatch):
    monkeypatch.setitem(os.environ, 'TZ', alt_tz)
    time.tzset()
    try:
        yield
    finally:
        monkeypatch.delitem(os.environ, 'TZ')
        time.tzset()


def test_Stopwatch_timezone_change(monkeypatch):
    """
    The stopwatch should provide a consistent duration even
    if the timezone changes.
    """
    watch = timing.Stopwatch()
    with change('AEST-10AEDT-11,M10.5.0,M3.5.0', monkeypatch):
        assert abs(watch.split().total_seconds()) < 0.1
