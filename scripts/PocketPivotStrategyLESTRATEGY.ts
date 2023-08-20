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
# PocketPivotStrategyLE
#
# Identifies Pocket Pivot buy points.  This is a copy of the PocketPivot study.
# Unfortunately I have to copy the entire logic here rather than just referencing
# the study.  See PocketPivotSTUDY.ts for a description of the study.
#
input Period = 11;  # normal volume lookback period (today + 10 prior days)
input MaximumDistanceFrom10DaySMAPercent = 1.4;  # Price on pivot day should be near the 10-day SMA.  MAX = 1.6 Per FOSL1, 1.23 per PII, but RAX not extended at 1.61 and 1.64.

# Volume functions
def DownVolume = If(close < close[1], volume, 0);
def HighestDownVolume = Highest(DownVolume, Period);

def FiftyDayAverageVolume = MovingAverage(AverageType.SIMPLE, volume, 50);

def IsVolumeGreaterHighestDownVolume = if (volume > HighestDownVolume) then 1 else 0;

# Price functions
def TenDaySMA = MovingAverage(AverageType.SIMPLE, close, 10);
def FiftyDaySMA = MovingAverage(AverageType.SIMPLE, close, 50);

def IsLowPriceNear10DaySMA = if ((AbsValue(low - TenDaySMA) / TenDaySMA) <= MaximumDistanceFrom10DaySMAPercent / 100) then 1 else 0;
def DidPricePass10DaySMA = if (low <= TenDaySMA && close >= TenDaySMA) then 1 else 0;

def IsPriceNear10DaySMA = if (IsLowPriceNear10DaySMA or DidPricePass10DaySMA) then 1 else 0;

def IsPriceAtOrAbove50DaySMA = if (close >= FiftyDaySMA) then 1 else 0;

def AveragePriceChangePercent = MovingAverage(AverageType.SIMPLE, AbsValue(close[1] - close[2]) / close[2], Period);

def IsCloseInUpperHalfOfRange = close >= close[1] && close > ((high - low) * .38 + low);

def IsPriceInTheProperRange = if (IsCloseInUpperHalfOfRange && IsPriceNear10DaySMA && IsPriceAtOrAbove50DaySMA) then 1 else 0;

# add a chart bubble if then PP criteria are met
# AddChartBubble(IsVolumeGreaterHighestDownVolume && IsPriceInTheProperRange, low, "PP", Color.CYAN, no);

# add a chart bubble if then PP criteria are met
def buy = if (IsVolumeGreaterHighestDownVolume && IsPriceInTheProperRange) then 1 else 0;

AddOrder(OrderType.BUY_AUTO, buy equals 1, tickColor = GetColor(0), arrowColor = GetColor(0), price = close, name = "Buy");


