#
# Copyright 2015 Scott J. Johnson (http://scottjjohnson.com)
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
# PocketPivot
#
# Identifies up-day volume spikes that may be a buyable pocket pivot.  Based on the
# work of Gil Morales and Chris Kacher:
#
# http://www.wiley.com/WileyCDA/WileyTitle/productCd-0470616539,miniSiteCd-WILEYTRADING.html
# http://www.wiley.com/WileyCDA/WileyTitle/productCd-1118273028,miniSiteCd-WILEYTRADING.html
# http://www.aaiilosangeles.org/SkirballPresentations/Morales&Kacher091110.pdf
#
# This study checks price and volume to see if they met the pocket pivot
# criteria. The other criteria (strong fundamentals, no wedging, constructive
# basing, etc.) need to be evaluated separately. 
#
# I made these additions/modifications to Gil's and Chris's vague and sometimes
# conflicting definition of a pocket pivot:
#
# 1. Per Gil and Chris, the volume on the day of the pocket pivot must be
#    higher than any down day in the previous 10 days.  But if the volume is 
#    "choppy", then increase the period to 11 to 15 days.  But they don't 
#    define "choppy".  For the purposes of this script, I define choppy when 
#    the standard deviation of the volume is > 125% of the average.  Update: I
#    removed the stddev logic since it didn't eliminate any obviously poor
#    pivots.  I'm always looking at the volume on the previous 10 days.
#
# 2. I only count the pocket pivot if the stock closes in the 62% of the day's
#    price range.  Up days that close lower in the range are considered
#    stalling.
# 
# 3. Gil and Chris say daily price closes prior to the pivot should be "tight" 
#    without any specifics.  I defined tight as where the average percent price
#    change at close over the last 10 days is <= 1.5%. Update: I removed this 
#    rule after backtesting against Gil's examples.
# 
# 4. Gil and Chris have examples of pocket pivots off of the 50-day instead of
#    the 10-day.  At that point the stock is extended from the 10-day.  That
#    seems to conflict with the idea that a pocket pivot occurs after a quiet
#    period in the stock so I have not implemented rules for 50-day PPs here.
#
# 5. The low on the day of the pivot must be within 1.4% of the 10-day SMA or
#    the price must have moved up through the 10-day during that day.  Several
#    of Gil/Chris's examples conflict. (Example: 1.24 in one example is
#    described as too extended, but there are others where 1.6 or even 2.5%
#    above the 10-day SMA isn't too extended.  In the Trading Cockpit with the
#    O'Neil Disciples, Chapter 5.) I'm choosing to use a middle and slightly
#    conservative setting here.  The more extended, the more risky the buy.
#
# 6. Pocket pivots should not be bought when then stock is below the 50- or
#    200-day simple moving averages. I check only the 50-day here because when
#    I checked the 200-day, TOS was hiding the study for recent IPOs with less
#    than 200 days of price history.
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
AddChartBubble(IsVolumeGreaterHighestDownVolume && IsPriceInTheProperRange, low, "PP", Color.CYAN, no);