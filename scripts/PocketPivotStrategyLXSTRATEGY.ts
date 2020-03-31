#
# Copyright 2015 Scott J. Johnson (https://scottjjohnson.com)
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
# PocketPivotStrategyLX
#
# Sell when we break the 10/50 day line on day 1 and then go below that day's intraday
# low on a subsequent day.  Also sell if we break the 50-day on volume more than 40%
# above average.

input MovingAverageLine = 50; # sell when violates 50 day SMA
input HighVolumePercentage = 40; # if volume is greater or equal that this percentage
                                 # above the 50-day average volume then it counts
                                 # as a high volume day.

def TodaysSMA = MovingAverage(AverageType.SIMPLE, close[1], MovingAverageLine);
def YesterdaysSMA = MovingAverage(AverageType.SIMPLE, close[1], MovingAverageLine); 

# volume rule always uses the 50-day, but the SMA violation run can be 10- or 50-day
def Todays50DaySMA = MovingAverage(AverageType.SIMPLE, close[1], 50);
def AverageVolume = MovingAverage(AverageType.SIMPLE, volume[1], 50);

def DidViolateSMA = if (low < low[1] && close[1] < YesterdaysSMA) then 1 else 0;
def DidBreakSMAOnHighVolume = if (close<Todays50DaySMA && volume > AverageVolume * (1 + HighVolumePercentage/100)) then 1 else 0;

def sell = if (DidViolateSMA or DidBreakSMAOnHighVolume) then 1 else 0;

AddOrder(OrderType.SELL_TO_CLOSE, sell equals 1, tickColor = GetColor(1), arrowColor = GetColor(1), price = low[1], name = "Sell");
