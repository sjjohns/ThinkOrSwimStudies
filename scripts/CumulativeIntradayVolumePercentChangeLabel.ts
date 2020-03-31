#
# Copyright 2020 Scott J. Johnson (https://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#
# CumulativeIntradayVolumePercentChangeLabel
#
# Displays a label with the percent change in cumulative intraday volume. 
#
# The chart period should be less than one day.
#
# This study was designed to be used with TOS Total Volume symbols like $TVOLC/Q 
# (NASDAQ Composite Total Volume) or $TVOLC (NYSE Composite Total volume). The 
# OHLC "prices" for these symbols are actually cumulative daily volume. But this
# study will show price percent change over the same time period if a stock or
# ETF symbol is used.
#

input symbol = "$TVOLC/Q";  # NASDAQ Composite Total Volume

# did this bar just start a new calendar day?
def newDay = GetDay() <> GetDay()[1];

# get the index of today's first bar
def newDayIndex = if newDay then 
                    1
                  else 
                    newDayIndex[1] + 1;

# save the index of the previous day's first bar
def prevNewDayIndex = if newDay then
                        newDayIndex[1]
                      else
                        prevNewDayIndex[1] + 1;

# number of bars in the prior day
def indexOffset = prevNewDayIndex - newDayIndex + 1;

# volume today and yesterday
def todayVol = close(symbol=symbol);
def yesterdayVol = GetValue(close(symbol=symbol), indexOffset);

def percentChange = (todayVol / yesterdayVol - 1) * 100;                    

# % change label
AddLabel(1, "Today's Volume Percent Change (" + symbol + "): " + Round(percentChange,2) + "%", Color.WHITE);

